/*
 * Most recent known filename: js/ui/ground-brush.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

// A brush used to edit the current project's heightmap and tilemap.
Rsed.ui.groundBrush = (function()
{
    // How large of a radius the brush paints with. A value of 0 means one tile.
    let brushSize = 0;

    // Which PALA texture the brush paints with, currently.
    let brushPalaIdx = 3;

    // When shared editing is enabled, we'll accumulate all brush strokes into caches,
    // which we'll then upload to the server the next time we poll it; after which
    // the caches are emptied and filled up again as we make new edits.
    const brushCache = Object.freeze(
    {
        maasto:[],
        varimaa:[]
    });

    const publicInterface = {};
    {
        // Set to true to have the brush smoothen the terrain heightmap.
        publicInterface.brushSmoothens = false;

        publicInterface.brushAction = Object.freeze({void:0, changeHeight:1, changePala:2, smoothenGround:3});

        // Modify the terrain at the given x,y coordinates with the given brush action.
        publicInterface.apply_brush_to_terrain = function(brushAction = 0, value = 0, x = 0, y = 0)
        {
            const targetProject = Rsed.core.current_project();

            for (let by = -brushSize; by <= brushSize; by++)
            {
                const tileZ = (y + by);
                
                if ((tileZ < 0) || (tileZ >= targetProject.maasto.width)) continue;

                for (let bx = -brushSize; bx <= brushSize; bx++)
                {
                    const tileX = (x + bx);

                    if ((tileX < 0) || (tileX >= targetProject.maasto.width)) continue;

                    switch (brushAction)
                    {
                        case this.brushAction.changeHeight:
                        {
                            if (this.brushSmoothens)
                            {
                                if ((tileX < 1) || (tileX >= (targetProject.maasto.width - 1))) continue;
                                if ((tileZ < 1) || (tileZ >= (targetProject.maasto.width - 1))) continue;
    
                                let avgHeight = 0;
                                avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ);
                                avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ);
                                avgHeight += targetProject.maasto.tile_at(tileX,   tileZ+1);
                                avgHeight += targetProject.maasto.tile_at(tileX,   tileZ-1);
                                avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ+1);
                                avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ-1);
                                avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ+1);
                                avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ-1);
                                avgHeight /= 8;
                                    
                                targetProject.maasto.set_tile_value_at(tileX, tileZ,
                                                                       Math.floor(((avgHeight + targetProject.maasto.tile_at(tileX, tileZ) * 7) / 8)));
                            }
                            else
                            {
                                targetProject.maasto.set_tile_value_at(tileX, tileZ,
                                                                       (targetProject.maasto.tile_at(tileX, tileZ) + value));
                            }

                            if (Rsed.shared_mode_n.enabled())
                            {
                                brushCache.maasto[tileX + tileZ * targetProject.maasto.width] = targetProject.maasto.tile_at(tileX, tileZ);
                            }

                            break;
                        }
                        case this.brushAction.changePala:
                        {
                            targetProject.varimaa.set_tile_value_at(tileX, tileZ, value);

                            if (Rsed.shared_mode_n.enabled())
                            {
                                brushCache.varimaa[tileX + tileZ * targetProject.maasto.width] = targetProject.varimaa.tile_at(tileX, tileZ);
                            }

                            break;
                        }
                        default: Rsed.throw("Unknown brush action.");
                    }
                }
            }
        }

        publicInterface.set_brush_size = function(newSize = 0)
        {
            Rsed.assert && (newSize >= 0)
                        || Rsed.throw("Attempted to set an invalid brush size.");

            brushSize = newSize;
        }

        publicInterface.brush_size = function()
        {
            return brushSize;
        }

        publicInterface.set_brush_pala_idx = function(newPalaIdx = 0)
        {
            Rsed.assert && (newPalaIdx >= 0)
                        || Rsed.throw("Attempted to set an invalid brush PALA index.");

            brushPalaIdx = newPalaIdx;
        }
        
        publicInterface.brush_pala_idx = function()
        {
            return brushPalaIdx;
        }

        // Empties out the given brush cache; returning a copy of the contents of the
        // cache prior to its emptying.
        publicInterface.flush_brush_cache = function(which = "")
        {
            return ((cache)=>
            {
                brushCache[which].length = 0;
                return cache;
            })(brushCache[which].slice());
        }
    }
    return publicInterface;
})();
