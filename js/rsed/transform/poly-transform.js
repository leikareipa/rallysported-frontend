/*
 * Most recent known filename: js/poly_transform.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Routines for transforming polygons to screen-space.
 *
 */

"use strict";

Rsed.polygon_transform_n = (function()
{
    const publicInterface = {};
    {
        // Transforms the given polygons, with their associated object space matrix, into screen-space,
        // also accounting for the given camera orientation.
        publicInterface.transform_polygons = function(polygons = [],
                                                      objectSpaceMatrix = [], cameraMatrix = [],
                                                      screenWidth = 0, screenHeight = 0)
        {
            Rsed.assert((polygons.length > 0), "Expected a non-empty list of polygons.");
            Rsed.assert((objectSpaceMatrix.length === 16), "Expected a 4 x 4 matrix.");
            Rsed.assert((cameraMatrix.length === 16), "Expected a 4 x 4 matrix.");
            Rsed.assert(((screenWidth > 0) && (screenHeight > 0)), "The screen can't have 0 width or height.");
            
            // Create matrices with which we can transform the polygons, ultimately into
            // screen-space but also into clip-space in the interim.
            let toClipSpace = [];
            let toScreenSpace = [];
            {
                const viewSpace = Rsed.matrix44_n.multiply_matrices(cameraMatrix, objectSpaceMatrix);
                
                // Clip-space, for clipping triangles against the viewport; although for now,
                // the interim step into clip-space is ignored, as no triangle clipping is to
                // be done.
                toClipSpace = Rsed.matrix44_n.multiply_matrices(Rsed.matrix44_n.perspective_matrix(0.75/*camera fov in radians*/, (screenWidth / screenHeight), 1, 1000),
                                                        viewSpace);

                toScreenSpace = Rsed.matrix44_n.multiply_matrices(Rsed.matrix44_n.screen_space_matrix(screenWidth, screenHeight),
                                                            toClipSpace);
            }
            
            // Transform the polygons.
            let transfPolys = [];
            {
                let k = 0;
                for (let i = 0; i < polygons.length; i++)
                {
                    Rsed.assert((polygons[i] instanceof Rsed.geometry_n.polygon_o), "Expected a polygon.");
                    
                    transfPolys[k] = new Rsed.geometry_n.polygon_o(polygons[i].v.length);
                    transfPolys[k].clone_from(polygons[i]);

                    transfPolys[k].transform(toScreenSpace);

                    // Clip against the near plane. Instead of modulating the vertex positions,
                    // we'll just cull the entire polygon if any of its vertices are behind the plane.
                    if (transfPolys[k].v.some(v=>(v.w <= 0)))
                    {
                        transfPolys.pop();
                        continue;
                    }

                    transfPolys[k].perspective_divide();

                    k++;
                }
            }
            
            return transfPolys;
        }
    }
    return publicInterface;
})();
