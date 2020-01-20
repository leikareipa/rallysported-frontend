<?php

/*
 * Most recent known filename: server/shared-editing/register.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 * 
 * Registers a new participant in shared-editing mode of the project identified by the
 * 'projectName' parameter.
 * 
 * A participant is registered by creating on the server a cache file in the calling client's
 * name, into which we'll accumulate edits made by the other participants, so that the client
 * can query us for those edits to keep up their local state.
 * 
 * An id string uniquely identifying the new participant will be returned in a JSON response.
 * The client should store this id, since they will need to provide it any time they poll the
 * server about their data there (e.g. to fetch the contents of their cache file, or to push
 * onto the server their local edits for the other paricipants to see).
 * 
 */

if (!isset($_GET["projectName"]))
{
    exit(failure("Missing required parameters."));
}

// Sanitize the project name, since it'll be used to form a file path.
if (!preg_match('/^[a-z0-9]+$/', $_GET["projectName"]))
{
    exit(failure("Malformed project name."));
}

// To register the user on the server, we'll create for them a server-side cache file.
// All edits by other participants will be accumulated into this file, and its contents
// will be sent to the client when they request for it.
{
    // Derive a random-ish, (hopefully) unique user id.
    $newParticipantId = strtolower(str_shuffle(uniqid() . bin2hex(random_bytes(10))));

    $clientCacheFileName = ("../assets/tracks/shared/" . $_GET["projectName"] . "/participants/" . $newParticipantId . ".json");
    if (file_exists($clientCacheFileName))
    {
        exit(failure("A participant of the given name already exists."));
    }

    $jsonFile = fopen($clientCacheFileName, "x");
    if (!$jsonFile || !flock($jsonFile, LOCK_EX))
    {
        exit(failure("Failed to create this participant's server-side cache file."));
    }
    else
    {
        // We'll initialize the cache file with a timestamp to keep track of whether this
        // participant is active. The timestamp will be updated each time the user polls
        // the server for the contents of this file. Once they become inactive, we'll remove
        // them as a participant (and delete their cache file).
        if (!fputs($jsonFile, '{"timestamp":' . time() . '}'))
        {
            flock($jsonFile, LOCK_UN);
            exit(failure("Server-side IO failure."));
        }
    }

    fflush($jsonFile);
    flock($jsonFile, LOCK_UN);
}

exit(success($newParticipantId));

function failure($errorMessage = "")
{
    echo json_encode(["valid" => false, "message" => $errorMessage, "participantId" => null]);
}

function success($newId)
{
    echo json_encode(["valid" => true, "participantId" => $newId]);
}

?>
