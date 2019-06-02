<?php

/*
 * Most recent known filename: server/shared/post.php
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 * Serves POST requests made by the client in shared-editing mode.
 * 
 * A POST request in shared-editing mode will be sent by the client (identified by the
 * 'participantId' parameter) to ask the server to disseminate to the other participants
 * a set of edits the client has made to the project identified by the 'projectName'
 * parameter.
 * 
 * The data will be submitted as a JSON string storing the new data in array form. For
 * instance, the heightmap data will be given in a way along the lines of
 * 
 *     "maasto":[1, 50, 20, 1].
 * 
 * Here, every other element gives an index in the heightmap, and the following element
 * the new height at that index.
 * 
 * The edits will be disseminated to the other participants by storing them in the cache
 * file of each participant, from which that participant will receive them when they (in
 * time) make the relevant GET request to poll the server for it. The edits will also be
 * stored in the server-side raw project data files (e.g. .DTA and .$FT), from which all
 * new participants will receive them when they first establish a connection to that shared-
 * mode project.
 * 
 * Note that a current participant isn't 100% guaranteed to ever receive the data POSTed
 * here; as their client might e.g. disconnect before coming to issue the GET request.
 * However, once that client reconnects, they will receive the complete and up-to-date
 * project data.
 *
 */

$postData = json_decode(file_get_contents("php://input"), true);

if (!$postData ||
    !isset($_GET["participantId"]) ||
    !isset($_GET["projectName"]))
{
    exit(failure("Missing required parameters."));
}

// Sanitize the project name, since it'll be used to form a file path.
if (!preg_match('/^[a-z]+$/', $_GET["projectName"]))
{
    exit(failure("Malformed project name."));
}

// Sanitize the participant id, since it'll be used to form a file path.
if (!preg_match('/^[a-z0-9]+$/', $_GET["participantId"]))
{
    exit(failure("Malformed participant id."));
}

// Assumes that the server is located two steps above to where the shared projects
// are stored on the server.
/// TODO: This is a bit kludgy, but works for now.
if (!chdir("../../track-list/shared/projects/" . $_GET["projectName"] . "/"))
{
    exit(failure("Invalid project name."));
}

// Verify that this is a valid user id.
if (!file_exists("participants/" . ($postData["participantId"] . ".json")))
{
    exit(failure("Couldn't find participant " . $_GET["participantId"] . "."));
}

