/*
 * Most recent known filename: js/rallysported/render/ngon-fill.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 * An n-gon rasterizer for the HTML5 canvas.
 * Note that the drawing functions expect 'this' to point to the render surface object into whose
 * render context/pixel buffers we'll rasterize.
 * 
 */

"use strict";

Rsed.ngon_fill_n = (function()
{
    const publicInterface = {};
    {
        publicInterface.fill_polygons = function(polygons = [])
        {
            Rsed.assert && (this instanceof Rsed.render_surface_n.render_surface_o)
                        || Rsed.throw("Expected the function to be bound to a render surface.");

            Rsed.assert && (polygons[0] instanceof Rsed.geometry_n.polygon_o)
                        || Rsed.throw("Expected polygons.");

            Rsed.assert && (polygons.length > 0)
                        || Rsed.throw("Received an empty list of triangles to rasterize.");

            const surface = this;
            const width = surface.width;
            const height = surface.height;

            // We'll rasterize the polygons into the canvas's pixel array.
            const pixelMap = surface.exposed().getImageData(0, 0, width, height);

            for (let i = 0; i < polygons.length; i++)
            {
                Rsed.assert && (polygons[i] instanceof Rsed.geometry_n.polygon_o)
                            || Rsed.throw("Expected a polygon");

                const poly = new Rsed.geometry_n.polygon_o(polygons[i].verts.length);
                poly.clone_from(polygons[i]);

                // Find which of the polygon's vertices form the polygon's left side and which the right.
                // With that information, we can then fill in the horizontal pixel spans between them.
                // The vertices will be arranged such that the first entry in the 'left' list will be the
                // polygon's top-most (lowest y) vertex, and entries after that successively higher in y.
                // For the 'right' list, the first entry will be the polygon's bottom-most vertex, and
                // entries following successively lower in y. In other words, by tracing the vertices
                // first through 'left' and then 'right', you end up with an anti-clockwise loop around
                // the polygon.
                const leftVerts = [];
                const rightVerts = [];
                {
                    // Sort the vertices by increasing y, i.e. by height.
                    poly.verts.sort(function(a, b){ return (a.y === b.y)? 0 : ((a.y < b.y)? -1 : 1); });
                    const topVert = poly.verts[0];
                    const bottomVert = poly.verts[poly.verts.length-1];

                    // The left side will always start with the top-most vertex, and the right side with
                    // the bottom-most vertex.
                    leftVerts.push(topVert);
                    rightVerts.push(bottomVert);

                    // Trace a line along x,y between the top-most vertex and the bottom-most vertex; and for
                    // the two intervening vertices, find whether they're to the left or right of that line on
                    // x. Being on the left side of that line means the vertex is on the polygon's left side,
                    // and same for the right side.
                    for (let p = 1; p < (poly.verts.length-1); p++)
                    {
                        const lr = Rsed.lerp(topVert.x, bottomVert.x, ((poly.verts[p].y - topVert.y) / (bottomVert.y - topVert.y)));
                        
                        if (poly.verts[p].x >= lr)
                        {
                            rightVerts.push(poly.verts[p]);
                        }
                        else leftVerts.push(poly.verts[p]);
                    }

                    // Sort the two sides' vertices so that we can trace them anti-clockwise starting from the top,
                    // going down to the bottom vertex on the left side, and then back up to the top vertex along
                    // the right side.
                    leftVerts.sort(function(a, b){ return (a.y === b.y)? 0 : ((a.y < b.y)? -1 : 1); });
                    rightVerts.sort(function(a, b){ return (a.y === b.y)? 0 : ((a.y > b.y)? -1 : 1); });

                    Rsed.assert && ((leftVerts.length !== 0) && (rightVerts.length !== 0))
                                || Rsed.throw("Expected each side list to have at least one vertex.");

                    Rsed.assert && ((leftVerts.length + rightVerts.length) === poly.verts.length)
                                || Rsed.throw("Vertices appear to have gone missing.");
                }

                // Create arrays where the index represents the y coordinate and the values x
                // coordinates at that y.
                let leftEdge = [];
                let rightEdge = [];
                {
                    let prevVert = leftVerts[0];
                    for (let l = 1; l < leftVerts.length; l++)
                    {
                        Rsed.draw_line_n.line_into_array(prevVert, leftVerts[l], leftEdge, poly.verts[0].y);
                        prevVert = leftVerts[l];
                    }
                    Rsed.draw_line_n.line_into_array(prevVert, rightVerts[0], leftEdge, poly.verts[0].y);
                    prevVert = rightVerts[0];
                    for (let r = 1; r < rightVerts.length; r++)
                    {
                        Rsed.draw_line_n.line_into_array(prevVert, rightVerts[r], rightEdge, poly.verts[0].y);
                        prevVert = rightVerts[r];
                    }
                    Rsed.draw_line_n.line_into_array(prevVert, leftVerts[0], rightEdge, poly.verts[0].y);
                }

                // Draw the polygon.
                {
                    // Solid or textured fill.
                    if (!poly.isEthereal)
                    {
                        const polyYOffset = Math.floor(poly.verts[0].y);
                        const polyHeight = leftEdge.length;
                        const texture = poly.texture;

                        let v = 0;
                        const vDelta = ((texture == null)? 0 : ((texture.height - 0.001) / (polyHeight-1)));

                        for (let y = 0; y < polyHeight; y++)
                        {
                            const rowWidth = (rightEdge[y] - leftEdge[y]);
                            if (rowWidth <= 0) continue;

                            let u = 0;
                            const uDelta = ((texture == null)? 0 : ((texture.width - 0.001) / rowWidth));

                            while (leftEdge[y] <= rightEdge[y])
                            {
                                if (leftEdge[y] >= 0 && leftEdge[y] < width)
                                {
                                    const px = leftEdge[y];
                                    const py = (y + polyYOffset);

                                    if (py >= 0 && py < height)
                                    {
                                        const idx = ((px + py * width) * 4);
                                        
                                        // Solid fill.
                                        if ((texture == null) || (!texture.pixels))
                                        {
                                            pixelMap.data[idx + 0] = poly.color.r;
                                            pixelMap.data[idx + 1] = poly.color.g;
                                            pixelMap.data[idx + 2] = poly.color.b;
                                            pixelMap.data[idx + 3] = 255;
                                        }
                                        // Textured fill.
                                        else
                                        {
                                            const texelIdx = (Math.floor(u) + Math.floor(v) * texture.width);
                                            const color = texture.pixels[texelIdx];

                                            if (!texture.alpha || texture.indices[texelIdx] != 0)
                                            {
                                                pixelMap.data[idx + 0] = color.r;
                                                pixelMap.data[idx + 1] = color.g;
                                                pixelMap.data[idx + 2] = color.b;
                                                pixelMap.data[idx + 3] = 255;
                                            }
                                        }

                                        if (poly.mousePickId !== null)
                                        {
                                            surface.mousePickBuffer[px + py * width] = poly.mousePickId;
                                        }
                                    }
                                }

                                leftEdge[y]++;
                                u += uDelta;
                            }

                            v += vDelta;
                        }
                    }

                    // Draw a wireframe around any polygons that wish for one.
                    /// CLEANUP: The code for this is a bit unsightly.
                    if (poly.hasWireframe)
                    {
                        const wireColor = new Array(3).fill((poly.isEthereal)? 100 : 0);

                        let prevVert = leftVerts[0];
                        for (let l = 1; l < leftVerts.length; l++)
                        {
                            Rsed.draw_line_n.line_onto_canvas(prevVert, leftVerts[l], pixelMap.data, width, height, ...wireColor);
                            prevVert = leftVerts[l];
                        }

                        Rsed.draw_line_n.line_onto_canvas(prevVert, rightVerts[0], pixelMap.data, width, height, ...wireColor);

                        prevVert = rightVerts[0];
                        for (let r = 1; r < rightVerts.length; r++)
                        {
                            Rsed.draw_line_n.line_onto_canvas(prevVert, rightVerts[r], pixelMap.data, width, height, ...wireColor);
                            prevVert = rightVerts[r];
                        }

                        Rsed.draw_line_n.line_onto_canvas(prevVert, leftVerts[0], pixelMap.data, width, height, ...wireColor);
                    }
                }
            }

            surface.exposed().putImageData(pixelMap, 0, 0);
        }
    }
    return publicInterface;
})();
