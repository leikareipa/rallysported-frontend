/*
 * Most recent known filename: js/scenes.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// The different scenes through which the current project can be edited.
Rsed.scenes = 
{
    // The main scene. Displays the project as a textured 3d mesh; and allows the
    // user to edit the heightmap and tilemap via mouse interaction.
    "3d":
    Rsed.scene({
        draw_ui: function(canvas)
        {
            Rsed.ui.draw.begin_drawing(canvas);

            Rsed.ui.draw.watermark();
            Rsed.ui.draw.minimap();
            Rsed.ui.draw.active_pala();
            Rsed.ui.draw.footer_info();
            if (Rsed.ui_view_n.showPalatPane) Rsed.ui.draw.palat_pane();
            if (Rsed.core.fps_counter_enabled()) Rsed.ui.draw.fps();
            Rsed.ui.draw.mouse_cursor();

            Rsed.ui.draw.finish_drawing(canvas);

            return;
        },

        draw_mesh: function(canvas)
        {
            const trackMesh = Rsed.world.mesh_builder.track_mesh({x: Math.floor(Rsed.world.camera.pos_x()),
                                                                  y: 0,
                                                                  z: Math.floor(Rsed.world.camera.pos_z())});

            const renderInfo = Rngon.render(canvas.domElement.getAttribute("id"), [trackMesh],
            {
                cameraPosition: Rngon.translation_vector(0, 0, 0),
                cameraDirection: Rngon.rotation_vector(21, 0, 0),
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

                // The PALAT pane needs to adjust to the new size of the canvas.
                Rsed.ui.draw.generate_palat_pane();
            }

            return;
        },
    }),

    // Presents a top-down view of the project's tilemap. The user can edit the tilemap
    // via mouse interaction.
    "tilemap":
    Rsed.scene({
        draw_ui: function(canvas)
        {
            Rsed.ui.draw.begin_drawing(canvas);

            // Draw a large minimap of the track in the middle of the screen.
            const width = Math.floor(Rsed.core.render_width() * 0.81);
            const height = Math.floor(Rsed.core.render_height() * 0.72);
            {
                const xMul = (Rsed.core.current_project().maasto.width / width);
                const zMul = (Rsed.core.current_project().maasto.width / height);
                const image = [];   // An array of palette indices that forms the minimap image.
                const mousePick = [];

                for (let z = 0; z < height; z++)
                {
                    for (let x = 0; x < width; x++)
                    {
                        const tileX = Math.floor(x * xMul);
                        const tileZ = Math.floor(z * zMul);

                        const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
                        let color = ((pala == null)? 0 : pala.indices[1]);

                        // Create an outline.
                        if (z % (height - 1) === 0) color = "gray";
                        if (x % (width - 1) === 0) color = "gray";

                        image.push(color);
                        mousePick.push(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                            {elementId:Rsed.ui_input_n.uiElement.large_minimap,
                            uiX:tileX, uiY:tileZ}));
                    }
                }

                Rsed.ui.draw.image(image, mousePick, width, height, ((canvas.width / 2) - (width / 2)), ((canvas.height / 2) - (height / 2)), false);
            }

            Rsed.ui.draw.string("TRACK SIZE:" + Rsed.core.current_project().maasto.width + "," + Rsed.core.current_project().maasto.width,
                                ((canvas.width / 2) - (width / 2)),
                                ((canvas.height / 2) - (height / 2)) - Rsed.ui.font.font_height());

            Rsed.ui.draw.watermark();
            Rsed.ui.draw.active_pala();
            if (Rsed.ui_view_n.showPalatPane) Rsed.ui.draw.palat_pane();
            if (Rsed.core.fps_counter_enabled()) Rsed.ui.draw.fps();
            Rsed.ui.draw.mouse_cursor();

            Rsed.ui.draw.finish_drawing(canvas);

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

                // The PALAT pane needs to adjust to the new size of the canvas.
                Rsed.ui.draw.generate_palat_pane();
            }
            
            return;
        },
    }),
};
