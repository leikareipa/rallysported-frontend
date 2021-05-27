/*
 * Most recent known filename: js/scenes/scene-texture.js
 *
 * 2019-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

// A view of a given texture, allowing the user to modify the texture's pixels.
Rsed.scenes["texture"] = (function()
{
    // A reference to the Rsed.visual.texture() object that we're to edit.
    let texture = null;

    // Texture pixels copied with Ctrl + C.
    let clipboard;
    reset_clipboard();

    // The amount by which the user has moved the texture's position in the view.
    let textureUserOffsetX = 0;
    let textureUserOffsetY = 0;
    let textureZoom = 1;

    // A buffer in which we store mouse-picking information about the rendering - so for
    // each pixel on-screen, we can tell to which part of the texture the pixel corresponds.
    const textureMousePickBuffer = [];

    const sceneSettings = {
        // Which color (index to Rally-Sport's palette) to paint with.
        penColorIdx: false,

        // Whether to show the PALAT pane; i.e. a side panel that displays all the available
        // PALA textures.
        showPalatPane: false,
    };

    // In which direction(s) the camera is currently moving. This is affected
    // by e.g. user input.
    const cameraMovement = {
        up: false,
        down: false,
        left: false,
        right: false,
    };

    // Load UI components.
    let uiComponents = null;
    (async()=>
    {
        uiComponents = {
            fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
            colorSelector: Rsed.ui.component.colorSelector.instance(),
            resolutionLabel: Rsed.ui.component.label.instance(),
            zoomLabel: Rsed.ui.component.label.instance(),
            viewLabel: Rsed.ui.component.label.instance(),
            clipboardLabel: Rsed.ui.component.label.instance(),
            palatPane: Rsed.ui.component.palatPane.instance({
                selectionCallback: (palaIdx)=>scene.set_texture(Rsed.core.current_project().palat.texture[palaIdx]),
                indicateSelection: false,
            }),
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

        on_key_release: function(key)
        {
            function key_is(compared)
            {
                return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
            }

            if (key_is("s"))
            {
                cameraMovement.up = false;
            }
            else if (key_is("f"))
            {
                cameraMovement.down = false;
            }
            else if (key_is("e"))
            {
                cameraMovement.left = false;
            }
            else if (key_is("d"))
            {
                cameraMovement.right = false;
            }

            return;
        },

        on_key_fire: function(key, repeat = false)
        {
            function key_is(compared)
            {
                return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
            }

            if (key_is("s"))
            {
                cameraMovement.up = true;
            }
            else if (key_is("f"))
            {
                cameraMovement.down = true;
            }
            else if (key_is("e"))
            {
                cameraMovement.left = true;
            }
            else if (key_is("d"))
            {
                cameraMovement.right = true;
            }
            else if (key_is("a") && !repeat)
            {
                sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
            }
            else if (key_is("z"))
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
            }
            else if (key_is("c") &&
                     Rsed.ui.inputState.key_down("control"))
            {
                copy_to_clipboard(texture);
            }
            else if (key_is("v") &&
                     Rsed.ui.inputState.key_down("control"))
            {
                paste_from_clipboard();
            }
            else if (key_is("r"))
            {
                texture = rotated(texture);
            }
            else if (key_is("y") &&
                     Rsed.ui.inputState.key_down("control") )
            {
                Rsed.ui.undoStack.redo();
            }
            else if (key_is("q"))
            {
                Rsed.core.set_scene("terrain");
                Rsed.ui.inputState.set_key_down("q", false);
            }
            else
            {
                for (const brushSizeKey of ["1", "2", "3", "4", "5"])
                {
                    if (key_is(brushSizeKey))
                    {
                        Rsed.ui.groundBrush.set_brush_size((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
                    }
                }
            }

            return;
        },

        draw_ui: function()
        {
            if (!texture)
            {
                Rsed.throw_if(Rsed.core.current_project().isPlaceholder,
                              "Expected project data to have been loaded already.");

                this.set_texture(Rsed.core.current_project().palat.texture[3]);
            }

            Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);

            if (uiComponents) // Once the UI components have finished async loading...
            {
                const margin = 4;

                uiComponents.viewLabel.update("Editor: Texture");
                uiComponents.viewLabel.draw(margin, margin);

                uiComponents.colorSelector.update(sceneSettings);
                uiComponents.colorSelector.draw((Rsed.visual.canvas.width - 101), margin);

                const truncatedZoomValue = (1 / textureZoom).toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
                uiComponents.zoomLabel.update(`Zoom: ${truncatedZoomValue}*`);
                uiComponents.zoomLabel.draw(margin, (Rsed.visual.canvas.height - (Rsed.ui.font.nativeHeight * 3) - 9));
                
                uiComponents.resolutionLabel.update(`Size: ${texture.width} * ${texture.height}`);
                uiComponents.resolutionLabel.draw(margin, (Rsed.visual.canvas.height - (Rsed.ui.font.nativeHeight * 2) - 7));

                uiComponents.clipboardLabel.update(clipboard
                                                   ? `Clipboard: ${clipboard.width} * ${clipboard.height}${(clipboard.source == texture)? " (this)" : ""}`
                                                   : "Clipboard: empty");
                uiComponents.clipboardLabel.draw(margin, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 5));
                
                if (Rsed.core.fps_counter_enabled())
                {
                    uiComponents.fpsIndicator.draw(margin, 10);
                }

                if (sceneSettings.showPalatPane)
                {
                    uiComponents.palatPane.update(sceneSettings);
                    uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 47);
                }
            }

            Rsed.ui.draw.finish_drawing(Rsed.visual.canvas);

            return;
        },

        draw_mesh: function()
        {
            if (!texture)
            {
                Rsed.throw_if(Rsed.core.current_project().isPlaceholder,
                              "Expected project data to have been loaded already.");

                this.set_texture(Rsed.core.current_project().palat.texture[3]);
            }

            // Update the camera's position.
            {
                const direction = Rngon.vector3(0, 0, 0);
                const movementSpeed = 0.5;

                if (cameraMovement.left) direction.y += -1;
                if (cameraMovement.right) direction.y += 1;
                if (cameraMovement.up) direction.x += -1;
                if (cameraMovement.down) direction.x +=  1;

                Rngon.vector3.normalize(direction);
                textureUserOffsetX += (direction.x * movementSpeed);
                textureUserOffsetY += (direction.y * movementSpeed);
            }
            
            textureMousePickBuffer.length = 0;

            const textureNgon = Rngon.ngon([Rngon.vertex(0, 0, (textureZoom * 50), 0, 0),
                                            Rngon.vertex(texture.width, 0, (textureZoom * 50), 1, 0),
                                            Rngon.vertex(texture.width, texture.height, (textureZoom * 50), 1, 1),
                                            Rngon.vertex(0, texture.height, (textureZoom * 50), 0, 1)],
            {
                color: Rngon.color_rgba(255, 255, 255),
                texture: texture,
                hasWireframe: true,
                wireframeColor: Rngon.color_rgba(255, 255, 0),
                textureMapping: "affine",
                uvWrapping: "clamp",
                allowAlphaReject: false,
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
                pixelShader: function({renderWidth, renderHeight, fragmentBuffer})
                {
                    for (let i = 0; i < (renderWidth * renderHeight); i++)
                    {
                        const u = (fragmentBuffer[i].textureUScaled == null)
                                  ? null
                                  : Math.max(0, Math.min((texture.width - 1), fragmentBuffer[i].textureUScaled));

                        const v = (fragmentBuffer[i].textureVScaled == null)
                                  ? null
                                  : Math.max(0, Math.min((texture.height - 1), fragmentBuffer[i].textureVScaled));

                        textureMousePickBuffer[i] = {u, v};

                        // Reset the fragment buffer as we go along, since the renderer doesn't at the
                        // time of writing this clear the fragment buffer at the beginning of each frame.
                        fragmentBuffer[i].textureUScaled = null;
                        fragmentBuffer[i].textureVScaled = null;
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
            handle_mouse_input();
            update_cursor_graphic();

            Rsed.visual.canvas.mousePickingBuffer.fill(null);
        },
    });

    return scene;

    function rotated(texture)
    {
        if (!texture)
        {
            Rsed.ui.popup_notification("No texture data to rotate.", {
                notificationType: "error",
            });

            return texture;
        }

        if (texture.width != texture.height)
        {
            Rsed.ui.popup_notification("Only square textures can be rotated.", {
                notificationType: "warning",
            });

            return texture;
        }

        const indices = [...texture.indices];

        // Rotate 90 degrees.
        for (let y = 0; y < (texture.height - 1); y++)
        {
            for (let x = y; x < texture.width; x++)
            {
                const idx1 = (x + y * texture.width);
                const idx2 = (y + x * texture.width);

                [indices[idx1], indices[idx2]] = [indices[idx2], indices[idx1]];
            }
        }

        // Mirror.
        for (let x = 0; x < (texture.width / 2); x++)
        {
            for (let y = 0; y < texture.height; y++)
            {
                const idx1 = (x + y * texture.width);
                const idx2 = ((texture.width - 1 - x) + y * texture.width);

                [indices[idx1], indices[idx2]] = [indices[idx2], indices[idx1]];
            }
        }

        return Rsed.ui.assetMutator.user_edit("texture", {
            command: "set-all-pixels",
            target: {texture},
            data: indices,
        });
    }

    function reset_clipboard()
    {
        clipboard = undefined;

        return;
    }

    function copy_to_clipboard(texture)
    {
        if (!texture)
        {
            Rsed.ui.popup_notification("No texture to copy.", {
                notificationType: "error",
            });

            return;
        }

        clipboard = {
            width: texture.width,
            height: texture.height,
            colorIndices: [...texture.indices],
            source: texture,
        };

        return;
    }

    function paste_from_clipboard()
    {
        if (!clipboard)
        {
            Rsed.ui.popup_notification("The clipboard is empty.", {
                notificationType: "warning",
            });

            return;
        }

        if ((texture.width != clipboard.width) ||
            (texture.height != clipboard.height))
        {
            Rsed.ui.popup_notification("The clipboard's resolution doesn't match. It can't be pasted here.", {
                notificationType: "warning",
            });

            return;
        }
        
        // Note: Changing a pixel in the texture causes the texture to be regenerated,
        // so we need to update our reference to it. (The new reference is returned
        // from the pixel-setting function.)
        texture = Rsed.ui.assetMutator.user_edit("texture", {
            command: "set-all-pixels",
            target: {texture},
            data: clipboard.colorIndices,
        });

        return;
    }

    function update_cursor_graphic()
    {
        const cursors = Rsed.ui.cursorHandler.cursors;
        const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();
        const pickElement = textureMousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];
        const isCursorOnTexture = (pickElement && (pickElement.u !== null) && (pickElement.v !== null));

        const newCursor = (()=>
        {
            if (isCursorOnTexture)
            {
                if (Rsed.ui.inputState.key_down("tab"))
                {
                    return cursors.eyedropper;
                }
                else
                {
                    return cursors.pencil;
                }
            }
            else
            {
                return cursors.default;
            }
        })();

        Rsed.ui.cursorHandler.set_cursor(newCursor);
        
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
            const isCursorOnTexture = (pickElement && (pickElement.u !== null) && (pickElement.v !== null));

            if (isCursorOnTexture)
            {
                const colorIdxUnderCursor = texture.indices[pickElement.u + pickElement.v * texture.width];

                // Eyedropper.
                if (Rsed.ui.inputState.key_down("tab"))
                {
                    uiComponents.colorSelector.set_color_idx(colorIdxUnderCursor);

                    // Only allow the eyedropper to select one pixel per click, so you don't get
                    // flicker in the color selector if the mouse is moved while holding the click.
                    Rsed.ui.inputState.reset_mouse_buttons_state();
                }
                else
                {
                    if (colorIdxUnderCursor !== sceneSettings.penColorIdx)
                    {
                        // Note: Changing a pixel in the texture causes the texture to be regenerated,
                        // so we need to update our reference to it. (The new reference is returned
                        // from the pixel-setting function.)
                        texture = Rsed.ui.assetMutator.user_edit("texture", {
                            command: "set-pixel",
                            target: {
                                texture,
                                u: pickElement.u,
                                v: pickElement.v,
                            },
                            data: sceneSettings.penColorIdx,
                        });
                    }
                }
            }
        }
        else if (Rsed.ui.inputState.mouse_wheel_scroll())
        {
            textureZoom += (.1 * Math.sign(Rsed.ui.inputState.mouse_wheel_scroll()));
            Rsed.ui.inputState.reset_wheel_scroll();
        }
        
        return;
    }
})();
