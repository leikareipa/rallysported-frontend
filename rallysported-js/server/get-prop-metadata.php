<?php namespace RallySportED;

/*
 * Most recent known filename: server/get-prop-metadata.php
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 * 
 * Returns information about 3d track props - like vertex data, texture UV
 * coordinates, etc.
 * 
 */

require_once __DIR__."/response.php";

$propMetadata = file_get_contents(__DIR__."/assets/metadata/props.json");
if (!$propMetadata)
{
    exit(Response::code(500)->error_message("Could not access the server-side prop metadata."));
}

// Note: We ask the client to cache the metadata for up to 30 days, as these
// data rarely change.
exit(Response::code(200)->json(json_decode($propMetadata, true), 2592000));
