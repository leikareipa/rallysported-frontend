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

    // This will hold a pre-baked PALAT pane image, i.e. thumbnails for all the PALA textures,
    // as RGBA color values. Its size (rows * columns) will be set dynamically depending on the
    // window resolution.
    const palatPaneBuffer = [];
    const palatPaneMousePick = [];
    let numPalatPaneCols = 9;
    let numPalatPaneRows = 29;
    let palatPaneWidth = 0;
    let palatPaneHeight = 0;

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
                    
                    put_pixel((x + cx), (y + cy), color.red, color.green, color.blue);

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
        string: function(string = "", x = 0, y = 0)
        {
            string = (" " + String(string).toUpperCase());

            Rsed.assert && (pixelSurface != null)
                        || Rsed.throw("Expected a valid pixel surface.");

            Rsed.assert && (string.length != null)
                        || Rsed.throw("Expected a non-empty string");

            // Convert from percentages into absolute screen coordinates.
            if (x < 0) x = Math.floor(-x * pixelSurface.width);
            if (y < 0) y = Math.floor(-y * pixelSurface.height);

            // Draw the string, one character at a time.
            for (let i = 0; i < string.length; i++)
            {
                const character = Rsed.ui.font.character(string[i]);
                const width = Rsed.ui.font.font_width();
                const height = Rsed.ui.font.font_height();
                
                this.image(character, null, width, height, x, y, false);
                
                x += ((Rsed.ui.font.font_width() / 2) + 0.3);
            }

            return;
        },

        // Draws the mouse cursor, and any indicators attached to it.
        mouse_cursor: function()
        {
            if ( Rsed.ui.inputState.current_mouse_hover() &&
                (Rsed.ui.inputState.current_mouse_hover().type === "ui-element") &&
                (Rsed.ui.inputState.current_mouse_hover().uiElementId === "palat-pane"))
            {
                this.string(("PALA:" + Rsed.ui.inputState.current_mouse_hover().palaIdx),
                            (Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution().x + 10),
                            (Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution().y + 17));
            }
            else if (Rsed.ui.groundBrush.brushSmoothens)
            {
                this.string("SMOOTHING",
                            (Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution().x + 10),
                            (Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution().y + 17));
            }

            return;
        },

        watermark: function()
        {
            //this.string("RALLY-", -.012, 3);
            //this.string("SPORT-", -.012, 3 + Rsed.ui.font.font_height()-1);
            //this.string("ED%", -.012, 3 + ((Rsed.ui.font.font_height()-1) * 2));

            return;
        },

        footer_info: function()
        {
            const mouseHover = Rsed.ui.inputState.current_mouse_hover();
            const mouseGrab = Rsed.ui.inputState.current_mouse_grab();

            let str;

            if ((mouseHover && (mouseHover.type === "prop")) ||
                (mouseGrab && (mouseGrab.type === "prop")))
            {
                // Prefer mouseGrab over mouseHover, as the prop follows the cursor lazily while
                // dragging, so hover might be over the background.
                const mouse = (mouseGrab || mouseHover);

                str = "PROP:" + Rsed.core.current_project().props.name(mouse.propId) +
                      " IDX:" + mouse.propId + "(" + mouse.propTrackIdx + ")";
            }
            else if (mouseHover && (mouseHover.type === "ground"))
            {
                const x = mouseHover.groundTileX;
                const y = mouseHover.groundTileY;

                const xStr = String(x).padStart(3, "0");
                const yStr = String(y).padStart(3, "0");

                const heightStr = (Rsed.core.current_project().maasto.tile_at(x, y) < 0? "-" : "+") +
                                   String(Math.abs(Rsed.core.current_project().maasto.tile_at(x, y))).padStart(3, "0");

                const palaStr = String(Rsed.core.current_project().varimaa.tile_at(x, y)).padStart(3, "0");

                str = "HEIGHT:" + heightStr + " PALA:" + palaStr +" X,Y:"+xStr+","+yStr;
            }
            else
            {
                str = "HEIGHT:+000 PALA:000 X,Y:000,000";
            }

            this.string(str, 0, Rsed.visual.canvas.height - Rsed.ui.font.font_height());

            return;
        },

        fps: function()
        {
            const fpsString = ("FPS: " + Rsed.core.renderer_fps());
            this.string(fpsString, pixelSurface.width - (fpsString.length * Rsed.ui.font.font_width()/2) - 40, 37);

            return;
        },

        palat_pane: function()
        {
            if (palatPaneBuffer.length > 0)
            {
                this.image(palatPaneBuffer, palatPaneMousePick, palatPaneWidth, palatPaneHeight, 0, 0);
            }

            return;
        },

        minimap: function()
        {
            // Generate the minimap image by iterating over the tilemap and grabbing a pixel off each
            // corresponding PALA texture.
            /// TODO: You can pre-generate the image rather than re-generating it each frame.
            const width = 64;
            const height = 32;
            const xMul = (Rsed.core.current_project().maasto.width / width);
            const yMul = (Rsed.core.current_project().maasto.width / height);
            const image = [];   // An array of palette indices that forms the minimap image.
            const mousePick = [];
            for (let y = 0; y < height; y++)
            {
                for (let x = 0; x < width; x++)
                {
                    const tileX = (x * xMul);
                    const tileZ = (y * yMul);

                    const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
                    let color = ((pala == null)? 0 : pala.indices[1]);

                    image.push(color);

                    mousePick.push(Rsed.ui.mouse_picking_element("ui-element",
                    {
                        uiElementId: "minimap",
                        x: tileX,
                        y: tileZ
                    }));
                }
            }

            this.image(image, null, width, height, pixelSurface.width - width - 4, 4, false);

            // Draw a frame around the camera view on the minimap.
            if (image && xMul && yMul)
            {
                const frame = [];
                const frameWidth = Math.round((Rsed.world.camera.view_width / xMul));
                const frameHeight = Math.floor((Rsed.world.camera.view_height / yMul));
                
                for (let y = 0; y < frameHeight; y++)
                {
                    for (let x = 0; x < frameWidth; x++)
                    {
                        let color = 0;
                        if (y % (frameHeight - 1) === 0) color = "yellow";
                        if (x % (frameWidth - 1) === 0) color = "yellow";

                        frame.push(color);
                    }
                }

                const cameraPos = Rsed.world.camera.position_floored();
                const camX = (cameraPos.x / xMul);
                const camZ = (cameraPos.z / yMul);
                this.image(frame, null, frameWidth, frameHeight, pixelSurface.width - width - 4 + camX, 3 + camZ, true);
            }

            return;
        },

        active_pala: function()
        {
            const currentPala = Rsed.ui.groundBrush.brush_pala_idx();
            const pala = Rsed.core.current_project().palat.texture[currentPala];

            if (pala != null)
            {
                this.image(pala.indices, null, 16, 16, pixelSurface.width - 15 - 5, 34 + 5, false, true);
                this.string((Rsed.ui.groundBrush.brush_size() + 1) + "*", pixelSurface.width - 22 - 4 + 6, 39 + 16)
            }

            return;
        },

        // Create a set of thumbnails of the contents of the current PALAT file. We'll display this pane of
        // thumbnails to the user for selecting PALAs.
        generate_palat_pane: function()
        {
            const maxNumPalas = 253;

            const palaWidth = Rsed.constants.palaWidth;
            const palaHeight = Rsed.constants.palaHeight;

            palatPaneBuffer.length = 0;
            palatPaneMousePick.length = 0;

            // Recompute the pane's dimensions based on the current display size.
            /// FIXME: Leaves unnecessary empty rows for some resolutions.
            numPalatPaneRows = (Math.floor(Rsed.visual.canvas.height / 8) - 1);
            numPalatPaneCols = Math.ceil(253 / numPalatPaneRows);
            palatPaneWidth = ((numPalatPaneCols * (palaWidth / 2)) + 1);
            palatPaneHeight = ((numPalatPaneRows * (palaHeight / 2)) + 1);
        
            let palaIdx = 0;
            for (let y = 0; y < numPalatPaneRows; y++)
            {
                for (let x = 0; x < numPalatPaneCols; (x++, palaIdx++))
                {
                    if (palaIdx > maxNumPalas) break;

                    const pala = Rsed.core.current_project().palat.texture[palaIdx];
                    for (let py = 0; py < palaHeight; py++)
                    {
                        for (let px = 0; px < palaWidth; px++)
                        {
                            const palaTexel = Math.floor(px + (palaHeight - py - 1) * palaWidth);
                            const bufferTexel = Math.floor((Math.floor(x * palaWidth + px) / 2) +
                                                            Math.floor((y * palaHeight + py) / 2) * palatPaneWidth);

                            palatPaneBuffer[bufferTexel] = Rsed.visual.palette.color_at_idx(pala.indices[palaTexel]);
                            palatPaneMousePick[bufferTexel] = Rsed.ui.mouse_picking_element("ui-element",
                            {
                                uiElementId: "palat-pane",
                                palaIdx: palaIdx,
                            });
                        }
                    }
                }
            }

            // Draw a grid over the PALA thumbnails.
            for (let i = 0; i < numPalatPaneRows * palaHeight/2; i++)
            {
                for (let x = 0; x < numPalatPaneCols; x++)
                {
                    palatPaneBuffer[(x * palaWidth/2) + i * palatPaneWidth] = "black";
                }
            }
            for (let i = 0; i < numPalatPaneCols * palaWidth/2; i++)
            {
                for (let y = 0; y < numPalatPaneRows; y++)
                {
                    palatPaneBuffer[i + (y * palaHeight/2) * palatPaneWidth] = "black";
                }
            }

            return;
        }
    };

    function put_pixel(x = 0, y = 0, r = 255, g = 255, b = 255)
    {
        const idx = ((x + y * pixelSurface.width) * 4);
        pixelSurface.data[idx + 0] = r;
        pixelSurface.data[idx + 1] = g;
        pixelSurface.data[idx + 2] = b;
        pixelSurface.data[idx + 3] = 255;

        return;
    }

    function put_mouse_pick_value(x = 0, y = 0, value = 0)
    {
        mousePickBuffer[(x + y * pixelSurface.width)] = value;

        return;
    }

    return publicInterface;
})();
