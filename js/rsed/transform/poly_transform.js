/*
 * Most recent known filename: js/poly_transform.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Routines for transforming polygons to screen-space.
 *
 */

"use strict"

const polygon_transform_n = (function()
{
    const publicInterface = {};
    {
        // Transforms the given polygons, with their associated object space matrix, into screen-space,
        // also accounting for the given camera orientation.
        publicInterface.transform_polygons = function(polygons = [],
                                                      objectSpaceMatrix = [], cameraMatrix = [],
                                                      screenWidth = 0, screenHeight = 0)
        {
            k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");
            k_assert((objectSpaceMatrix.length === 16), "Expected a 4 x 4 matrix.");
            k_assert((cameraMatrix.length === 16), "Expected a 4 x 4 matrix.");
            k_assert(((screenWidth > 0) && (screenHeight > 0)), "The screen can't have 0 width or height.");
            
            // Create matrices with which we can transform the polygons, ultimately into
            // screen-space but also into clip-space in the interim.
            let toClipSpace = [];
            let toScreenSpace = [];
            {
                const viewSpace = matrix44_n.multiply_matrices(cameraMatrix, objectSpaceMatrix);
                
                // Clip-space, for clipping triangles against the viewport; although for now,
                // the interim step into clip-space is ignored, as no triangle clipping is to
                // be done.
                toClipSpace = matrix44_n.multiply_matrices(matrix44_n.perspective_matrix(0.75/*camera fov in radians*/, (screenWidth / screenHeight), 1, 1000),
                                                        viewSpace);

                toScreenSpace = matrix44_n.multiply_matrices(matrix44_n.screen_space_matrix(screenWidth, screenHeight),
                                                            toClipSpace);
            }
            
            // Transform the polygons.
            let transfPolys = [];
            {
                let k = 0;
                for (let i = 0; i < polygons.length; i++)
                {
                    k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");
                    
                    transfPolys[k] = new geometry_n.polygon_o(polygons[i].v.length);
                    transfPolys[k].clone_from(polygons[i]);
                    
                    transfPolys[k].transform(toScreenSpace);
                    transfPolys[k].perspective_divide();

                    let notVisible = false;
                    for (let v = 0; v < transfPolys[k].v.length; v++)
                    {
                        if (transfPolys[k].v[v].w <= 0)
                        {
                            transfPolys.pop();
                            notVisible = true;
                            break;
                        }
                    }
                    if (notVisible) continue;
                    
                    k++;
                }
            }
            
            return transfPolys;
        }
    }
    return publicInterface;
})();
