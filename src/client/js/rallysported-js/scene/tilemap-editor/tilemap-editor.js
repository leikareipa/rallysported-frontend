/*
 * Most recent known filename: js/scene/tilemap-editor/tilemap-editor.js
 *
 * 2019-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

// A top-down view of the project's VARIMAA data as a tilemap. Lets the user paint
// onto the tilemap.
Rsed.scenes["tilemap-editor"] = (function()
{
    // A representation of the track's VARIMAA data.
    const tilemap = {
        texture: {
            pixels: [],
            width: 0,
            height: 0,
        },
        mesh: Rngon.mesh([]),
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0,
    };

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
            footer:       Rsed.ui.component.label.instance(),
        };
    })();
    
    const scene = Rsed.scene(
    {
        // Updates the tilemap's texture within the given dirty rectangle.
        refresh_tilemap_texture: function(startX = 0, startY = 0, width = -1, height = -1)
        {
            const project = Rsed.$currentProject;
            
            const maxX = ((width == -1)? tilemap.texture.width : Math.min(tilemap.texture.width, (width + startX)));
            const maxY = ((height == -1)? tilemap.texture.height : Math.min(tilemap.texture.height, (height + startY)));

            for (let y = startY; y < maxY; y++)
            {
                for (let x = startX; x < maxX; x++)
                {
                    const pala = project.palat.texture[project.varimaa.tile_at(x, y)];

                    let colorIdx = ((pala == null)? 0 : pala.indices[1]);

                    if ((x == project.track_checkpoint().x) &&
                        (y == project.track_checkpoint().y))
                    {
                        colorIdx = "white";
                    }

                    const color = Rsed.visual.palette.color_at_idx(colorIdx);

                    tilemap.texture.pixels[(x + y * tilemap.texture.width) * 4 + 0] = color.red;
                    tilemap.texture.pixels[(x + y * tilemap.texture.width) * 4 + 1] = color.green;
                    tilemap.texture.pixels[(x + y * tilemap.texture.width) * 4 + 2] = color.blue;
                    tilemap.texture.pixels[(x + y * tilemap.texture.width) * 4 + 3] = 255;
                }
            }

            // The tilemap n-gon is a rectangle textured with the tilemap's pixels.
            const tilemapNgon = Rngon.ngon([
                Rngon.vertex( tilemap.offsetX,                   tilemap.offsetY),
                Rngon.vertex((tilemap.offsetX + tilemap.width),  tilemap.offsetY),
                Rngon.vertex((tilemap.offsetX + tilemap.width), (tilemap.offsetY + tilemap.height)),
                Rngon.vertex( tilemap.offsetX,                  (tilemap.offsetY + tilemap.height))],
                {
                    color: Rngon.color_rgba(255, 255, 255),
                    allowTransform: false, // The vertices are already in screen space.
                    texture: Rngon.texture_rgba(tilemap.texture),
                    hasWireframe: true,
                    wireframeColor: Rngon.color_rgba(255, 255, 0),
                }
            );

            tilemap.mesh = Rngon.mesh([tilemapNgon]);

            return;
        },

        regenerate_tilemap: function()
        {
            const project = Rsed.$currentProject;

            tilemap.texture.width = project.varimaa.width;
            tilemap.texture.height = project.varimaa.height;
            tilemap.texture.pixels = new Array(tilemap.texture.width * tilemap.texture.height * 4);

            tilemap.width = Math.round(Rsed.visual.canvas.width * 0.7);
            tilemap.height = Math.round(Rsed.visual.canvas.height * 0.7);
            tilemap.offsetX = Math.floor((Rsed.visual.canvas.width / 2) - (tilemap.width / 2));
            tilemap.offsetY = Math.floor((Rsed.visual.canvas.height / 2) - (tilemap.height / 2));

            knownCanvasSizeX = Rsed.visual.canvas.width;
            knownCanvasSizeY = Rsed.visual.canvas.height;

            scene.refresh_tilemap_texture();

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
                    scene.regenerate_tilemap();
                }
                else if (Rsed.ui.inputState.key_down("control"))
                {
                    Rsed.ui.undoStack.undo();
                    scene.regenerate_tilemap();
                }
            }
            else if (key_is("y") && Rsed.ui.inputState.key_down("control") )
            {
                Rsed.ui.undoStack.redo();
            }
            else if (key_is("q"))
            {
                Rsed.$currentScene = "terrain-editor";
            }
            else if (key_is("a") && !repeat)
            {
                sceneSettings.showPalatPane = !sceneSettings.showPalatPane;

                // Prevent a mouse click from acting on the ground behind the pane when the pane
                // is brought up, and on the pane when the pane has been removed.
                Rsed.core.forceUpdateMouseHoverOnTickEnd = true;
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
                const margin = 4;

                uiComponents.viewLabel.update("Editor: Tilemap");
                uiComponents.viewLabel.draw(margin, margin);

                uiComponents.activePala.update(sceneSettings);
                uiComponents.activePala.draw((Rsed.visual.canvas.width - 20), margin);

                uiComponents.footer.update(`Size: ${Rsed.$currentProject.maasto.width} * ${Rsed.$currentProject.maasto.width}`);
                uiComponents.footer.draw(margin, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 5));

                if (sceneSettings.showPalatPane)
                {
                    uiComponents.palatPane.update(sceneSettings);
                    uiComponents.palatPane.draw((Rsed.visual.canvas.width - margin), 27);
                }

                if (Rsed.browserMetadata.has_url_param("showFPS"))
                {
                    uiComponents.fpsIndicator.update(sceneSettings);
                    uiComponents.fpsIndicator.draw(margin, 11);
                }
            }

            Rsed.ui.draw.finish_drawing(Rsed.visual.canvas);

            return;
        },

        draw_mesh: function()
        {
           if ((Rsed.visual.canvas.width != knownCanvasSizeX) ||
               (Rsed.visual.canvas.height != knownCanvasSizeY) ||
               (Rsed.$currentProject.varimaa.width != tilemap.texture.width) ||
               (Rsed.$currentProject.varimaa.height != tilemap.texture.height))
           {
               scene.regenerate_tilemap();
           }

           const renderInfo = Rngon.render(Rsed.visual.canvas.domElement,
                                           [tilemap.mesh], {
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
        const mouseTilemapPosX = Math.round((mousePos.x - tilemap.offsetX) * (Rsed.$currentProject.maasto.width / tilemap.width));
        const mouseTilemapPosY = Math.round((mousePos.y - tilemap.offsetY) * (Rsed.$currentProject.maasto.height / tilemap.height));
        const mouseHover = Rsed.ui.inputState.current_mouse_hover();
            
        

        const isCursorOnTilemap = ((mouseTilemapPosX >= 0) &&
                                   (mouseTilemapPosY >= 0) &&
                                   (mouseTilemapPosX < Rsed.$currentProject.maasto.width) &&
                                   (mouseTilemapPosY < Rsed.$currentProject.maasto.height));

        if (mouseHover && mouseHover.cursor)
        {
            Rsed.ui.cursorHandler.set_cursor(mouseHover.cursor);
        }
        else if (isCursorOnTilemap)
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
            const mouseTilemapPosX = Math.round((mousePos.x - tilemap.offsetX) * (Rsed.$currentProject.maasto.width / tilemap.width));
            const mouseTilemapPosY = Math.round((mousePos.y - tilemap.offsetY) * (Rsed.$currentProject.maasto.height / tilemap.height));
            const brushSize = (Rsed.ui.groundBrush.brush_size() + 1);

            Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
                                                       Rsed.ui.groundBrush.brush_pala_idx(),
                                                       mouseTilemapPosX,
                                                       mouseTilemapPosY);

            scene.refresh_tilemap_texture((mouseTilemapPosX - brushSize),
                                  (mouseTilemapPosY - brushSize),
                                  (brushSize * 2),
                                  (brushSize * 2));
        }
        
        return;
    }
})();
