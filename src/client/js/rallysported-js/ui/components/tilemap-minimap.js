/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays a thumbnail of current project's tilemap. Clicking
// on the thumbnail centers the camera on that position.
Rsed.ui.component.tilemapMinimap =
{
    instance: function()
    {
        const component = Rsed.ui.component();

        component.update = function()
        {
            const grab = component.is_grabbed();

            if (grab)
            {
                const x = Math.round((grab.tileX - (Rsed.world.camera.view_width / 2)) + 1);
                const z = Math.round((grab.tileZ - (Rsed.world.camera.view_height / 2)) + 1);
                const y = Rsed.world.camera.position().y;

                Rsed.world.camera.set_camera_position(x, y, z)
            }
        };

        component.draw = function(offsetX = 0, offsetY = 0)
        {
            Rsed.throw_if_not_type("number", offsetX, offsetY);

            // Generate the minimap image by iterating over the tilemap and grabbing a pixel off each
            // corresponding PALA texture.
            /// TODO: You can pre-generate the image rather than re-generating it each frame.
            const width = 64;
            const height = 32;
            const xMul = (Rsed.core.current_project().maasto.width / width);
            const yMul = (Rsed.core.current_project().maasto.width / height);
            const image = []; // An array of palette indices that forms the minimap image.
            const mousePick = [];

            for (let y = 0; y < height; y++)
            {
                for (let x = 0; x < width; x++)
                {
                    const tileX = (x * xMul);
                    const tileZ = (y * yMul);

                    const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
                    let color = ((pala == null)? 0 : pala.indices[1]);

                    image.push(color);

                    mousePick.push({
                        type: "ui-component",
                        componentId: component.id,
                        tileX: tileX,
                        tileZ: tileZ
                    });
                }
            }

            Rsed.ui.draw.image(image, mousePick, width, height, (offsetX - width), offsetY, false);

            // Draw a frame around the camera view on the minimap.
            if (image && xMul && yMul)
            {
                const frame = [];
                const frameWidth = Math.round((Rsed.world.camera.view_width / xMul));
                const frameHeight = Math.round((Rsed.world.camera.view_height / yMul));
                
                for (let y = 0; y < frameHeight; y++)
                {
                    for (let x = 0; x < frameWidth; x++)
                    {
                        let color = 0;
                        if (y % (frameHeight - 1) === 0) color = "yellow";
                        if (x % (frameWidth - 1) === 0) color = "yellow";

                        frame.push(color);
                    }
                }

                const cameraPos = Rsed.world.camera.position_floored();
                const maxX = (Rsed.core.current_project().maasto.width - Rsed.world.camera.view_width);
                const maxZ = (Rsed.core.current_project().maasto.height - Rsed.world.camera.view_height);
                const camX = Math.max(0, (Math.min(maxX, cameraPos.x) / xMul));
                const camZ = Math.max(0, (Math.min(maxZ, cameraPos.z) / yMul));
                Rsed.ui.draw.image(frame, null, frameWidth, frameHeight, (offsetX - width + camX), (offsetY + camZ), true);
            }

            return;
        }

        return component;
    }
}
