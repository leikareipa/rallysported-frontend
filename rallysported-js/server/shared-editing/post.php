<?php

/*
 * Most recent known filename: server/shared-editing/post.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
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
 * instance, the heightmap data will be provided in the manner of:
 * 
 *     "maasto":[1, 50, 20, 1],
 * 
 * where every other element gives an array index in the heightmap (x + y * width), and
 * the following element the new height at that index.
 * 
 * The data will be entered into the project's raw server-side data file, from which it
 * will be disseminated to the other participants in the shared editing.
 * 
 * The data will be disseminated to the other participants through cache files - a file
 * unique to each participant and which holds the relative byte offsets in the project's
 * server-side data file of all edits made by other participants. Any time a participant
 * makes a POST request, the server will check for them whether their cache file holds
 * new edits, fetching any altered data from the project's server-side data file to send
 * to the participant.
 * 
 * Having processed a client's POST request, the server will respond by sending back a
 * JSON object containing all edits produced by the other participants in the shared
 * editing since the client last made a POST request.
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
if (!preg_match('/^[a-z0-9]+$/', $_GET["projectName"]))
{
    exit(failure("Malformed project name."));
}

// Sanitize the participant id, since it'll be used to form a file path.
if (!preg_match('/^[a-z0-9]+$/', $_GET["participantId"]))
{
    exit(failure("Malformed participant id."));
}

if (!chdir("../assets/tracks/shared/" . $_GET["projectName"] . "/"))
{
    exit(failure("Invalid project name."));
}

$clientCacheFileName = ("participants/" . $postData["participantId"] . ".json");
if (!file_exists($clientCacheFileName))
{
    exit(failure("Couldn't find participant " . $_GET["participantId"] . ". They may have timed out on the server."));
}

// A list that'll hold the file handles of files we've locked using flock(). When a file
// on this list is unlocked, it should be manually removed from the list also.
$lockedFilesList = [];

$clientCacheFile = fopen($clientCacheFileName, "r+");
if (!$clientCacheFile || !lock_file($clientCacheFile))
{
    exit(failure("Failed to open the server-side cache file for this participant."));
}

$projectFileName = ($_GET["projectName"] . ".dta");
$projectFile = fopen($projectFileName, "r+b");
if (!$projectFile || !lock_file($projectFile))
{
    exit(failure("Failed to read the contents of the project's data file."));
}

// The different kinds of binary resource types we can work with.
$knownBinaryResourceTypes = ["maasto", "varimaa"];

// Load the contents of the client's cache file into memory, and reset it to an empty state
// on the server, ready to take in more data.
{
    $clientCache = json_decode(file_get_contents($clientCacheFileName), true);
    if (!$clientCache)
    {
        exit(failure("Failed to read the contents of this participant's server-side cache file."));
    }

    // We'll update the cache's timestamp to keep in mind that the client is an active
    // participant. If we didn't update the timestamp, the client would eventually be
    // considered inactive and kicked off the server.
    if (!ftruncate($clientCacheFile, 0) ||
        !fputs($clientCacheFile, '{"timestamp":' . time() . '}') ||
        !fflush($clientCacheFile))
    {
        exit(failure("Server-side data IO failure."));
    }
}

// Append the POSTed data to all other participants' cache files, and to the project's raw
// data files on the server.
{
    // Update the server-side data.
    {
        $projectMetainfo = json_decode(file_get_contents($_GET["projectName"] . ".meta.json"), true);
        if (!$projectMetainfo)
        {
            exit(failure("Failed to access project metainfo"));
        }

        $trackSize = ($projectMetainfo["width"] * $projectMetainfo["height"]);

        // Convert the data into a raw binary format, and save it.
        foreach ($knownBinaryResourceTypes as $resourceType)
        {
            if (isset($postData[$resourceType]))
            {
                if (!isset($projectMetainfo["binaryOffsets"][$resourceType]))
                {
                    exit(failure("Missing binary offset for '" . $resourceType . " in the project's metainfo."));
                }

                $c = count($postData[$resourceType]);

                // MAASTO data is always two bytes per element when saved into binary, while
                // the other kinds of binary data are one byte per element.
                $dataSizeMultiplier = ($resourceType === "maasto"? 2 : 1);

                // Sanity-check the input data size. For MAASTO and VARIMAA resources, there
                // should never be more elements in the resource array than there are tiles
                // on the track. (We add the track's size, since for each track tile the array
                // will contain a tile index for the corresponding datum.)
                if ($c > ($trackSize * $dataSizeMultiplier + $trackSize))
                {
                    exit(failure("Invalid size of input data."));
                }

                for ($i = 0; $i < $c; $i += 2)
                {
                    if ($postData[$resourceType][$i] >= $trackSize)
                    {
                        exit(failure("The input data contains a track tile index out of bounds."));
                    }
                    
                    $datum = $postData[$resourceType][$i+1];
                    $dataIndex = ($postData[$resourceType][$i] * $dataSizeMultiplier  + $projectMetainfo["binaryOffsets"][$resourceType]);

                    if (($dataIndex < 0) ||
                        ($dataIndex >= filesize($projectFileName)))
                    {
                        exit(failure("Detected a byte offset out of bounds for the project data file."));
                    }

                    // MAASTO height values are given as ints, but need to be split into two uchars each
                    // for exporting into Rally-Sport's format. So let's convert accordingly. (A description
                    // of this two-byte format is given in the documentation on Rally-Sport's data formats,
                    // at github.com/leikareipa/rallysported/tree/master/docs.)
                    if ($resourceType === "maasto")
                    {
                        $height = $datum;

                        if (($height < -510) ||
                            ($height > 255))
                        {
                            exit(failure("Detected a MAASTO height value outside of the acceptable range."));
                        }

                        $datum = pack("C2", ...integer_height_to_two_bytes($height));
                    }
                    else if ($resourceType === "varimaa")
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
                        exit(failure("Server-side data IO failure."));
                    }
                }
            }
        }

        fflush($projectFile);
    }

    // Update the participants' cache files. This also inspects each participant's cache
    // timestamp, and removes participants whose timestamp indicates long enough inactivity.
    $participantFileNames = scandir("participants");
    foreach ($participantFileNames as $fileName)
    {
        if (!is_file("participants/" . $fileName))
        {
            continue;
        }

        $fileInfo = pathinfo($fileName);

        if (($fileInfo["extension"] !== "json") ||
            ($fileInfo["filename"] === $postData["participantId"]))
        {
            continue;
        }

        $participantFileName = ("participants/" . $fileName);
        $participantFile = fopen($participantFileName, "r+");
        if (!$participantFile || !lock_file($participantFile))
        {
            exit(failure("Failed to open a participant's server-side cache file."));
        }
        else
        {
            $participantCache = json_decode(fread($participantFile, filesize($participantFileName)), true);
            if (!$participantCache)
            {
                exit(failure("Failed to read the contents of a participant's server-side cache file."));
            }

            // Remove participants that have been inactive for too long.
            $participantCacheTimeout = 60;
            if (!isset($participantCache["timestamp"]) ||
                (time() - $participantCache["timestamp"]) > $participantCacheTimeout)
            {
                unlock_file($participantFile);
                unlink("participants/" . $fileName);

                continue;
            }

            // Add the keys of the changed values to this participant's cache file. The
            // participant will later access the project's raw data file to get the up-
            // to-date values of the keys.
            foreach($knownBinaryResourceTypes as $resourceType)
            {
                if (isset($postData[$resourceType]))
                {
                    $c = count($postData[$resourceType]);
                    for ($i = 0; $i < $c; $i += 2)
                    {
                        $participantCache[$resourceType][] = $postData[$resourceType][$i];
                    }
                }
            }

            if (!file_put_contents(("participants/" . $fileName), json_encode(array_unique($participantCache, SORT_REGULAR))))
            {
                exit(failure("Server-side data IO failure."));
            }
        }
        
        unlock_file($participantFile);
        fclose($participantFile);
    }
}

// Inspect the client's cache for edits made by other participants. For any such edits,
// fetch the new values from the project's raw data file, and send them back to the client
// as a JSON response.
$responseData = [];
{
    foreach ($knownBinaryResourceTypes as $resourceType)
    {
        if (isset($clientCache[$resourceType]))
        {
            if (!isset($projectMetainfo["binaryOffsets"]) ||
                !isset($projectMetainfo["binaryOffsets"][$resourceType]))
            {
                exit(failure("Incorrect binary offsets in the project's metainfo."));
            }

            $c = count($clientCache[$resourceType]);
            for ($i = 0; $i < $c; $i++)
            {
                $dataIndex = ($clientCache[$resourceType][$i] * ($resourceType === "maasto"? 2 : 1) + $projectMetainfo["binaryOffsets"][$resourceType]);
                $value = 0;

                if ($resourceType === "maasto")
                {
                    $byte1 = 0;
                    $byte2 = 0;

                    if (fseek($projectFile, $dataIndex) !== 0 ||
                        (($byte1 = fread($projectFile, 1)) === false) ||
                        (($byte2 = fread($projectFile, 1)) === false))
                    {
                        exit(failure("Server-side data IO failure."));
                    }

                    $value = two_byte_height_to_integer(unpack("C", $byte1)[1],
                                                        unpack("C", $byte2)[1]);
                }
                else if ($resourceType === "varimaa")
                {
                    if (fseek($projectFile, $dataIndex) !== 0 ||
                        (($value = fread($projectFile, 1)) === false))
                    {
                        exit(failure("Server-side data IO failure."));
                    }

                    $value = unpack("C", $value)[1];
                }
                else
                {
                    exit(failure("Unknown resource type."));
                }

                $responseData[$resourceType][] = $clientCache[$resourceType][$i];
                $responseData[$resourceType][] = $value;
            }
        }
    }

    exit(success($responseData));
}

function failure($errorMessage = "")
{
    unlock_all_locked_files();
    echo json_encode(["valid" => false, "message" => $errorMessage]);
}

function success($cacheData)
{
    unlock_all_locked_files();
    echo json_encode(["valid" => true, "data" => $cacheData]);
}

function lock_file($fileHandle)
{
    global $lockedFilesList;

    if (!flock($fileHandle, LOCK_EX)) return false;
    else
    {
        $lockedFilesList[] = $fileHandle;
        return true;
    }
}

function unlock_file($fileHandle)
{
    global $lockedFilesList;

    if (!flock($fileHandle, LOCK_UN)) return false;
    else
    {
        unset($lockedFilesList[array_search($fileHandle, $lockedFilesList)]);
        return true;
    }
}

function unlock_all_locked_files()
{
    global $lockedFilesList;

    foreach ($lockedFilesList as $file)
    {
        flock($file, LOCK_UN);
    }
}

// Converts Rally-Sport's two-byte heightmap value into RallySportED's integer format.
// (For more information about Rally-Sport's heightmaps, see the data format documentation
// at github.com/leikareipa/rallysported/tree/master/docs.)
function two_byte_height_to_integer($byte1, $byte2)
{
    // Special case: more than -255 below ground level.
    if ($byte2 == 1)
    {
        return (-256 - $byte1);
    }
    // Above ground when b2 == 255, otherwise below ground.
    else
    {
        return ($byte2 - $byte1);
    }
}

// Converts RallySportED's heightmap value into Rally-Sport's two-byte height format.
// (For more information about Rally-Sport's heightmaps, see the data format documentation
// at github.com/leikareipa/rallysported/tree/master/docs.)
function integer_height_to_two_bytes($height)
{
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

    return [$byte1, $byte2];
}

?>
