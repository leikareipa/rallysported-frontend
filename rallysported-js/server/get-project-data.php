<?php namespace RallySportED;

/*
 * Most recent known filename: server/get-project-data.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 * 
 * Returns the RallySportED project data of a given track.
 * 
 */

require_once __DIR__."/response.php";

if (!isset($_GET["projectId"]))
{
    exit(Response::code(400)->error_message("Missing required parameter 'projectId'."));
}

// Sanitize the project identifier.
if ((strlen($_GET["projectId"]) > 8) ||
    !preg_match('/^[0-9A-Za-z]+$/', $_GET["projectId"]))
{
    exit(Response::code(400)->error_message("Malformed project identifier."));
}

// Enter the directory containing the project's data
$projectFolder = (__DIR__."/assets/tracks/");
if (!chdir($projectFolder . $_GET["projectId"] . "/"))
{
    exit(Response::code(404)->error_message("A project by the given ID does not exist on the server."));
}

// Read the project's data into an array, which is then converted into a JSON object.
{
    if (!($projectData["container"] = file_get_contents($_GET["projectId"] . ".dta")) ||
        !($projectData["manifesto"] = file_get_contents($_GET["projectId"] . '.$ft')) ||
        !($projectData["meta"] = json_decode(file_get_contents($_GET["projectId"] . ".meta.json"), true)))
    {
        exit(Response::code(500)->error_message("Failed to access the project's server-side data files."));
    }

    if (!isset($projectData["meta"]["internalName"]))
    {
        $projectData["meta"]["internalName"] = str_shuffle("unnamed");
    }

    $projectData["container"] = base64_encode($projectData["container"]);
}

// Note: We ask the client to cache the response data for up to 30 days, as
// these data are expected to change very infrequently.
exit(Response::code(200)->json($projectData, 2592000));
