/*
 * Most recent known filename: js/scenes/scene-tilemap.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

// A top-down view of the project's tilemap. The user can edit the tilemap via mouse
// interaction.
Rsed.scenes["tilemap"] = (function()
{
    // Whether to show the PALAT pane; i.e. a side panel that displays all the available
    // PALA textures.
    let showPalatPane = false;

    /// Temp hack. Lets the renderer know that we want it to update mouse hover information
    /// once the next frame has finished rendering. This is used e.g. to keep proper track
    /// mouse hover when various UI elements are toggled on/off.
    let updateMouseHoverOnFrameFinish = false;
    
    return Rsed.scene(
    {
        draw_ui: function(canvas)
        {
            Rsed.ui.draw.begin_drawing(canvas);

            /// TODO: The current way of drawing the tilemap - regenerating the entire map
            /// each frame - is quite slow. Instead, we should pre-bake the image, and
            /// modify it only when the user makes changes.

            // Draw the tilemap in the middle of the canvas. For each ground tile on the
            // track, we'll select a color from its texture, and draw the corresponding
            // tilemap pixel with that color.
            const tilemapWidth = Math.floor(Rsed.visual.canvas.width * 0.81);
            const tilemapHeight = Math.floor(Rsed.visual.canvas.height * 0.72);
            {
                const xMul = (Rsed.core.current_project().maasto.width / tilemapWidth);
                const zMul = (Rsed.core.current_project().maasto.width / tilemapHeight);
                const checkpoint = Rsed.core.current_project().checkpoint();
                const tilemap = new Array(tilemapWidth * tilemapHeight); // Palette indices that form the tilemap image.
                const mousePick = new Array(tilemapWidth * tilemapHeight);

                for (let z = 0; z < tilemapHeight; z++)
                {
                    for (let x = 0; x < tilemapWidth; x++)
                    {
                        const tileX = Math.floor(x * xMul);
                        const tileZ = Math.floor(z * zMul);

                        const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
                        let color = ((pala == null)? 0 : pala.indices[1]);

                        if ((tileX === checkpoint.x) &&
                            (tileZ === checkpoint.y))
                        {
                            color = "white";
                        }

                        // We'll give the tilemap's outer edges a frame.
                        if (z % (tilemapHeight - 1) === 0) color = "gray";
                        if (x % (tilemapWidth - 1) === 0) color = "gray";

                        tilemap[x + z * tilemapWidth] = color;
                        mousePick[x + z * tilemapWidth] = Rsed.ui.mouse_picking_element("ui-element",
                        {
                            uiElementId: "tilemap",
                            x: tileX,
                            y: tileZ,
                        });
                    }
                }

                Rsed.ui.draw.image(tilemap, mousePick,
                                   tilemapWidth, tilemapHeight,
                                   ((canvas.width / 2) - (tilemapWidth / 2)), ((canvas.height / 2) - (tilemapHeight / 2)),
                                   false);
            }

            Rsed.ui.draw.string("TRACK SIZE:" + Rsed.core.current_project().maasto.width + "," + Rsed.core.current_project().maasto.width,
                                ((canvas.width / 2) - (tilemapWidth / 2)),
                                ((canvas.height / 2) - (tilemapHeight / 2)) - Rsed.ui.font.font_height());

            Rsed.ui.draw.watermark();
            Rsed.ui.draw.active_pala();
            if (showPalatPane) Rsed.ui.draw.palat_pane();
            if (Rsed.core.fps_counter_enabled()) Rsed.ui.draw.fps();
            Rsed.ui.draw.mouse_cursor();

            Rsed.ui.draw.finish_drawing(canvas);

            // Note: We assume that UI drawing is the last step in rendering the current
            // frame; and thus that once the UI rendering has finished, the frame is finished
            // also.
            if (updateMouseHoverOnFrameFinish)
            {
                Rsed.ui.inputState.update_mouse_hover();
                updateMouseHoverOnFrameFinish = false;
            }

            return;
        },

        draw_mesh: function(canvas)
        {
            // No mesh is used for this scene.
            const emptyMesh = Rngon.mesh();

            const renderInfo = Rngon.render(canvas.domElement.getAttribute("id"), [emptyMesh],
            {
                cameraPosition: Rngon.translation_vector(0, 0, 0),
                cameraDirection: Rngon.rotation_vector(0, 0, 0),
                scale: canvas.scalingFactor,
                fov: 45,
                nearPlane: 300,
                farPlane: 10000,
                clipToViewport: false,
                depthSort: "none",
            });

            // If the rendering was resized since the previous frame...
            if ((renderInfo.renderWidth !== canvas.width ||
                (renderInfo.renderHeight !== canvas.height)))
            {
                canvas.width = renderInfo.renderWidth;
                canvas.height = renderInfo.renderHeight;

                window.close_dropdowns();

                // The PALAT pane needs to adjust to the new size of the canvas.
                Rsed.ui.draw.generate_palat_pane();
            }
            
            return;
        },

        handle_user_interaction: function()
        {
            handle_keyboard_input();
            handle_mouse_input();
        },
    });

    function handle_keyboard_input()
    {
        // Handle keyboard input for one-off events, where the key press is registered
        // only once (no repeat).
        {
            if (Rsed.ui.inputState.key_down("q"))
            {
                Rsed.core.set_scene((Rsed.core.current_scene() === Rsed.scenes["3d"])? "tilemap" : "3d");
                Rsed.ui.inputState.set_key_down("q", false);
            }

            if (Rsed.ui.inputState.key_down("a"))
            {
                showPalatPane = !showPalatPane;
                Rsed.ui.inputState.set_key_down("a", false);

                // Prevent a mouse click from acting on the ground behind the pane when the pane
                // is brought up, and on the pane when the pane has been removed.
                updateMouseHoverOnFrameFinish = true;
            }

            for (const brushSizeKey of ["1", "2", "3", "4", "5"])
            {
                if (Rsed.ui.inputState.key_down(brushSizeKey))
                {
                    Rsed.ui.groundBrush.set_brush_size((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
                    Rsed.ui.inputState.set_key_down(brushSizeKey, false);
                }
            }
        }

        return;
    }

    function handle_mouse_input()
    {
        if (Rsed.ui.inputState.mouse_button_down())
        {
            const grab = Rsed.ui.inputState.current_mouse_grab();
            const hover = Rsed.ui.inputState.current_mouse_hover();

            if (!grab || !hover) return;

            switch (grab.type)
            {
                case "ui-element":
                {
                    switch (hover.uiElementId)
                    {
                        case "tilemap":
                        {
                            if (Rsed.ui.inputState.mid_mouse_button_down())
                            {
                                Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
                                                                        Rsed.ui.groundBrush.brush_pala_idx(),
                                                                        hover.x,
                                                                        hover.y);
                            }

                            break;
                        }
                        case "palat-pane":
                        {
                            if (Rsed.ui.inputState.left_mouse_button_down() ||
                                Rsed.ui.inputState.right_mouse_button_down())
                            {
                                Rsed.ui.groundBrush.set_brush_pala_idx(hover.palaIdx);
                            }

                            break;
                        }
                        default: Rsed.throw("Unknown UI element id for mouse picking."); break;
                    }

                    break;
                }
                default: break;
            }
        }
        
        return;
    }
})();