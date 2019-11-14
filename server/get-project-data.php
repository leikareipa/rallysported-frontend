<?php

/*
 * Most recent known filename: server/get-project-data.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 * 
 */

// Verify input parameters.
{
    if (!isset($_GET["projectId"]))
    {
        exit(failure("Missing required parameter 'projectId'."));
    }

    if (!isset($_GET["editMode"]))
    {
        exit(failure("Missing required parameter 'editMode'."));
    }
}

// Sanitize the project identifier.
if (!preg_match('/^[0-9a-z]+$/', $_GET["projectId"]) ||
    (strlen($_GET["projectId"]) > 8))
{
    exit(failure("Malformed project identifier."));
}

// Enter the directory containing the project's data
$projectFolder = (($_GET["editMode"] === "shared")? "./assets/tracks/shared/"
                                                  : "./assets/tracks/local/");
if (!chdir($projectFolder . $_GET["projectId"] . "/"))
{
    exit(failure("A project by the given id does not exist on the server."));
}

// Read the project's data into an array, which is then converted into a JSON object.
{
    if (!($projectData["container"] = file_get_contents($_GET["projectId"] . ".dta")) ||
        !($projectData["manifesto"] = file_get_contents($_GET["projectId"] . '.$ft')) ||
        !($projectData["meta"] = json_decode(file_get_contents($_GET["projectId"] . ".meta.json"), true)))
    {
        exit(failure("Server-side IO failure."));
    }

    if (!isset($projectData["meta"]["baseName"]))
    {
        $projectData["meta"]["baseName"] = str_shuffle("unnamed");
    }

    $projectData["container"] = base64_encode($projectData["container"]);
}

exit(success(json_encode($projectData, JSON_PRETTY_PRINT)));

function failure($errorMessage = "")
{
    echo json_encode(["valid" => false, "message" => $errorMessage]);
}

function success($projectData)
{
    echo json_encode(["valid" => true, "data" => $projectData]);
}

?>
