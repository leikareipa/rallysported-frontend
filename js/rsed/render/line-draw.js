/*
 * Most recent known filename: js/render/line_draw.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 */

"use strict";

Rsed.draw_line_n = (function()
{
    const publicInterface = {};
    {
        // 'Draw' a Bresenham line between the two points into a 1d array. In other words, each element
        // in the array represents the y coordinate, and each value at that element the x coordinate.
        publicInterface.line_into_array = function(vert1 = Rsed.geometry_n.vertex_o,
                                                   vert2 = Rsed.geometry_n.vertex_o,
                                                   array = [], yOffset = 0)
        {
            Rsed.assert((vert1 instanceof Rsed.geometry_n.vertex_o), "Expected a vertex.");
            Rsed.assert((vert2 instanceof Rsed.geometry_n.vertex_o), "Expected a vertex.");

            yOffset = Math.floor(yOffset);

            let x0 = Math.floor(vert1.x);
            let y0 = Math.floor(vert1.y);
            const x1 = Math.floor(vert2.x);
            const y1 = Math.floor(vert2.y);

            // If true, we won't touch non-null elements in the array. Useful in preventing certain
            // edge rendering errors.
            const noOverwrite = (y1 <= y0);

            // Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
            {
                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                const sx = (x0 < x1)? 1 : -1;
                const sy = (y0 < y1)? 1 : -1; 
                let err = (((dx > dy)? dx : -dy) / 2);
                
                while (true)
                {
                    // Mark the pixel.
                    if (noOverwrite)
                    {
                        if (array[y0 - yOffset] == null) array[y0 - yOffset] = x0;
                    }
                    else
                    {
                        array[y0 - yOffset] = x0;
                    }

                    if ((x0 === x1) &&
                        (y0 === y1))
                    {
                        break;
                    }

                    const e2 = err;
                    if (e2 > -dx)
                    {
                        err -= dy;
                        x0 += sx;
                    }
                    if (e2 < dy)
                    {
                        err += dx;
                        y0 += sy;
                    }
                }
            }
        }

        publicInterface.line_onto_canvas = function(vert1 = Rsed.geometry_n.vertex_o, vert2 = Rsed.geometry_n.vertex_o,
                                                    canvas = [], width = 0, height = 0,
                                                    r = 0, g = 0, b = 0)
        {
            Rsed.assert((canvas.length > 0), "Expected the canvas to be a non-zero-length array.");
            Rsed.assert((vert1 instanceof Rsed.geometry_n.vertex_o), "Expected a vertex.");
            Rsed.assert((vert2 instanceof Rsed.geometry_n.vertex_o), "Expected a vertex.");

            function put_pixel(x = 0, y = 0)
            {
                if (x < 0 || x >= width) return;
                if (y < 0 || y >= height) return;

                const idx = ((x + y * width) * 4);
                canvas[idx + 0] = r;
                canvas[idx + 1] = g;
                canvas[idx + 2] = b;
                canvas[idx + 3] = 255;
            }

            let x0 = Math.floor(vert1.x);
            let y0 = Math.floor(vert1.y);
            const x1 = Math.floor(vert2.x);
            const y1 = Math.floor(vert2.y);

            // Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
            {
                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                const sx = (x0 < x1)? 1 : -1;
                const sy = (y0 < y1)? 1 : -1; 
                let err = (((dx > dy)? dx : -dy) / 2);
                
                while (true)
                {
                    put_pixel(x0, y0);

                    if ((x0 === x1) &&
                        (y0 === y1))
                    {
                        break;
                    }

                    const e2 = err;
                    if (e2 > -dx)
                    {
                        err -= dy;
                        x0 += sx;
                    }
                    if (e2 < dy)
                    {
                        err += dx;
                        y0 += sy;
                    }
                }
            }
        }
    }
    return publicInterface;
})();
