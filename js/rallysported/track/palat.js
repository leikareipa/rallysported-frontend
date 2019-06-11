/*
 * Most recent known filename: js/track/palat.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

Rsed.track.palat = function(palaWidth = 0, palaHeight = 0, data = Uint8Array)
{
    Rsed.assert && (palaWidth === palaHeight)
                || Rsed.throw("Expected PALA width and height to be equal.");

    Rsed.assert && ((palaWidth > 0) &&
                    (palaHeight > 0))
                || Rsed.throw("Expected PALA width and height to be positive and non-zero.");

    const pixels = [].map.call(data, (colorIdx)=>Rsed.palette.color(colorIdx));

    const palaSize = (palaWidth * palaHeight);

    const publicInterface =
    {
        width: palaWidth,
        height: palaHeight,
        
        // Returns a copy of the individual PALA texture at the given index.
        texture:(palaId = 0, args = {/*alpha:true|false,*/})=>
        {
            Rsed.assert && Number.isInteger(palaId)
                        || Rsed.throw("Expected integer parameters.");

            const dataIdx = (palaId * palaSize);

            // If the request is out of bounds, return a dummy texture.
            if ((dataIdx < 0) || ((dataIdx + palaSize) >= data.byteLength))
            {
                return Rsed.texture(
                {
                    width: 1,
                    height: 1,
                    alpha: args.alpha,
                    pixels: [Rsed.palette.color("black")],
                    indices: [0],
                });
            }

            return Rsed.texture(
            {
                width: palaWidth,
                height: palaHeight,
                alpha: args.alpha,
                flipped: "vertical",
                pixels: pixels.slice(dataIdx, (dataIdx + palaSize)),
                indices: data.slice(dataIdx, (dataIdx + palaSize)),
            });
        }
    };

    Rsed.ui_draw_n.prebake_palat_pane();
    
    return publicInterface;
};
