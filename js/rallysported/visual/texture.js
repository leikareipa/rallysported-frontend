/*
 * Most recent known filename: js/texture.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.texture = function(args = {})
{
    args =
    {
        ...
        {
            pixels: [],
            indices: [],
            width: 0,
            height: 0,
            alpha: false,
            flipped: "no", // | "vertical"
        },
        ...args
    };

    Rsed.assert && ((args.width > 0) &&
                    (args.height > 0))
                || Rsed.throw("Expected texture width and height to be positive and non-zero.");

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

    const publicInterface =
    {
        ...args
    };

    return publicInterface;
}
