/*
 * Most recent known filename: js/constants.js
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.constants = Object.freeze(
{
    // The resolution of a PALA texture.
    palaWidth: 16,
    palaHeight: 16,

    // For rendering; the side length, in world units, of a single ground tile.
    groundTileSize: 128,

    // The margins, in number of tiles, on the sides of the track past which the user is
    // not allowed to move props (so that they don't accidentally get moved out of reach,
    // etc.).
    propTileMargin: 2,
});
