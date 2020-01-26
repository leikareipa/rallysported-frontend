/*
 * Most recent known filename: js/visual/texture.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.visual = Rsed.visual || {};

// Implements a 32-bit texture whose output interface is compatible with the retro n-gon
// renderer's texture_rgba() object (so that n-gons can be textured with the object from
// this function and rendered with the retro n-gon renderer).
Rsed.visual.texture = function(args = {})
{ 
    args =
    {
        ...{
            // Pixel RGB values, each element being {red, green, blue} (value range 0-255).
            pixels: [],

            // Each pixel's corresponding palette index.
            indices: [], 

            // The texture's dimensions.
            width: 0,
            height: 0,

            // Whether to flip (mirror) the texture's pixels.
            flipped: "no", // | "vertical"
        },
        ...args
    };

    Rsed.assert && ((args.width > 0) &&
                    (args.height > 0) &&
                    (args.pixels.length) &&
                    (args.indices.length))
                || Rsed.throw("Expected non-empty texture data.");

    Rsed.assert && ((args.indices.length === (args.width * args.height)) &&
                    (args.pixels.length === (args.width * args.height)) &&
                    (args.indices.length === args.pixels.length))
                || Rsed.throw("Mismatch between size of texture data and its resolution.");

    switch (args.flipped)
    {
        case "no": break;
        case "vertical":
        {
            for (let y = 0; y < args.height/2; y++)
            {
                // Swap horizontal rows vertically.
                for (let x = 0; x < args.width; x++)
                {
                    const idxTop = (x + y * args.width);
                    const idxBottom = (x + (args.height - y - 1) * args.width);

                    [args.pixels[idxTop], args.pixels[idxBottom]] = [args.pixels[idxBottom], args.pixels[idxTop]];
                    [args.indices[idxTop], args.indices[idxBottom]] = [args.indices[idxBottom], args.indices[idxTop]];
                }
            }

            break;
        }
        default: Rsed.throw("Unknown texture-flipping mode."); break;
    }

    // Note: The elements of the 'pixels' array are returned by reference (they're objects of the
    // form {red, green, blue, alpha}). This is done to allow textures to be pre-generated and still
    // have their colors reflect any changes to the global palette without requiring a re-generation.
    const publicInterface = Object.freeze(
    {
        width: args.width,
        height: args.height,
        flipped: args.flipped,
        pixels: args.pixels,
        indices: args.indices,
    });

    return publicInterface;
}
