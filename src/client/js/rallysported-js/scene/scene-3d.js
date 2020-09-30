/*
 * Most recent known filename: js/scenes/scene-3d.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

// RallySportED's main scene. Displays the project as a textured 3d mesh; and allows
// the user to edit the heightmap and tilemap via mouse and keyboard interaction.
Rsed.scenes["3d"] = (function()
{
    // Lets us keep track of mouse position delta between frames; e.g. for dragging props.
    let prevMousePos = {x:0, y:0};

    /// Temp hack. Lets the renderer know that we want it to update mouse hover information
    /// once the next frame has finished rendering. This is used e.g. to keep proper track
    /// mouse hover when various UI elements are toggled on/off.
    let updateMouseHoverOnFrameFinish = false;

    const sceneSettings = {
        // Whether to draw a wireframe around the scene's polygons.
        showWireframe: true,

        // Whether to show the PALAT pane; i.e. a side panel that displays all the available
        // PALA textures.
        showPalatPane: false,

        // Whether to render props (track-side 3d objects - like trees, billboards, etc.).
        showProps: true,

        // Whether the currently-selected brush PALA texture should be painted over the
        // ground tile over which the mouse cursor is currently hovering. This gives the
        // user a preview of what that texture would look like, without modifying the
        // tile's actual texture.
        showHoverPala: false,
    }

    // Load UI components.
    let uiComponents = null;
    (async()=>
    {
        uiComponents = {
            activePala:   Rsed.ui.component.activePala.instance(),
            footerInfo:   Rsed.ui.component.groundHoverInfo.instance(),
            minimap:      Rsed.ui.component.tilemapMinimap.instance(),
            palatPane:    Rsed.ui.component.palatPane.instance(),
            fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
        };
    })();

    return Rsed.scene(
    {
        draw_ui: function()
        {
            if ((Rsed.visual.canvas.width <= 0) ||
                (Rsed.visual.canvas.height <= 0))
            {
                return;
            }

            Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);

            if (uiComponents) // Once the UI components have finished async loading...
            {
                // If there's enough horizontal space... (This assumes that the active PALA
                // is drawn on the right side of the screen and to the left of the track's
                // minimap, and that on the left side of the screen is the HTML UI).
                if (Rsed.visual.canvas.domElement.clientWidth > 650)
                {
                    uiComponents.activePala.update(sceneSettings);
                    uiComponents.activePala.draw((Rsed.visual.canvas.width - 88), 4);
                }

                // If there's enough horizontal space...
                if (Rsed.visual.canvas.domElement.clientWidth > 550)
                {
                    uiComponents.footerInfo.update(sceneSettings);
                    uiComponents.footerInfo.draw(0, (Rsed.visual.canvas.height - Rsed.ui.font.font_height()));
                }

                // If there's enough horizontal space... (This assumes that the minimap is
                // drawn on the right side of the screen and that on the left side is the
                // HTML UI.)
                if (Rsed.visual.canvas.domElement.clientWidth > 550)
                {
                    uiComponents.minimap.update(sceneSettings);
                    uiComponents.minimap.draw((Rsed.visual.canvas.width - 4), 4);
                }

                if (sceneSettings.showPalatPane)
                {
                    uiComponents.palatPane.update(sceneSettings);
                    uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 40);
                }

                if (Rsed.core.fps_counter_enabled())
                {
                    uiComponents.fpsIndicator.update(sceneSettings);
                    uiComponents.fpsIndicator.draw(4, 15);
                }
            }

            Rsed.ui.draw.mouse_cursor();

            Rsed.ui.draw.finish_drawing(Rsed.visual.canvas);

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

        draw_mesh: function()
        {
            const trackMesh = Rsed.world.meshBuilder.track_mesh(
            {
                cameraPos: Rsed.world.camera.position_floored(),
                solidProps: sceneSettings.showProps,
                includeWireframe: sceneSettings.showWireframe,
                paintHoverPala: sceneSettings.showHoverPala,
            });

            const renderInfo = Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), [trackMesh],
            {
                cameraPosition: Rngon.translation_vector(0, 0, 0),
                cameraDirection: Rsed.world.camera.rotation(),
                scale: Rsed.visual.canvas.scalingFactor,
                fov: 30,
                nearPlane: 300,
                farPlane: 10000,
                clipToViewport: true,
                depthSort: "painter",
                useDepthBuffer: false,
                auxiliaryBuffers: [{buffer:Rsed.visual.canvas.mousePickingBuffer, property:"mousePickId"}],
            });

            // If the rendering was resized since the previous frame...
            if ((renderInfo.renderWidth !== Rsed.visual.canvas.width ||
                (renderInfo.renderHeight !== Rsed.visual.canvas.height)))
            {
                Rsed.visual.canvas.width = renderInfo.renderWidth;
                Rsed.visual.canvas.height = renderInfo.renderHeight;

                window.close_dropdowns();
            }

            return;
        },

        handle_user_interaction: function()
        {
            handle_keyboard_input();
            handle_mouse_input();

            /// EXPERIMENTAL. Temporary testing of mobile controls.
            const touchDelta = Rsed.ui.inputState.get_touch_move_delta();
            Rsed.world.camera.move_camera(-touchDelta.x, 0, -touchDelta.y);
        },
    });

    function handle_keyboard_input()
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
            if (Rsed.ui.inputState.key_down("z"))
            {
                if (Rsed.ui.inputState.key_down("control") &&
                    Rsed.ui.inputState.key_down("shift"))
                {
                    Rsed.ui.undoStack.redo();
                }
                else if (Rsed.ui.inputState.key_down("control"))
                {
                    Rsed.ui.undoStack.undo();
                }

                Rsed.ui.inputState.set_key_down("z", false);
            }

            if (Rsed.ui.inputState.key_down("y") &&
                Rsed.ui.inputState.key_down("control") )
            {
                Rsed.ui.undoStack.redo();

                Rsed.ui.inputState.set_key_down("y", false);
            }

            if (Rsed.ui.inputState.key_down("q"))
            {
                Rsed.core.set_scene((Rsed.core.current_scene() === Rsed.scenes["3d"])? "tilemap" : "3d");
                Rsed.ui.inputState.set_key_down("q", false);
            }

            if (Rsed.ui.inputState.key_down("t"))
            {
                const mouseHover = Rsed.ui.inputState.current_mouse_hover();

                if (mouseHover && mouseHover.texture)
                {
                    Rsed.scenes["texture"].set_texture(mouseHover.texture);
                    Rsed.core.set_scene("texture");
                    
                    Rsed.ui.inputState.set_key_down("t", false);
                }
            }

            if (Rsed.ui.inputState.key_down("w"))
            {
                sceneSettings.showWireframe = !sceneSettings.showWireframe;
                Rsed.ui.inputState.set_key_down("w", false);
            }

            if (Rsed.ui.inputState.key_down("g"))
            {
                sceneSettings.showHoverPala = !sceneSettings.showHoverPala;
                Rsed.ui.inputState.set_key_down("g", false);
            }

            if (Rsed.ui.inputState.key_down("a"))
            {
                sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
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
                sceneSettings.showProps = !sceneSettings.showProps;
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

        return;
    }

    function handle_mouse_input()
    {
        if (Rsed.ui.inputState.mouse_wheel_scroll())
        {
            Rsed.world.camera.zoom_vertically(-Rsed.ui.inputState.mouse_wheel_scroll() / 2);
            Rsed.ui.inputState.reset_wheel_scroll();
        }

        if (Rsed.ui.inputState.mouse_button_down())
        {
            // Note: A mouse grab can be either a transient click or a longer
            // press.
            const grab = Rsed.ui.inputState.current_mouse_grab();
            const hover = Rsed.ui.inputState.current_mouse_hover();

            if (!grab) return;

            switch (grab.type)
            {
                case "ground":
                {
                    // Note: We'll access the mouse-picking info via hover instead of grab,
                    // since grab will be the tile over which the user pressed down the
                    // mouse button regardless of whether the mouse is moved after that;
                    // while hover indicates the tile over which the mouse - with the button
                    // held down - is currently over.
                    if (!hover) break;

                    if (hover.type !== "ground") break;

                    // Add a new prop.
                    if (Rsed.ui.inputState.left_mouse_button_down() &&
                        Rsed.ui.inputState.left_mouse_click_modifiers().includes("shift"))
                    {
                        Rsed.core.current_project().props.add_location(Rsed.core.current_project().track_id(),
                                                                       Rsed.core.current_project().props.id_for_name("tree"),
                                                                       {
                                                                           x: (hover.groundTileX * Rsed.constants.groundTileSize),
                                                                           z: (hover.groundTileY * Rsed.constants.groundTileSize),
                                                                       });

                        Rsed.ui.inputState.reset_mouse_hover();
                        Rsed.ui.inputState.reset_mouse_grab();

                        break;
                    }

                    // Raise/lower the terrain.
                    if (Rsed.ui.inputState.left_mouse_button_down() ||
                        Rsed.ui.inputState.right_mouse_button_down())
                    {
                        // Left button raises, right button lowers.
                        const delta = (Rsed.ui.inputState.left_mouse_button_down()? 2 : -2);
                        
                        Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changeHeight,
                                                                   delta,
                                                                   hover.groundTileX,
                                                                   hover.groundTileY);

                        break;
                    }

                    // Paint the terrain.
                    if (!Rsed.ui.inputState.key_down("shift") &&
                        Rsed.ui.inputState.mid_mouse_button_down())
                    {
                        Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
                                                                   Rsed.ui.groundBrush.brush_pala_idx(),
                                                                   hover.groundTileX,
                                                                   hover.groundTileY);

                        break;
                    }

                    break;
                }
                
                case "prop":
                {
                    if (Rsed.ui.inputState.left_mouse_button_down())
                    {
                        // Remove the selected prop.
                        if (Rsed.ui.inputState.left_mouse_click_modifiers().includes("shift"))
                        {
                            Rsed.core.current_project().props.remove(Rsed.core.current_project().track_id(), hover.propTrackIdx);

                            Rsed.ui.inputState.reset_mouse_hover();
                            Rsed.ui.inputState.reset_mouse_grab();
                        }
                        // Drag the prop.
                        else
                        {
                            // For now, don't allow moving the starting line (always prop #0).
                            if (grab.propTrackIdx === 0)
                            {
                                Rsed.alert("The finish line can't be moved.");

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

                default: break;
            }
        }

        prevMousePos = Rsed.ui.inputState.mouse_pos();

        return;
    }
})();