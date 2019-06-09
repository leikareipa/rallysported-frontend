/*
 * Most recent known filename: js/track/maasto.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

Rsed.track.maasto = function(maastoWidth = 0, maastoHeight = 0, data = Uint8Array)
{
    Rsed.assert && (maastoWidth === maastoHeight)
                || Rsed.throw("Expected MAASTO width and height to be equal.");

    Rsed.assert && ((maastoWidth > 0) &&
                    (maastoHeight > 0))
                || Rsed.throw("Expected MAASTO width and height to be positive and non-zero.");

    const maxHeightmapValue = 255;
    const minHeightmapValue = -510;

    const publicInterface =
    {
        width: maastoWidth,
        height: maastoHeight,

        // Returns the MAASTO height of the tile at the given track tile coordinates.
        tile_at: (x = 0, y = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            // MAASTO data is two bytes per tile.
            const idx = ((x + y * maastoWidth) * 2);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return 0;
            }

            return two_byte_height_as_integer(data[idx], data[idx+1]);
        },

        // Alter the MAASTO heightmap at the given tile.
        set_tile_value_at: (x = 0, y = 0, newHeight = 0)=>
        {
            newHeight = Math.max(minHeightmapValue, Math.min(maxHeightmapValue, newHeight));

            x = Math.floor(x);
            y = Math.floor(y);

            // Note: MAASTO data is two bytes per tile, so we multiply the idx by two.
            const idx = ((x + y * maastoWidth) * 2);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return;
            }

            [data[idx], data[idx+1]] = [...integer_height_as_two_bytes(newHeight)];
        },
    };
    
    return publicInterface;

    // Converts Rally-Sport's two-byte heightmap value into RallySportED's integer format.
    // (For more information about Rally-Sport's heightmaps, see the data format documentation
    // at github.com/leikareipa/rallysported/tree/master/docs.)
    function two_byte_height_as_integer(byte1, byte2)
    {
        // Special case: more than -255 below ground level.
        if (byte2 == 1)
        {
            return (-256 - byte1);
        }
        // Above ground when b2 == 255, otherwise below ground.
        else
        {
            return (byte2 - byte1);
        }
    }

    // Converts RallySportED's heightmap value into Rally-Sport's two-byte height format.
    // (For more information about Rally-Sport's heightmaps, see the data format documentation
    // at github.com/leikareipa/rallysported/tree/master/docs.)
    function integer_height_as_two_bytes(height)
    {
        let byte1 = 0;
        let byte2 = 0;

        if (height > 0)
        {
            byte2 = 255;
            byte1 = (255 - height);
        }
        else if (height <= 0)
        {
            if (height < -255)
            {
                byte2 = 1;
                byte1 = (Math.abs(height) - 256);
            }
            else
            {
                byte2 = 0;
                byte1 = Math.abs(height);
            }
        }

        return [byte1, byte2];
    }
};
