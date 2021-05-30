/*
 * Most recent known filename: js/track/varimaa.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides information about and the means to modify a track's tilemap (which Rally-Sport
// calls "VARIMAA"). For more information about the track tilemap format used in Rally-Sport,
// check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.gameContent.varimaa = function(varimaaWidth = 0, varimaaHeight = 0, data = Uint8Array)
{
    Rsed.assert && (varimaaWidth === varimaaHeight)
                || Rsed.throw("Expected VARIMAA width and height to be equal.");

    Rsed.assert && ((varimaaWidth > 0) &&
                    (varimaaHeight > 0))
                || Rsed.throw("Expected VARIMAA width and height to be positive and non-zero.");

    Rsed.assert && (data.byteLength === (varimaaWidth * varimaaHeight))
                || Rsed.throw("Mismatched VARIMAA data length relative to its dimensions.");

    const publicInterface = 
    {
        width: varimaaWidth,
        height: varimaaHeight,

        // Returns the PALA index of the tile at the given track tile coordinates.
        tile_at: (x = 0, y = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * varimaaWidth);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return 0;
            }

            return data[idx];
        },

        // Alter the PALA index at the given tile.
        set_tile_value_at: (x = 0, y = 0, newPalaIdx = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * varimaaWidth);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return;
            }

            data[idx] = newPalaIdx;
        },
    };
    
    return publicInterface;
};
