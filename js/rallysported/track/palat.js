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

    // Pre-compute the individual PALA textures.
    const palaTextures = new Array(256).fill().map((pala, idx)=>
    {
        const dataIdx = (idx * palaSize);

        // For PALA textures that are missing in the source data, return a dummy texture.
        if ((dataIdx + palaSize) >= data.byteLength)
        {
            return Rsed.texture(
            {
                width: 1,
                height: 1,
                alpha: false,
                pixels: [Rsed.palette.color("gray")],
                indices: [0],
            });
        }

        return Rsed.texture(
        {
            width: palaWidth,
            height: palaHeight,
            alpha: false,
            flipped: "vertical",
            pixels: pixels.slice(dataIdx, (dataIdx + palaSize)),
            indices: data.slice(dataIdx, (dataIdx + palaSize)),
        });
    });

    const publicInterface =
    {
        width: palaWidth,
        height: palaHeight,
        
        // Returns a copy of the individual PALA texture at the given index.
        texture:(palaId = 0, args = {/*alpha:true|false,*/})=>
        {
            Rsed.assert && ((palaId >= 0) &&
                            (palaId < palaTextures.length))
                        || Rsed.throw("Attempting to access PALA textures out of bounds.");

            return Object.freeze({...palaTextures[palaId], alpha:args.alpha});
        }
    };

    Rsed.ui_draw_n.prebake_palat_pane();
    
    return publicInterface;
};
