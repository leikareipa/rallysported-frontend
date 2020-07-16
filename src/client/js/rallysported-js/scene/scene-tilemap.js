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
            activePala: (await import("./ui-components/active-pala.js")).component,
            palatPane:  (await import("./ui-components/palat-pane.js")).component,
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
        
        draw_ui: function()
        {
            Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);

            if (uiComponents) // Once the UI components have finished async loading...
            {
                uiComponents.activePala.update(sceneSettings);
                uiComponents.activePala.draw((Rsed.visual.canvas.width - 20), 4);

                if (sceneSettings.showPalatPane)
                {
                    uiComponents.palatPane.update(sceneSettings);
                    uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 24);
                }
            }

            Rsed.ui.draw.string("TRACK SIZE:" + Rsed.core.current_project().maasto.width + "," + Rsed.core.current_project().maasto.width,
                                ((Rsed.visual.canvas.width / 2) - (tilemapWidth / 2)),
                                ((Rsed.visual.canvas.height / 2) - (tilemapHeight / 2)) - Rsed.ui.font.font_height());

            if (Rsed.core.fps_counter_enabled()) Rsed.ui.draw.fps();
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
            handle_keyboard_input();
            handle_mouse_input();
        },
    });

    return scene;

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
        const mouseHover = Rsed.ui.inputState.current_mouse_hover();
        const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();

        // Handle clicks over the PALAT pane.
        if ( mouseHover &&
            (mouseHover.type == "ui-element") &&
            (mouseHover.uiElementId == "palat-pane") &&
            Rsed.ui.inputState.left_or_right_mouse_button_down())
        {
            Rsed.ui.groundBrush.set_brush_pala_idx(mouseHover.palaIdx);

            return;
        }

        // Handle painting the tilemap.
        if (Rsed.ui.inputState.mid_mouse_button_down())
        {
            const mousePosX = Math.round((mousePos.x - tilemapOffsetX) * (Rsed.core.current_project().maasto.width / tilemapWidth));
            const mousePosY = Math.round((mousePos.y - tilemapOffsetY) * (Rsed.core.current_project().maasto.height / tilemapHeight));
            const brushSize = (Rsed.ui.groundBrush.brush_size() + 1);

            Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
                                                       Rsed.ui.groundBrush.brush_pala_idx(),
                                                       mousePosX, mousePosY);

            // Update the region of the tilemap that we painted over.
            scene.refresh_tilemap_view((mousePosX - brushSize),
                                       (mousePosY - brushSize),
                                       (brushSize * 2),
                                       (brushSize * 2));
        }
        
        return;
    }
})();
