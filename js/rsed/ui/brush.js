/*
 * Most recent known filename: js/ui/brush.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 */

"use strict";

const ui_brush_n = (function()
{
    // How large of a radius the brush paints with. A value of 0 means one tile.
    let brushSize = 0;

    // Which PALA texture the brush paints with, currently.
    let brushPalaIdx = 3;

    const publicInterface = {};
    {
        // Set to true to have the brush smoothen the terrain heightmap.
        publicInterface.brushSmoothens = false;

        publicInterface.brushAction = Object.freeze({void:0, changeHeight:1, changePala:2, smoothenGround:3});

        // Modify the terrain at the given x,y coordinates with the given brush action.
        publicInterface.apply_brush_to_terrain = function(brushAction = 0, value = 0, x = 0, y = 0)
        {
            for (let by = -brushSize; by <= brushSize; by++)
            {
                const tileZ = (y + by);
                if (tileZ < 0 || tileZ >= maasto_n.track_side_length()) continue;

                for (let bx = -brushSize; bx <= brushSize; bx++)
                {
                    const tileX = (x + bx);
                    if (tileX < 0 || tileX >= maasto_n.track_side_length()) continue;

                    switch (brushAction)
                    {
                        case this.brushAction.changeHeight:
                        {
                            if (this.brushSmoothens)
                            {
                                if (tileX < 1 || tileX >=  (maasto_n.track_side_length() - 1)) continue;
                                if (tileZ < 1 || tileZ >= (maasto_n.track_side_length() - 1)) continue;
    
                                let avgHeight = 0;
                                avgHeight += maasto_n.maasto_height_at(tileX+1, tileZ);
                                avgHeight += maasto_n.maasto_height_at(tileX-1, tileZ);
                                avgHeight += maasto_n.maasto_height_at(tileX, tileZ+1);
                                avgHeight += maasto_n.maasto_height_at(tileX, tileZ-1);
                                avgHeight += maasto_n.maasto_height_at(tileX+1, tileZ+1);
                                avgHeight += maasto_n.maasto_height_at(tileX+1, tileZ-1);
                                avgHeight += maasto_n.maasto_height_at(tileX-1, tileZ+1);
                                avgHeight += maasto_n.maasto_height_at(tileX-1, tileZ-1);
                                avgHeight /= 8;
                                    
                                maasto_n.set_maasto_height_at(tileX, tileZ, Math.floor(((avgHeight + maasto_n.maasto_height_at(tileX, tileZ) * 7) / 8)));
                            }
                            else
                            {
                                maasto_n.set_maasto_height_at(tileX, tileZ, (maasto_n.maasto_height_at(tileX, tileZ) + value));
                            }

                            break;
                        }
                        case this.brushAction.changePala:
                        {
                            maasto_n.set_varimaa_tile_at(tileX, tileZ, value);

                            break;
                        }
                        default: k_assert(0, "Unknown brush action.");
                    }
                }
            }
        }

        publicInterface.set_brush_size = function(newSize = 0)
        {
            k_assert((newSize >= 0), "Attempted to set an invalid brush size.");
            brushSize = newSize;
        }

        publicInterface.brush_size = function()
        {
            return brushSize;
        }

        publicInterface.set_brush_pala_idx = function(newPalaIdx = 0)
        {
            k_assert((newPalaIdx >= 0), "Attempted to set an invalid brush PALA index.");
            brushPalaIdx = newPalaIdx;
        }
        
        publicInterface.brush_pala_idx = function()
        {
            return brushPalaIdx;
        }
    }
    return publicInterface;
})();
