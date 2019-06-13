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

    const pixels = [].map.call(data, (colorIdx)=>Rsed.palette.color(colorIdx));

    const palaSize = (palaWidth * palaHeight);

    // Pre-compute the individual PALA textures.
    const prebakedPalaTextures = new Array(256).fill().map((pala, idx)=>
    {
        return generate_texture(idx,
                                {
                                    alpha: false,
                                    flipped: "vertical",
                                });
    });

    const publicInterface = Object.freeze(
    {
        width: palaWidth,
        height: palaHeight,
        texture: Object.freeze(prebakedPalaTextures),

        // Generates a texture of the given PALA using the given arguments. You'd call this
        // function if the pre-baked version of the texture wasn't generated with suitable
        // arguments for you purposes - for instance, if it was generated with vertical flip,
        // but you want it without the flip.
        generate_texture: (palaId = 0, args = {})=>
        {
            // If the arguments provided don't actually necessitate a re-generating of the
            // texture (some arguments are just hints about how the texture should be rendered
            // and don't affect the texture data, per se), we can return the pre-generated
            // texture along with the new arguments.
            if ((typeof args.flipped === "undefined") ||
                (args.flipped === "vertical")) // Assume the pre-baked textures are generated with vertical flip.
            {
                return {...prebakedPalaTextures[palaId], ...args};
            }

            // Otherwise, re-generate the whole texture.
            return generate_texture(palaId, args);
        },
    });

    Rsed.ui_draw_n.prebake_palat_pane();

    // Returns the given PALA's pixel data as a texture, whose arguments are set as given.
    function generate_texture(palaId = 0, args = {})
    {
        args =
        {
            // NOTE: If you change these default values, you may need to reflect the changes in
            // publicInterface.generate_texture(), as well; which, for instance, expects that
            // textures are generated with vertical flip, by default.
            ...
            {
                alpha: true,
                flipped: "vertical",
            },
            ...args,
        }
        
        const dataIdx = (palaId * palaSize);

        // For attempts to access the PALA data out of bounds, return a dummy texture.
        if ((dataIdx < 0) ||
            ((dataIdx + palaSize) >= pixels.length) ||
            ((dataIdx + palaSize) >= data.byteLength))
        {
            return Rsed.texture(
            {
                ...args,
                width: 1,
                height: 1,
                pixels: [Rsed.palette.color("black")],
                indices: [0],
            });
        }

        return Rsed.texture(
        {
            ...args,
            width: palaWidth,
            height: palaHeight,
            pixels: pixels.slice(dataIdx, (dataIdx + palaSize)),
            indices: data.slice(dataIdx, (dataIdx + palaSize)),
        });
    }
    
    return publicInterface;
};
