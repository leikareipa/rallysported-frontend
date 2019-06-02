<?php

/*
 * Most recent known filename: server/shared/get.php
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 * Serves GET requests made by the client in shared-editing mode.
 * 
 * A GET request in shared-editing mode will be sent by the client to ask the server
 * to send back (as a JSON response) all of the edits made by the other participants
 * to a particular shared project (identified by the 'projectName' parameter) since
 * the client last sent a GET request.
 * 
 * The edits made by the other participants will have been pooled into a server-side
 * cache file specific to the client (who is identified by the 'participantId' parameter);
 * so we'll just access this file, enter its data into a JSON object, and send back
 * as a response.
 *
 */

if (!isset($_GET["participantId"]) ||
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
    exit(failure("Malformed participant id." . $_GET["participantId"]));
}

// Assumes that the server is located two steps above to where the shared projects
// are stored on the server.
/// TODO: This is a bit kludgy, but works for now.
if (!chdir("../../track-list/shared/projects/" . $_GET["projectName"] . "/participants/"))
{
    exit(failure("Invalid project directory."));
}

$clientCacheFileName = ($_GET["participantId"] . ".json");

// Verify that this is a valid user id.
if (!file_exists($clientCacheFileName))
{
    exit(failure("Invalid participant id. This participant may have timed out."));
}

// Send the data.
{
    // The different kinds of binary resource types we can work with. These are the types
    // of edit data we'll send back to the client.
    $knownBinaryResourceTypes = ["maasto", "varimaa"];

    $fileLock = fopen($clientCacheFileName, "r+");
    if (!$fileLock || !flock($fileLock, LOCK_EX))
    {
        exit(failure("Failed to open the server-side cache file for this participant."));
    }
    else
    {
        $clientCache = json_decode(file_get_contents($clientCacheFileName), true);
        
        if ($clientCache === null)
        {
            fflush($fileLock);
            flock($fileLock, LOCK_UN);
            exit(failure("Failed to read the contents of this participant's server-side cache file."));
        }

        $responseData = [];
        foreach ($knownBinaryResourceTypes as $resourceType)
        {
            if (isset($clientCache[$resourceType])) $responseData[$resourceType] = $clientCache[$resourceType];
        }

        // Since we've now processed all of the client's server-side cache, we can empty it
        // out; to be accumulated again with new edits. Note that we update the cache's time-
        // stamp to keep in mind that this is an active participant. If we didn't update the
        // timestamp, the client would eventually be considered inactive and kicked off the
        // server.
        if (!file_put_contents($clientCacheFileName, '{"timestamp":' . time() . '}'))
        {
            fflush($fileLock);
            flock($fileLock, LOCK_UN);
            exit(failure("Server-side data IO failure."));
        }
    }
    fflush($fileLock);
    flock($fileLock, LOCK_UN);

    exit(success(($responseData)));
}

function failure($errorMessage = "")
{
    echo json_encode(["valid" => false, "message" => $errorMessage, "data" => null]);
}

function success($data)
{
    echo json_encode(["valid" => true, "data" => $data]);
}

?>
