/*
 * Most recent known filename: js/ui/draw.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 * Renders the RallySportED UI.
 * 
 */

"use strict";

Rsed.ui_draw_n = (function()
{
    // The pixel buffer that UI render commands will draw into.
    let pixelSurface = null;

    // The mouse-picking pixel buffer tha UI render commands will write into.
    let mousePickBuffer = null;

    // This will hold a pre-baked PALAT pane image, i.e. thumbnails for all the PALA textures,
    // as RGBA color values. Its size (rows * columns) will be set dynamically depending on the
    // window resolution.
    const palatPaneBuffer = [];
    const palatPaneMousePick = [];
    let numPalatPaneCols = 9;
    let numPalatPaneRows = 29;
    let palatPaneWidth = ((numPalatPaneCols * (Rsed.palat_n.pala_width() / 2)) + 1);
    let palatPaneHeight = ((numPalatPaneRows * (Rsed.palat_n.pala_height() / 2)) + 1);
    
    function put_pixel(x = 0, y = 0, r = 255, g = 255, b = 255)
    {
        const idx = ((x + y * pixelSurface.width) * 4);
        pixelSurface.data[idx + 0] = r;
        pixelSurface.data[idx + 1] = g;
        pixelSurface.data[idx + 2] = b;
        pixelSurface.data[idx + 3] = 255;
    }

    function put_mouse_pick_value(x = 0, y = 0, value = 0)
    {
        mousePickBuffer[(x + y * pixelSurface.width)] = value;
    }

    // Draws the given set of paletted pixels (each being a value in the range 0..31 in Rally-Sport's
    // palette) of the given dimensions, starting at the x,y screen coordinates and working right/down.
    // If alpha is true, will not draw pixels that have a palette index of 0.
    function draw_image(pixels = [], mousePick = [], width = 0, height = 0, x = 0, y = 0, alpha = false)
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

        Rsed.assert && ((width > 0) &&
                        (height > 0))
                    || Rsed.throw("Expected a valid image resolution.");

        Rsed.assert && ((x >= 0) ||
                        (x < pixelSurface.width) ||
                        (y >= 0) ||
                        (y < pixelSurface.height))
                    || Rsed.throw("Invalid screen coordinates for drawing the image.");

        for (let cy = 0; cy < height; cy++)
        {
            if ((y + cy) < 0) continue;
            if ((y + cy) >= pixelSurface.height) break;

            for (let cx = 0; cx < width; cx++)
            {
                if ((x + cx) < 0) continue;
                if ((x + cx) >= pixelSurface.width) break;

                const pixel = pixels[cx + cy * width];
                if (alpha && (pixel === 0)) continue;

                const color = ((pixel instanceof Rsed.color_n.rgba_o)? pixel : Rsed.palette_n.palette_idx_to_rgba(pixel));
                put_pixel((x + cx), (y + cy), color.r, color.g, color.b);

                if (mousePick != null)
                {
                    put_mouse_pick_value((x + cx), (y + cy), mousePick[cx + cy * width]);
                }
            }
        }
    }

    // Draws the given string onto the screen at the given coordinates.
    // NOTE: If a coordinate's value is less than 0, its absolute value is interpreted as a percentage
    // of the screen's resolution in the range 0..1.
    function draw_string(string = "", x = 0, y = 0)
    {
        string = String(string).toUpperCase();

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
            const character = Rsed.ui_font_n.character(string[i]);
            const width = Rsed.ui_font_n.font_width();
            const height = Rsed.ui_font_n.font_height();
            
            draw_image(character, null, width, height, x, y, false);
            
            x += ((Rsed.ui_font_n.font_width() / 2) + 0.3);
        }
    }

    // Draws the mouse cursor, and any indicators attached to it.
    function draw_mouse_cursor()
    {
        /// Drawing the mouse cursors directly into the canvas is disabled for performance reasons.
        /*const graphic = Rsed.ui_cursor_n.graphic();
        const width = Rsed.ui_cursor_n.cursor_width();
        const height = Rsed.ui_cursor_n.cursor_height();
        draw_image(graphic, null, width, height, Rsed.ui_input_n.mouse_pos_x(), Rsed.ui_input_n.mouse_pos_y(), true);*/

        if (Rsed.ui_input_n.mouse_hover_type() === Rsed.ui_input_n.mousePickingType.ui &&
            Rsed.ui_input_n.mouse_hover_args().elementId === Rsed.ui_input_n.uiElement.palat_pane)
        {
            draw_string("PALA:" + Rsed.ui_input_n.mouse_hover_args().x, Rsed.ui_input_n.mouse_pos_x() + 10, Rsed.ui_input_n.mouse_pos_y() + 17);
        }
        else if (Rsed.ui_brush_n.brushSmoothens)
        {
            draw_string("SMOOTHING", Rsed.ui_input_n.mouse_pos_x() + 10, Rsed.ui_input_n.mouse_pos_y() + 17);
        }
    }

    function draw_watermark()
    {
        draw_string("RALLY", -.012, 3);
        draw_string("SPORT", -.012, 3 + Rsed.ui_font_n.font_height()-1);
        draw_string("ED%", -.012, 3 + ((Rsed.ui_font_n.font_height()-1) * 2));
    }

    function draw_footer_info()
    {
        const x = Rsed.ui_input_n.mouse_tile_hover_x();
        const y = Rsed.ui_input_n.mouse_tile_hover_y();

        let str = "HEIGHT:+000 PALA:000 X,Y:000,000";
        switch (Rsed.ui_input_n.mouse_hover_type())
        {
            case Rsed.ui_input_n.mousePickingType.ground:
            {
                const xStr = String(x).padStart(3, "0");
                const yStr = String(y).padStart(3, "0");
                const heightStr = (Rsed.maasto_n.maasto_height_at(x, y) < 0? "-" : "+") +
                                  String(Math.abs(Rsed.maasto_n.maasto_height_at(x, y))).padStart(3, "0");
                const palaStr = String(Rsed.maasto_n.varimaa_tile_at(x, y)).padStart(3, "0");

                str = "HEIGHT:" + heightStr + " PALA:" + palaStr +" X,Y:"+xStr+","+yStr;

                break;
            }
            case Rsed.ui_input_n.mousePickingType.prop:
            {
                str = "PROP:" + Rsed.props_n.prop_name_for_idx(Rsed.ui_input_n.mouse_hover_args().idx) +
                      " IDX:" + Rsed.ui_input_n.mouse_hover_args().idx + "(" + Rsed.ui_input_n.mouse_hover_args().trackId + ")";
            }
        }

        draw_string(str, 0, Rsed.main_n.render_height() - Rsed.ui_font_n.font_height()-0);
    }

    function draw_fps()
    {
        const fpsString = "FPS: " + Math.round((1000 / (Rsed.main_n.render_latency() || 1)));
        draw_string(fpsString, pixelSurface.width - (fpsString.length * Rsed.ui_font_n.font_width()/2) - 73, 3);
    }

    function draw_palat_pane()
    {
        if (palatPaneBuffer.length > 0)
        {
            draw_image(palatPaneBuffer, palatPaneMousePick, palatPaneWidth, palatPaneHeight, 0, 0);
        }
    }

    function draw_minimap()
    {
        // The minimap image by iterating over the tilemap and grabbing a pixel off each corresponding
        // PALA texture.
        /// TODO: You can pre-generate the image rather than re-generating it each frame.
        const width = 64;
        const height = 32;
        const xMul = (Rsed.maasto_n.track_side_length() / width);
        const yMul = (Rsed.maasto_n.track_side_length() / height);
        const image = [];   // An array of palette indices that forms the minimap image.
        const mousePick = [];
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const tileX = (x * xMul);
                const tileZ = (y * yMul);

                const pala = Rsed.palat_n.pala_texture(Rsed.maasto_n.varimaa_tile_at(tileX, tileZ));
                let color = ((pala == null)? 0 : pala.paletteIndices[1]);

                // Have a black outline.
                if (y % (height - 1) === 0) color = "black";
                if (x % (width - 1) === 0) color = "black";

                image.push(color);
                mousePick.push(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                                                                  {elementId:Rsed.ui_input_n.uiElement.minimap,
                                                                   uiX:tileX, uiY:tileZ}));
            }
        }

        draw_image(image, null, width, height, pixelSurface.width - width - 4, 3, false);

        // Draw a frame around the camera view on the minimap.
        if (image && xMul && yMul)
        {
            const frame = [];
            const frameWidth = Math.round((Rsed.camera_n.view_width() / xMul));
            const frameHeight = Math.floor((Rsed.camera_n.view_height() / yMul));
            
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

            const camX = (Rsed.camera_n.pos_x() / xMul);
            const camZ = (Rsed.camera_n.pos_z() / yMul);
            draw_image(frame, null, frameWidth, frameHeight, pixelSurface.width - width - 4 + camX, 3 + camZ, true);
        }
    }

    function draw_active_pala()
    {
        const currentPala = Rsed.ui_brush_n.brush_pala_idx();
        const pala = Rsed.palat_n.pala_texture(currentPala);

        if (pala != null)
        {
            draw_image(pala.paletteIndices, null, 16, 16, pixelSurface.width - 16 - 5, 34 + 3, false);
            draw_string((Rsed.ui_brush_n.brush_size() + 1) + "*", pixelSurface.width - 16 - 4 + 6, 34 + 3 + 16)
        }
    }

    /// FIXME: This gets very slow to draw, because each pixel is paletted. Pre-bake the image as RGBA values
    /// into a buffer and just blit it out, updating the buffer whenever you edit the VARIMAA.
    function draw_paint_view()
    {
        // Draw a large minimap of the track in the middle of the screen.
        const width = Math.floor(Rsed.main_n.render_width() * 0.81);
        const height = Math.floor(Rsed.main_n.render_height() * 0.72);
        {
            const xMul = (Rsed.maasto_n.track_side_length() / width);
            const zMul = (Rsed.maasto_n.track_side_length() / height);
            const image = [];   // An array of palette indices that forms the minimap image.
            const mousePick = [];

            for (let z = 0; z < height; z++)
            {
                for (let x = 0; x < width; x++)
                {
                    const tileX = Math.floor(x * xMul);
                    const tileZ = Math.floor(z * zMul);

                    const pala = Rsed.palat_n.pala_texture(Rsed.maasto_n.varimaa_tile_at(tileX, tileZ));
                    let color = ((pala == null)? 0 : pala.paletteIndices[1]);

                    // Create an outline.
                    if (z % (height - 1) === 0) color = "gray";
                    if (x % (width - 1) === 0) color = "gray";

                    // Indicate the location of the track's checkpoint.
                    if ((tileX === Rsed.maasto_n.track_checkpoint_x()) &&
                        (tileZ === Rsed.maasto_n.track_checkpoint_y()))
                    {
                        color = "white";
                    }

                    image.push(color);
                    mousePick.push(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                        {elementId:Rsed.ui_input_n.uiElement.large_minimap,
                        uiX:tileX, uiY:tileZ}));
                }
            }



            draw_image(image, mousePick, width, height, ((pixelSurface.width / 2) - (width / 2)), ((pixelSurface.height / 2) - (height / 2)), false);
        }

        draw_string("TRACK SIZE:" + Rsed.maasto_n.track_side_length() + "," + Rsed.maasto_n.track_side_length(),
                    ((pixelSurface.width / 2) - (width / 2)),
                    ((pixelSurface.height / 2) - (height / 2)) - Rsed.ui_font_n.font_height());
    }

    const publicInterface = {};
    {
        // Call this when RallySportED crashes and you want the user to be given a visual indication of that
        // on the render surface.
        // NOTE: Avoid evoking Rsed.assert in this function, since the function itself may be called on asserts.
        publicInterface.draw_crash_message = function(renderSurface, message)
        {
            if (!(renderSurface instanceof Rsed.render_surface_n.render_surface_o)) return;

            pixelSurface = renderSurface.exposed().getImageData(0, 0, renderSurface.width, renderSurface.height);

            draw_string(">RALLYSPORTED HAS CRASHED. SORRY ABOUT THAT!", 2, Rsed.ui_font_n.font_height());

            renderSurface.exposed().putImageData(pixelSurface, 0, 0);
            pixelSurface = null;
        }

        publicInterface.draw_ui = function(renderSurface = Rsed.render_surface_n.render_surface_o)
        {
            Rsed.assert && (renderSurface instanceof Rsed.render_surface_n.render_surface_o)
                        || Rsed.throw("Expected to receive the render surface.");

            // Draw the UI.
            pixelSurface = renderSurface.exposed().getImageData(0, 0, renderSurface.width, renderSurface.height);
            mousePickBuffer = renderSurface.mousePickBuffer;
            Rsed.assert && (mousePickBuffer.length === (pixelSurface.width * pixelSurface.height))
                        || Rsed.throw("Incompatible mouse-picking buffer.");
            {
                switch (Rsed.ui_view_n.current_view())
                {
                    case "3d":
                    case "3d-topdown":
                    {
                        //draw_fps();
                        draw_watermark();
                        draw_minimap();
                        draw_active_pala();
                        draw_footer_info();
                        if (Rsed.ui_view_n.showPalatPane) draw_palat_pane();

                        break;
                    }
                    case "2d-topdown":
                    {
                        draw_paint_view();
                        draw_active_pala();
                        if (Rsed.ui_view_n.showPalatPane) draw_palat_pane();
                        
                        break;
                    }
                    default: break;
                }

                draw_mouse_cursor();
            }
            renderSurface.exposed().putImageData(pixelSurface, 0, 0);
            pixelSurface = null;
            mousePickBuffer = null;
        }

        // Create a set of thumbnails of the contents of the current PALAT file. We'll display this pane of
        // thumbnails to the user for selecting PALAs.
        publicInterface.prebake_palat_pane = function()
        {
            const maxNumPalas = 253;
            if (Rsed.palat_n.num_palas() < maxNumPalas) return;

            palatPaneBuffer.length = 0;
            palatPaneMousePick.length = 0;

            // Recompute the pane's dimensions based on the current display size.
            /// FIXME: Leaves unnecessary empty rows for some resolutions.
            numPalatPaneRows = (Math.floor(Rsed.main_n.render_height() / 8) - 1);
            numPalatPaneCols = Math.ceil(253 / numPalatPaneRows);
            palatPaneWidth = ((numPalatPaneCols * (Rsed.palat_n.pala_width() / 2)) + 1);
            palatPaneHeight = ((numPalatPaneRows * (Rsed.palat_n.pala_height() / 2)) + 1);
        
            let palaIdx = 0;
            for (let y = 0; y < numPalatPaneRows; y++)
            {
                for (let x = 0; x < numPalatPaneCols; (x++, palaIdx++))
                {
                    if (palaIdx > maxNumPalas) break;

                    const pala = Rsed.palat_n.pala_texture(palaIdx);
                    for (let py = 0; py < Rsed.palat_n.pala_height(); py++)
                    {
                        for (let px = 0; px < Rsed.palat_n.pala_width(); px++)
                        {
                            const palaTexel = Math.floor(px + py * Rsed.palat_n.pala_width());
                            const bufferTexel = Math.floor((Math.floor(x * Rsed.palat_n.pala_width() + px) / 2) +
                                                            Math.floor((y * Rsed.palat_n.pala_height() + py) / 2) * palatPaneWidth);

                            palatPaneBuffer[bufferTexel] = Rsed.palette_n.palette_idx_to_rgba(pala.paletteIndices[palaTexel]);
                            palatPaneMousePick[bufferTexel] = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                                                                                                 {elementId:Rsed.ui_input_n.uiElement.palat_pane, uiX:palaIdx, uiY:0});
                        }
                    }
                }
            }

            // Draw a grid over the PALA thumbnails.
            for (let i = 0; i < numPalatPaneRows * Rsed.palat_n.pala_height()/2; i++)
            {
                for (let x = 0; x < numPalatPaneCols; x++)
                {
                    palatPaneBuffer[(x * Rsed.palat_n.pala_width()/2) + i * palatPaneWidth] = "black";
                }
            }
            for (let i = 0; i < numPalatPaneCols * Rsed.palat_n.pala_width()/2; i++)
            {
                for (let y = 0; y < numPalatPaneRows; y++)
                {
                    palatPaneBuffer[i + (y * Rsed.palat_n.pala_height()/2) * palatPaneWidth] = "black";
                }
            }
        }
    }
    return publicInterface;
})();
