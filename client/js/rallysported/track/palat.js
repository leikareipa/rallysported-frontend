/*
 * Most recent known filename: js/track/palat.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about and the means to modify a track's textures (which are called
// "PALA" in Rally-Sport). For more information about the track texture format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
//
// The palaWidth and palaHeight parameters give the dimensions of a single PALA texture; which
// would typically be 16 x 16. The data array contains the pixels of all of the track's PALA
// textures (normally, about 256 of them), arranged so that the first (width * height) bytes
// are the pixels of the first texture, the next (width * height) bytes those of the second
// texture, etc. Each byte in the array gives the corresponding pixel's RGB color as a palette
// index.
Rsed.track.palat = function(palaWidth = 0, palaHeight = 0, data = Uint8Array)
{
    Rsed.assert && (palaWidth === palaHeight)
                || Rsed.throw("Expected PALA width and height to be equal.");

    Rsed.assert && ((palaWidth > 0) &&
                    (palaHeight > 0))
                || Rsed.throw("Expected PALA width and height to be positive and non-zero.");

    const palatPixels = Array.from(data, (colorIdx)=>Rsed.palette.color_at_idx(colorIdx, false));
    const palatPixelsWithAlpha = Array.from(data, (colorIdx)=>Rsed.palette.color_at_idx(colorIdx, true));

    const palaSize = (palaWidth * palaHeight);

    // Pre-compute the individual PALA textures.
    const prebakedPalaTextures = new Array(256).fill().map((pala, idx)=>generate_texture(idx));

    const publicInterface = Object.freeze(
    {
        width: palaWidth,
        height: palaHeight,
        texture: Object.freeze(prebakedPalaTextures),
    });

    // Returns the given PALA's pixel data as a texture, whose arguments are set as given.
    function generate_texture(palaId = 0, args = {})
    {
        args =
        {
            ...{
                flipped: "vertical",
            },
            ...args,
        }
        
        const dataIdx = (palaId * palaSize);

        // For attempts to access the PALA data out of bounds, return a dummy texture.
        if ((dataIdx < 0) ||
            ((dataIdx + palaSize) >= data.byteLength))
        {
            return Rsed.texture(
            {
                ...args,
                width: 1,
                height: 1,
                pixels: [Rsed.palette.color_at_idx("black")],
                indices: [0],
            });
        }

        // Billboard PALAs will have alpha-testing enabled (so color index 0 is see-through),
        // while other PALAs will not.
        const isBillboardPala = ((palaId == 176) ||
                                 (palaId == 177) ||
                                ((palaId >= 208) && (palaId <= 239)));

        return Rsed.texture(
        {
            ...args,
            width: palaWidth,
            height: palaHeight,
            pixels: (isBillboardPala? palatPixelsWithAlpha : palatPixels).slice(dataIdx, (dataIdx + palaSize)),
            indices: data.slice(dataIdx, (dataIdx + palaSize)),
            flipped: "no",
        });
    }
    
    return publicInterface;
};