// Append the POSTed data to all other participants' cache files, and to the project's raw
// data files on the server.
{
    // The different kinds of binary resource types we can work with.
    $knownBinaryResourceTypes = ["maasto", "varimaa"];

    // Update the server-side data.
    {
        $projectMetainfo = json_decode(file_get_contents($_GET["projectName"] . ".meta.json"), true);

        if ($projectMetainfo === null)
        {
            exit(failure("Failed to access project metainfo"));
        }

        $projectFile = fopen(($_GET["projectName"] . ".dta"), "cb");

        if (!$projectFile || !flock($projectFile, LOCK_EX))
        {
            exit(failure("Failed to read the contents of the project's data file."));
        }
        else
        {
            foreach ($knownBinaryResourceTypes as $resource)
            {
                if (isset($postData[$resource]))
                {
                    if (!isset($projectMetainfo["binaryOffsets"]) ||
                        !isset($projectMetainfo["binaryOffsets"][$resource]))
                    {
                        exit(failure("Incorrect binary offsets in the project's metainfo."));
                    }

                    // Convert the data into a raw binary format, and save it.
                    for ($i = 0; $i < count($postData[$resource]); $i += 2)
                    {
                        // Note: MAASTO data is always two bytes per element.
                        $datum = $postData[$resource][$i+1];
                        $dataIndex = ($postData[$resource][$i] * ($resource === "maasto"? 2 : 1) + $projectMetainfo["binaryOffsets"][$resource]);

                        // Bounds-check.
                        if (($dataIndex < 0) ||
                            ($dataIndex >= ($projectMetainfo["trackWidth"] * $projectMetainfo["trackHeight"])))
                        {
                            exit(failure("Detected data out of bounds."));
                        }

                        // MAASTO height values are given as ints, but need to be split into two uchars each
                        // for exporting into Rally-Sport's format. So let's convert accordingly. (A description
                        // of this two-byte format is given in the documentation on Rally-Sport's data formats,
                        // at github.com/leikareipa/rallysported/tree/master/docs.)
                        if ($resource === "maasto")
                        {
                            $height = $datum;

                            if (($height < -510) ||
                                ($height > 255))
                            {
                                exit(failure("Detected a MAASTO height value outside of the acceptable range." . $height));
                            }

                            $byte1 = 0;
                            $byte2 = 0;
            
                            if ($height > 0)
                            {
                                $byte2 = 255;
                                $byte1 = (255 - $height);
                            }
                            else if ($height <= 0)
                            {
                                if ($height < -255)
                                {
                                    $byte2 = 1;
                                    $byte1 = (abs($height) - 256);
                                }
                                else
                                {
                                    $byte2 = 0;
                                    $byte1 = abs($height);
                                }
                            }

                            $datum = pack("C2", $byte1, $byte2);
                        }
                        else if ($resource === "varimaa")
                        {
                            $tileIdx = $datum;

                            if (($tileIdx < 0) ||
                                ($tileIdx > 255))
                            {
                                exit(failure("Detected a VARIMAA tile index outside of the acceptable range."));
                            }

                            $datum = pack("C", $tileIdx);
                        }
                        else
                        {
                            exit(failure("Unknown resource type."));
                        }

                        if (fseek($projectFile, $dataIndex) !== 0 ||
                            !fwrite($projectFile, $datum))
                        {
                            fflush($projectFile);
                            flock($projectFile, LOCK_UN);
                            exit(failure("Server-side data IO failure."));
                        }
                    }
                }
            }
            fflush($projectFile);
            flock($projectFile, LOCK_UN);
        }
    }

    // Update the participants' cache files. This will also inspect each participant's
    // cache timestamp, and remove participants whose timestamp indicates long inactivity.
    $participantFileNames = scandir("participants");
    foreach ($participantFileNames as $fileName)
    {
        if (!is_file("participants/" . $fileName)) continue;

        $fileInfo = pathinfo($fileName);

        if (($fileInfo["extension"] !== "json") ||
            ($fileInfo["filename"] === $postData["participantId"]))
        {
            continue;
        }

        $fileLock = fopen(("participants/" . $fileName), "r+");
        if (!$fileLock || !flock($fileLock, LOCK_EX))
        {
            exit(failure("Failed to open the server-side cache file for this participant."));
        }
        else
        {
            $participantCache = json_decode(file_get_contents("participants/" . $fileName), true);

            if ($participantCache === null)
            {
                exit(failure("Failed to read the contents of this participant's server-side cache file."));
            }

            // Remove participants that have been inactive for too long.
            $participantCacheTimeout = 60;
            if (!isset($participantCache["timestamp"]) ||
                (time() - $participantCache["timestamp"]) > $participantCacheTimeout)
            {
                unlink("participants/" . $fileName);
                continue;
            }

            foreach($knownBinaryResourceTypes as $resource)
            {
                if (isset($postData[$resource]))
                {
                    if (!isset($participantCache[$resource])) $participantCache[$resource] = [];
                    
                    $participantCache[$resource] = array_merge($participantCache[$resource], $postData[$resource]);
                }
            }

            if (!file_put_contents(("participants/" . $fileName), json_encode($participantCache)))
            {
                fflush($fileLock);
                flock($fileLock, LOCK_UN);
                exit(failure("Server-side data IO failure."));
            }
        }
        fflush($fileLock);
        flock($fileLock, LOCK_UN);
    }
}

exit(success());

function failure($errorMessage = "")
{
    echo json_encode(["valid" => false, "message" => $errorMessage]);
}

function success()
{
    echo json_encode(["valid" => true]);
}

?>
