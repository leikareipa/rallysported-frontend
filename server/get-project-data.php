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
        !($projectData["manifesto"] = file_get_contents($_GET["projectName"] . '.$ft')))
    {
        exit(failure("Server-side IO failure."));
    }

    // The first four bytes give as an unsigned int the number of bytes in the MAASTO data.
    // We can use this to find out how many tiles the project's track has per side.
    $maastoDataLen = unpack("C4", $projectData["container"]);

    $projectData["trackWidth"] = $projectData["trackHeight"] = sqrt((($maastoDataLen[4] << 24) |
                                                                     ($maastoDataLen[3] << 16) |
                                                                     ($maastoDataLen[2] <<  8) |
                                                                     ($maastoDataLen[1])) / 2);

    // Sanity check. All tracks are expected to have either 64 or 128 tiles per side.
    if (!in_array($projectData["trackWidth"], [128, 64]))
    {
        exit(failure("Server-side data error: Invalid track dimensions."));
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
