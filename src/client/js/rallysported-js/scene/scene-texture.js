/*
 * Most recent known filename: js/scenes/scene-texture.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

// A view of a given texture, allowing the user to paint the texture.
Rsed.scenes["texture"] = (function()
{
    /// Temp hack. Lets the renderer know that we want it to update mouse hover information
    /// once the next frame has finished rendering. This is used e.g. to keep proper track
    /// mouse hover when various UI elements are toggled on/off.
    let updateMouseHoverOnFrameFinish = false;

    // A reference to the Rsed.visual.texture() object that we're to edit.
    let texture = null;

    // The amount by which the user has moved the texture's position in the view.
    let textureUserOffsetX = 0;
    let textureUserOffsetY = 0;
    let textureZoom = 50;

    // A buffer in which we store mouse-picking information about the rendering - so for
    // each pixel on-screen, we can tell to which part of the texture the pixel corresponds.
    const textureMousePickBuffer = [];

    const sceneSettings = {
        // Which color (index to Rally-Sport's palette) to paint with.
        selectedColorIdx: false,
    };

    // Load UI components.
    let uiComponents = null;
    (async()=>
    {
        uiComponents = {
            fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
            colorSelector: Rsed.ui.component.colorSelector.instance(),
        };
    })();

    const scene = Rsed.scene(
    {
        // Assign the texture to be edited. Must be either an instance of Rsed.visual.texture
        // or an object that implements Rsed.visual.texture's public API.
        set_texture: function(tex)
        {
            texture = tex;
        },

        draw_ui: function()
        {
            Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);

            if (uiComponents) // Once the UI components have finished async loading...
            {
                uiComponents.colorSelector.update(sceneSettings);
                uiComponents.colorSelector.draw((Rsed.visual.canvas.width - 35), 4);
                
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
            if (!texture)
            {
                return;
            }
            
            textureMousePickBuffer.length = 0;

            const textureNgon = Rngon.ngon([Rngon.vertex(0, 0, textureZoom, 0, 0),
                                            Rngon.vertex(texture.width, 0, textureZoom, 1, 0),
                                            Rngon.vertex(texture.width, texture.height, textureZoom, 1, 1),
                                            Rngon.vertex(0, texture.height, textureZoom, 0, 1)],
                                            {
                                                color: Rngon.color_rgba(255, 255, 255),
                                                texture: texture,
                                                hasWireframe: true,
                                                wireframeColor: Rngon.color_rgba(255, 255, 0),
                                                textureMapping: "affine",
                                                uvWrapping: "clamp",
                                            });

            const renderInfo = Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), [Rngon.mesh([textureNgon])],
            {
                cameraPosition: Rngon.translation_vector(-textureUserOffsetX, textureUserOffsetY, 0),
                scale: Rsed.visual.canvas.scalingFactor,
                fov: 45,
                nearPlane: 0,
                farPlane: 10000,
                depthSort: "painter",
                useDepthBuffer: false,

                // For each pixel we're rendered, mark its texture UV coordinates into our
                // mouse-picking buffer.
                pixelShaderFunction: function({renderWidth, renderHeight, fragmentBuffer})
                {
                    for (let i = 0; i < (renderWidth * renderHeight); i++)
                    {
                        const u = fragmentBuffer[i].textureU;
                        const v = fragmentBuffer[i].textureV;

                        textureMousePickBuffer[i] = {
                            u: ((typeof u === "undefined")? undefined : ~~(u * texture.width)),
                            v: ((typeof v === "undefined")? undefined : ~~(v * texture.height)),
                        };

                        // Reset the fragment buffer as we go along, since the renderer doesn't at the
                        // time of writing this clear the fragment buffer at the beginning of each frame.
                        fragmentBuffer[i].textureU = undefined;
                        fragmentBuffer[i].textureV = undefined;
                    }
                },
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
        },
    });

    return scene;

    function handle_keyboard_input()
    {
        // Handle keyboard input to move the texture.
        {
            const direction = Rngon.vector3(0, 0, 0);
            const movementSpeed = 0.5;

            if (Rsed.ui.inputState.key_down("s")) direction.x += -1;
            if (Rsed.ui.inputState.key_down("f")) direction.x +=  1;
            if (Rsed.ui.inputState.key_down("e")) direction.y += -1;
            if (Rsed.ui.inputState.key_down("d")) direction.y +=  1;

            Rngon.vector3.normalize(direction);
            textureUserOffsetX += (direction.x * movementSpeed);
            textureUserOffsetY += (direction.y * movementSpeed);
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

            if (Rsed.ui.inputState.key_down("a"))
            {
                sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
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
        if (!texture)
        {
            return;
        }

        const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();

        // Handle painting the texture.
        if (Rsed.ui.inputState.mouse_button_down())
        {
            const pickElement = textureMousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];

            if (pickElement &&
                (typeof pickElement.u !== "undefined") &&
                (typeof pickElement.v !== "undefined"))
            {
                // Note: Changing a pixel in the texture causes the texture to be regenerated,
                // so we need to update our reference to it. (The new reference is returned
                // from the pixel-setting function.)
                texture = texture.set_pixel_at(pickElement.u, pickElement.v, sceneSettings.selectedColorIdx);
            }
        }
        else if (Rsed.ui.inputState.mouse_wheel_scroll())
        {
            textureZoom += (Rsed.ui.inputState.mouse_wheel_scroll() / 3);
            Rsed.ui.inputState.reset_wheel_scroll();
        }
        
        return;
    }
})();
