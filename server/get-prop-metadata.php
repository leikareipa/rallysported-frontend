<?php

/*
 * Most recent known filename: server/get-prop-metadata.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 * 
 */

$metaData = file_get_contents("../server/assets/metadata/props.json");

if (!$metaData)
{
    exit(failure("Server-side IO failure: Could not read prop metadata file."));
}

exit(success($metaData));

function failure($errorMessage = "")
{
    echo json_encode(["valid" => false, "message" => $errorMessage]);
}

function success($propMetadata)
{
    echo json_encode(["valid" => true, "data" => $propMetadata]);
}

?>
