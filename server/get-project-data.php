<?php

/*
 * Most recent known filename: server/get-project-data.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 * 
 */

if (!isset($_GET["projectName"]))
{
    exit(failure("Missing required parameters."));
}

// Sanitize the project name.
if (!preg_match('/^[0-9a-z]+$/', $_GET["projectName"]) ||
    (strlen($_GET["projectName"]) > 8))
{
    exit(failure("Malformed project name."));
}

// Enter the directory containing the project's data
if (!chdir("../track-list/server/" . $_GET["projectName"] . "/"))
{
    exit(failure("A project by this name does not exist on the server."));
}

// Read the project's data into an array, which is then converted into a JSON object.
{
    if (!($projectData["container"] = file_get_contents($_GET["projectName"] . ".dta")) ||
        !($projectData["manifesto"] = file_get_contents($_GET["projectName"] . '.$ft')) ||
        !($projectData["meta"] = json_decode(file_get_contents($_GET["projectName"] . ".meta.json"), true)))
    {
        exit(failure("Server-side IO failure."));
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
