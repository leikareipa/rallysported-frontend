/*
 * Most recent known filename: js/ui/draw.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

// Handles rendering the RallySportED-js UI.
Rsed.ui.draw = (function()
{
    // The pixel buffer that UI render commands will draw into.
    let pixelSurface = null;

    // The mouse-picking pixel buffer that UI render commands will write into.
    let mousePickBuffer = null;

    const publicInterface =
    {
        // Readies the pixel buffer for UI drawing. This should be called before any draw
        // calls are made for the current frame.
        begin_drawing: function(canvas)
        {
            Rsed.assert && (!pixelSurface &&
                            !mousePickBuffer)
                        || Rsed.throw("Cannot begin drawing while the pixel buffer is already in use.");

            pixelSurface = canvas.domElement.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
            mousePickBuffer = canvas.mousePickingBuffer;

            return;
        },

        // Uploads the current pixel buffer onto the target canvas. This should be called
        // once all draw calls for the current frame have been made.
        finish_drawing: function(canvas)
        {
            Rsed.assert && (pixelSurface &&
                            mousePickBuffer)
                        || Rsed.throw("Cannot finish drawing when drawing hasn't begun.");

            canvas.domElement.getContext("2d").putImageData(pixelSurface, 0, 0);

            pixelSurface = null;
            mousePickBuffer = null;

            return;
        },

        pixel: function(x = 0, y = 0, r = 255, g = 255, b = 255, mousePick = undefined)
        {
            const idx = ((x + y * Rsed.visual.canvas.width) * 4);

            pixelSurface.data[idx + 0] = r;
            pixelSurface.data[idx + 1] = g;
            pixelSurface.data[idx + 2] = b;
            pixelSurface.data[idx + 3] = 255;

            if (mousePick != undefined)
            {
                put_mouse_pick_value(x, y, mousePick);
            }

            return;
        },
        
        // Draws the given set of paletted pixels (each being a value in the range 0..31 in Rally-Sport's
        // palette) of the given dimensions, starting at the x,y screen coordinates and working right/down.
        // If alpha is true, will not draw pixels that have a palette index of 0.
        image: function(pixels = [], mousePick = [], width = 0, height = 0, x = 0, y = 0, alpha = false, flipped = false)
        {
            // Convert from percentages into absolute screen coordinates.
            if (x < 0) x = Math.floor(-x * pixelSurface.width);
            if (y < 0) y = Math.floor(-y * pixelSurface.height);

            x = Math.floor(x);
            y = Math.floor(y);

            Rsed.assert && ((mousePick instanceof Array) ||
                            (mousePick === null))
                        || Rsed.throw("Expected a valid mouse-picking buffer.");

            Rsed.assert && (pixelSurface != null)
                        || Rsed.throw("Expected a valid pixel surface.");

            Rsed.assert && ((pixels[0] != null) &&
                            (pixels.length > 0))
                        || Rsed.throw("Expected a valid array of pixels.");

            Rsed.assert && ((width  > 0) &&
                            (height > 0))
                        || Rsed.throw("Expected a valid image resolution.");

            for (let cy = 0; cy < height; cy++)
            {
                if ((y + cy) < 0) continue;
                if ((y + cy) >= pixelSurface.height) break;

                for (let cx = 0; cx < width; cx++)
                {
                    if ((x + cx) < 0) continue;
                    if ((x + cx) >= pixelSurface.width) break;

                    const pixel = pixels[cx + (flipped? (height - cy - 1) : cy) * width];

                    if (alpha && (pixel === 0)) continue;

                    const color = ((typeof pixel === "object")? pixel : Rsed.visual.palette.color_at_idx(pixel));
                    
                    Rsed.ui.draw.pixel((x + cx), (y + cy), color.red, color.green, color.blue);

                    if (mousePick != null)
                    {
                        put_mouse_pick_value((x + cx), (y + cy), mousePick[cx + cy * width]);
                    }
                }
            }

            return;
        },

        // Draws the given string onto the screen at the given coordinates.
        // NOTE: If a coordinate's value is less than 0, its absolute value is interpreted as a percentage
        // of the screen's resolution in the range 0..1.
        string: function(string = "", x = 0, y = 0, mousePick = undefined)
        {
            string = String(string).toUpperCase();

            Rsed.assert && (pixelSurface != null)
                        || Rsed.throw("Expected a valid pixel surface.");

            Rsed.assert && (string.length != null)
                        || Rsed.throw("Expected a non-empty string");

            x = Math.floor(x);
            y = Math.floor(y);

            // Convert from percentages into absolute screen coordinates.
            if (x < 0) x = Math.floor(-x * Rsed.visual.canvas.width);
            if (y < 0) y = Math.floor(-y * Rsed.visual.canvas.height);

            // Prevent the string from going past the viewport's edges.
            x = Math.min(x, (Rsed.visual.canvas.width - 1 - Rsed.ui.font.width_in_pixels(string)));
            y = Math.min(y, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 2));

            // Draw a left vertical border for the string block. The font's
            // bitmap characters include bottom, right, and top borders, but
            // not left; so we need to create the left one manually.
            if ((x >= 0) && (x < Rsed.visual.canvas.width))
            {
                for (let i = 0; i < (Rsed.ui.font.nativeHeight + 2); i++)
                {
                    Rsed.ui.draw.pixel(x, y + i, 255, 255, 0, mousePick);
                }
                
                x++;
            }

            // Draw the string, one character at a time.
            for (let i = 0; i < string.length; i++)
            {
                const character = Rsed.ui.font.character(string[i]);

                for (let cy = 0; cy < (Rsed.ui.font.nativeHeight + 2); cy++)
                {
                    if ((y + cy) < 0) continue;
                    if ((y + cy) >= pixelSurface.height) break;

                    for (let cx = 0; cx <= character.width; cx++)
                    {
                        if ((x + cx) < 0) continue;
                        if ((x + cx) >= pixelSurface.width) break;

                        const color = character.pixel_at(cx, cy-1)
                                      ? Rsed.visual.palette.color_at_idx(character.pixel_at(cx, cy-1))
                                      : Rsed.visual.palette.color_at_idx("background");

                        Rsed.ui.draw.pixel((x + cx), (y + cy), color.red, color.green, color.blue, mousePick);
                    }
                }

                x += (character.width + 1);
            }

            return;
        },
    };

    function put_mouse_pick_value(x = 0, y = 0, value)
    {
        mousePickBuffer[(x + y * pixelSurface.width)] = value;

        return;
    }

    return publicInterface;
})();
