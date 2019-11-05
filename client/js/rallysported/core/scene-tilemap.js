/*
 * Most recent known filename: js/core/scene-tilemap.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.scenes = Rsed.scenes || {};

// A top-down view of the project's tilemap. The user can edit the tilemap via mouse
// interaction.
Rsed.scenes["tilemap"] = Rsed.scene(
{
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

                    mousePick.push(Rsed.ui.mouse_picking_element("ui-element",
                    {
                        uiElementId: "tilemap",
                        x: tileX,
                        y: tileZ,
                    }));
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

    handle_user_interaction: function()
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
                Rsed.ui_view_n.showPalatPane = !Rsed.ui_view_n.showPalatPane;
                Rsed.ui.inputState.set_key_down("a", false);
            }

            for (const brushSizeKey of ["1", "2", "3", "4", "5"])
            {
                if (Rsed.ui.inputState.key_down(brushSizeKey))
                {
                    Rsed.ui_brush_n.set_brush_size((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
                    Rsed.ui.inputState.set_key_down(brushSizeKey, false);
                }
            }
        }

        // Handle mouse input.
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
                                Rsed.ui_brush_n.apply_brush_to_terrain(Rsed.ui_brush_n.brushAction.changePala,
                                                                        Rsed.ui_brush_n.brush_pala_idx(),
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
                                Rsed.ui_brush_n.set_brush_pala_idx(hover.palaIdx);
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
    },
});
