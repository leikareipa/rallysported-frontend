/*
 * Most recent known filename: js/misc/constants.js
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.constants = Object.freeze(
{
    // The resolution, in pixels, of a PALA texture.
    palaWidth: 16,
    palaHeight: 16,

    // For rendering; the side length, in world units, of a single ground tile.
    groundTileSize: 128,

    // The margins, in number of tiles, on the sides of the track past which the user is
    // not allowed to move props (so that they don't accidentally get moved out of reach,
    // etc.).
    propTileMargin: 2,

    // The maximum number of props on a track.
    maxPropCount: 14,

    // How many hard-coded palettes there are in Rally-Sport's demo version.
    numPalettes: 4,

    // How many colors there are per palette.
    paletteSize: 32,

    // A URL pointing to the root of Rally-Sport Content, the service from which
    // RallySportED-js will fetch track data. It would ideally be located on the
    // same origin, to avoid CORS issues.
    rallySportContentURL: `${window.location.origin}/rallysport-content/`,
});
