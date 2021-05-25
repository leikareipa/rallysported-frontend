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
    /// Temp hack. Lets the renderer know that we want it to update mouse hover information
    /// once the next frame has finished rendering. This is used e.g. to keep proper track
    /// mouse hover when various UI elements are toggled on/off.
    let updateMouseHoverOnFrameFinish = false;

    let tilemap = []; // The tilemap view's pixels, in consecutive RGBA (0-255) values.
    let tilemapMesh = null; // A retro n-gon renderer mesh.
    let tilemapWidth = 0;
    let tilemapHeight = 0;
    let tilemapOffsetX = 0;
    let tilemapOffsetY = 0;

    // The latest known size of the canvas we're rendering to.
    let knownCanvasSizeX = 0;
    let knownCanvasSizeY = 0;

    const sceneSettings = {
        // Whether to show the PALAT pane; i.e. a side panel that displays all the available
        // PALA textures.
        showPalatPane: false,
    };

    // Load UI components.
    let uiComponents = null;
    (async()=>
    {
        uiComponents = {
            activePala:   Rsed.ui.component.activePala.instance(),
            palatPane:    Rsed.ui.component.palatPane.instance(),
            viewLabel:    Rsed.ui.component.label.instance(),
            fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
            footer: Rsed.ui.component.label.instance(),
        };
    })();
    
    const scene = Rsed.scene(
    {
        // Refreshes the tilemap view with any new changes to the track's tilemap.
        // Optionally, you can provide the extent of a dirty rectangle: its top
        // left corner is at startX,startY, and it's of the given width and height.
        // Unless a dirty rectangle is given, the entire tilemap view will be
        // refreshed.
        refresh_tilemap_view: function(startX = 0, startY = 0, width = -1, height = -1)
        {
            const project = Rsed.core.current_project();
            const checkpoint = project.track_checkpoint();

            if (Rsed.visual.canvas.width != knownCanvasSizeX ||
                Rsed.visual.canvas.height != knownCanvasSizeY)
            {
                tilemapWidth = Math.round(Rsed.visual.canvas.width * 0.7);
                tilemapHeight = Math.round(Rsed.visual.canvas.height * 0.7);
                tilemapOffsetX = Math.floor((Rsed.visual.canvas.width / 2) - (tilemapWidth / 2));
                tilemapOffsetY = Math.floor((Rsed.visual.canvas.height / 2) - (tilemapHeight / 2));
                tilemap = new Array(project.varimaa.width * project.varimaa.height);

                knownCanvasSizeX = Rsed.visual.canvas.width;
                knownCanvasSizeY = Rsed.visual.canvas.height;
            }

            const maxX = ((width == -1)? project.varimaa.width : Math.min(project.varimaa.width, (width + startX)));
            const maxY = ((height == -1)? project.varimaa.height : Math.min(project.varimaa.height, (height + startY)));

            // Refresh the tilemap texture.
            for (let y = startY; y < maxY; y++)
            {
                for (let x = startX; x < maxX; x++)
                {
                    const pala = project.palat.texture[project.varimaa.tile_at(x, y)];

                    let colorIdx = ((pala == null)? 0 : pala.indices[1]);

                    if ((x == checkpoint.x) &&
                        (y == checkpoint.y))
                    {
                        colorIdx = "white";
                    }

                    const color = Rsed.visual.palette.color_at_idx(colorIdx);

                    tilemap[(x + y * project.varimaa.width) * 4 + 0] = color.red;
                    tilemap[(x + y * project.varimaa.width) * 4 + 1] = color.green;
                    tilemap[(x + y * project.varimaa.width) * 4 + 2] = color.blue;
                    tilemap[(x + y * project.varimaa.width) * 4 + 3] = 255;
                }
            }

            // The tilemap n-gon is a rectangle drawn with the tilemap texture.
            const tilemapNgon = Rngon.ngon([Rngon.vertex(tilemapOffsetX, tilemapOffsetY),
                                            Rngon.vertex((tilemapOffsetX + tilemapWidth), tilemapOffsetY),
                                            Rngon.vertex((tilemapOffsetX + tilemapWidth), (tilemapOffsetY + tilemapHeight)),
                                            Rngon.vertex(tilemapOffsetX, (tilemapOffsetY + tilemapHeight))],
                                            {
                                                color: Rngon.color_rgba(255, 255, 255),
                                                allowTransform: false, // The vertices are already in screen space.
                                                texture: Rngon.texture_rgba({
                                                    width: project.varimaa.width,
                                                    height: project.varimaa.height,
                                                    pixels: tilemap,
                                                }),
                                                hasWireframe: true,
                                                wireframeColor: Rngon.color_rgba(255, 255, 0),
                                            });

            tilemapMesh = Rngon.mesh([tilemapNgon]);

            return;
        },

        on_key_fire: function(key, repeat = false)
        {
            function key_is(compared)
            {
                return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
            }

            if (key_is("z"))
            {
                if (Rsed.ui.inputState.key_down("control") &&
                    Rsed.ui.inputState.key_down("shift"))
                {
                    Rsed.ui.undoStack.redo();
                    scene.refresh_tilemap_view();
                }
                else if (Rsed.ui.inputState.key_down("control"))
                {
                    Rsed.ui.undoStack.undo();
                    scene.refresh_tilemap_view();
                }
            }
            else if (key_is("y") &&
                     Rsed.ui.inputState.key_down("control") )
            {
                Rsed.ui.undoStack.redo();
            }
            else if (key_is("q"))
            {
                Rsed.core.set_scene("3d");
            }
            else if (key_is("a") && !repeat)
            {
                sceneSettings.showPalatPane = !sceneSettings.showPalatPane;

                // Prevent a mouse click from acting on the ground behind the pane when the pane
                // is brought up, and on the pane when the pane has been removed.
                updateMouseHoverOnFrameFinish = true;
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
            Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);

            if (uiComponents) // Once the UI components have finished async loading...
            {
                uiComponents.viewLabel.update(`Tilemap`);
                uiComponents.viewLabel.draw(3, 11);

                uiComponents.activePala.update(sceneSettings);
                uiComponents.activePala.draw((Rsed.visual.canvas.width - 20), 11);

                uiComponents.footer.update(`Size: ${Rsed.core.current_project().maasto.width} * ${Rsed.core.current_project().maasto.width}`);
                uiComponents.footer.draw(3, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 5));

                if (sceneSettings.showPalatPane)
                {
                    uiComponents.palatPane.update(sceneSettings);
                    uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 31);
                }

                if (Rsed.core.fps_counter_enabled())
                {
                    uiComponents.fpsIndicator.update(sceneSettings);
                    uiComponents.fpsIndicator.draw(3, 10);
                }
            }

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
           if ((Rsed.visual.canvas.width != knownCanvasSizeX ||
                Rsed.visual.canvas.height != knownCanvasSizeY))
           {
               this.refresh_tilemap_view();
           }

           const renderInfo = Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), [tilemapMesh],
           {
               scale: Rsed.visual.canvas.scalingFactor,
               fov: 45,
               nearPlane: 0,
               farPlane: 10,
               depthSort: "painter",
               useDepthBuffer: false,
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

    function update_cursor_graphic()
    {
        const cursors = Rsed.ui.cursorHandler.cursors;
        const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();
        const mouseTilemapPosX = Math.round((mousePos.x - tilemapOffsetX) * (Rsed.core.current_project().maasto.width / tilemapWidth));
        const mouseTilemapPosY = Math.round((mousePos.y - tilemapOffsetY) * (Rsed.core.current_project().maasto.height / tilemapHeight));

        const isCursorOnTilemap = ((mouseTilemapPosX >= 0) &&
                                   (mouseTilemapPosY >= 0) &&
                                   (mouseTilemapPosX < Rsed.core.current_project().maasto.width) &&
                                   (mouseTilemapPosY < Rsed.core.current_project().maasto.height));

        if (isCursorOnTilemap)
        {
            Rsed.ui.cursorHandler.set_cursor(cursors.pencil);
        }
        else
        {
            Rsed.ui.cursorHandler.set_cursor(cursors.default);
        }
        
        return;
    }

    function handle_mouse_input()
    {
        const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();

        // Handle painting the tilemap.
        if (Rsed.ui.inputState.mouse_button_down())
        {
            const mouseTilemapPosX = Math.round((mousePos.x - tilemapOffsetX) * (Rsed.core.current_project().maasto.width / tilemapWidth));
            const mouseTilemapPosY = Math.round((mousePos.y - tilemapOffsetY) * (Rsed.core.current_project().maasto.height / tilemapHeight));
            const brushSize = (Rsed.ui.groundBrush.brush_size() + 1);

            Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
                                                       Rsed.ui.groundBrush.brush_pala_idx(),
                                                       mouseTilemapPosX,
                                                       mouseTilemapPosY);

            // Update the region of the tilemap that we painted over.
            scene.refresh_tilemap_view((mouseTilemapPosX - brushSize),
                                       (mouseTilemapPosY - brushSize),
                                       (brushSize * 2),
                                       (brushSize * 2));
        }
        
        return;
    }
})();
