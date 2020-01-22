/*
 * Most recent known filename: js/core/scene-3d.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

{
    // Lets us keep track of mouse position delta between frames; e.g. for dragging props.
    let prevMousePos = {x:0, y:0};

    // Whether to draw a wireframe around the scene's polygons.
    let showWireframe = true;

    // Whether to show the PALAT pane; i.e. a side panel that displays all the available
    // PALA textures.
    let showPalatPane = false;

    // Whether to render props (track-side 3d objects - like trees, billboards, etc.).
    let showProps = true;

    /// Temp hack. Lets the renderer know that we want it to update mouse hover information
    /// once the next frame has finished rendering. This is used e.g. to keep proper track
    /// mouse hover when various UI elements are toggled on/off.
    let updateMouseHoverOnFrameFinish = false;

    // RallySportED's main scene. Displays the project as a textured 3d mesh; and allows
    // the user to edit the heightmap and tilemap via mouse and keyboard interaction.
    Rsed.scenes["3d"] = Rsed.scene(
    {
        draw_ui: function(canvas)
        {
            Rsed.ui.draw.begin_drawing(canvas);

            Rsed.ui.draw.watermark();
            Rsed.ui.draw.minimap();
            Rsed.ui.draw.active_pala();
            Rsed.ui.draw.footer_info();
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
            const trackMesh = Rsed.world.mesh_builder.track_mesh(
            {
                cameraPos: Rsed.world.camera.position_floored(),
                solidProps: showProps,
                includeWireframe: showWireframe,
            });

            const renderInfo = Rngon.render(canvas.domElement.getAttribute("id"), [trackMesh],
            {
                cameraPosition: Rngon.translation_vector(0, 0, 0),
                cameraDirection: Rsed.world.camera.rotation(),
                scale: canvas.scalingFactor,
                fov: 45,
                nearPlane: 300,
                farPlane: 10000,
                clipToViewport: true,
                depthSort: "none",
                auxiliaryBuffers: [{buffer:canvas.mousePickingBuffer, property:"mousePickId"}],
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
            // Handle keyboard input to move the camera.
            {
                const movement = {x:0, y:0, z:0};

                if (Rsed.ui.inputState.key_down("s")) movement.x += -1;
                if (Rsed.ui.inputState.key_down("f")) movement.x +=  1;
                if (Rsed.ui.inputState.key_down("e")) movement.z += -1;
                if (Rsed.ui.inputState.key_down("d")) movement.z +=  1;
        
                //movement.normalize(); /// TODO: Disabled for now, since diagonal movement is too jerky without the double movement speed.
                Rsed.world.camera.move_camera(movement.x, movement.y, movement.z);
            }

            // Handle keyboard input for one-off events, where the key press is registered
            // only once (no repeat).
            {
                if (Rsed.ui.inputState.key_down("q"))
                {
                    Rsed.core.set_scene((Rsed.core.current_scene() === Rsed.scenes["3d"])? "tilemap" : "3d");
                    Rsed.ui.inputState.set_key_down("q", false);
                }

                if (Rsed.ui.inputState.key_down("w"))
                {
                    showWireframe = !showWireframe;
                    Rsed.ui.inputState.set_key_down("w", false);
                }

                if (Rsed.ui.inputState.key_down("a"))
                {
                    showPalatPane = !showPalatPane;
                    Rsed.ui.inputState.set_key_down("a", false);

                    // Prevent a mouse click from acting on the ground behind the pane when the pane
                    // is brought up, and on the pane when the pane has been removed.
                    updateMouseHoverOnFrameFinish = true;
                }

                if (Rsed.ui.inputState.key_down("l"))
                {
                    const newHeight = parseInt(window.prompt("Level the terrain to a height of..."), 10);

                    if (!isNaN(newHeight))
                    {
                        Rsed.core.current_project().maasto.bulldoze(newHeight);
                    }

                    Rsed.ui.inputState.set_key_down("l", false);
                }

                if (Rsed.ui.inputState.key_down("b"))
                {
                    showProps = !showProps;
                    Rsed.ui.inputState.set_key_down("b", false);
                }

                if (Rsed.ui.inputState.key_down(" "))
                {
                    Rsed.ui.groundBrush.brushSmoothens = !Rsed.ui.groundBrush.brushSmoothens;
                    Rsed.ui.inputState.set_key_down(" ", false);
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

            // Handle mouse input.
            {
                if (Rsed.ui.inputState.mouse_button_down())
                {
                    const grab = Rsed.ui.inputState.current_mouse_grab();
                    const hover = Rsed.ui.inputState.current_mouse_hover();

                    if (!grab) return;

                    switch (grab.type)
                    {
                        case "ground":
                        {
                            if (!hover) break;

                            // Add a new prop.
                            if (Rsed.ui.inputState.key_down("shift") &&
                                Rsed.ui.inputState.left_mouse_button_down()) 
                            {
                                // For now, shared mode doesn't support interacting with props.
                                if (Rsed.shared_mode.enabled())
                                {
                                    Rsed.ui.popup_notification("Props cannot be added in shared mode.");

                                    // Prevent the same input from registering again next frame, before
                                    // the user has had time to release the mouse button.
                                    Rsed.ui.inputState.reset_mouse_buttons_state();

                                    break;
                                }

                                Rsed.core.current_project().props.add_location(Rsed.core.current_project().track_id(),
                                                                               Rsed.core.current_project().props.id_for_name("tree"),
                                                                               {
                                                                                   x: (hover.groundTileX * Rsed.constants.groundTileSize),
                                                                                   z: (hover.groundTileY * Rsed.constants.groundTileSize),
                                                                               });

                                Rsed.ui.inputState.reset_mouse_hover();

                                break;
                            }

                            // Edit/paint the terrain.
                            if (Rsed.ui.inputState.left_mouse_button_down() ||
                                Rsed.ui.inputState.right_mouse_button_down())
                            {
                                const delta = (Rsed.ui.inputState.left_mouse_button_down()? 2 : (Rsed.ui.inputState.right_mouse_button_down()? -2 : 0));
                                
                                Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changeHeight,
                                                                           delta,
                                                                           hover.groundTileX,
                                                                           hover.groundTileY);
                            }
                            else if (Rsed.ui.inputState.mid_mouse_button_down())
                            {
                                Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
                                                                           Rsed.ui.groundBrush.brush_pala_idx(),
                                                                           hover.groundTileX,
                                                                           hover.groundTileY);
                            }

                            break;
                        }
                        case "prop":
                        {
                            // For now, shared mode doesn't support interacting with props.
                            if (Rsed.shared_mode.enabled())
                            {
                                Rsed.ui.popup_notification("Props cannot be edited in shared mode.");

                                // Prevent the same input from registering again next frame, before
                                // the user has had time to release the mouse button.
                                Rsed.ui.inputState.reset_mouse_buttons_state();

                                break;
                            }

                            if (Rsed.ui.inputState.left_mouse_button_down())
                            {
                                // Remove the selected prop.
                                if (Rsed.ui.inputState.key_down("shift"))
                                {
                                    Rsed.core.current_project().props.remove(Rsed.core.current_project().track_id(), hover.propTrackIdx);

                                    Rsed.ui.inputState.reset_mouse_hover();
                                }
                                // Drag the prop.
                                else
                                {
                                    // For now, don't allow moving the starting line (always prop #0).
                                    if (grab.propTrackIdx === 0)
                                    {
                                        Rsed.ui.popup_notification("The finish line cannot be moved.");
        
                                        // Prevent the same input from registering again next frame, before
                                        // the user has had time to release the mouse button.
                                        Rsed.ui.inputState.reset_mouse_buttons_state();
        
                                        break;
                                    }
                                    else
                                    {
                                        const mousePosDelta =
                                        {
                                            x: (Rsed.ui.inputState.mouse_pos().x - prevMousePos.x),
                                            y: (Rsed.ui.inputState.mouse_pos().y - prevMousePos.y),
                                        }

                                        Rsed.core.current_project().props.move(Rsed.core.current_project().track_id(),
                                                                               grab.propTrackIdx,
                                                                               {
                                                                                   x: (mousePosDelta.x * 1.5),
                                                                                   z: (mousePosDelta.y * 2.5),
                                                                               });
                                    }
                                }
                            }

                            break;
                        }
                        case "ui-element":
                        {
                            if (!hover) break;
                            
                            switch (hover.uiElementId)
                            {
                                case "palat-pane":
                                {
                                    if (Rsed.ui.inputState.left_mouse_button_down() ||
                                        Rsed.ui.inputState.right_mouse_button_down())
                                    {
                                        Rsed.ui.groundBrush.set_brush_pala_idx(hover.palaIdx);
                                    }

                                    break;
                                }
                                default: break;
                            }

                            break;
                        }
                        default: break;
                    }
                }

                if (Rsed.ui.inputState.mouse_wheel_scroll())
                {
                    Rsed.world.camera.zoom_vertically(-Rsed.ui.inputState.mouse_wheel_scroll() / 2);

                    Rsed.ui.inputState.reset_wheel_scroll();
                }
            }

            prevMousePos = Rsed.ui.inputState.mouse_pos();
        },
    });
}
