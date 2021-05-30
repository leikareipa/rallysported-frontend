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

        let camera = undefined;

        component.update = function(options = {})
        {
            Rsed.throw_if_not_type("object", options, options.camera);

            camera = options.camera;

            const grab = component.is_grabbed();

            if (grab)
            {
                const x = Math.round((grab.tileX - (camera.viewportWidth / 2)) + 1);
                const z = Math.round((grab.tileZ - (camera.viewportHeight / 2)) + 1);
                const y = camera.position().y;

                camera.move_to(x, y, z)
            }
        };

        component.draw = function(offsetX = 0, offsetY = 0)
        {
            Rsed.throw_if_not_type("number", offsetX, offsetY);
            Rsed.throw_if_undefined(camera);

            // Generate the minimap image by iterating over the tilemap and grabbing a pixel off each
            // corresponding PALA texture.
            /// TODO: You can pre-generate the image rather than re-generating it each frame.
            const width = 64;
            const height = 32;
            const xMul = (Rsed.$currentProject.maasto.width / width);
            const yMul = (Rsed.$currentProject.maasto.width / height);
            const image = []; // An array of palette indices that forms the minimap image.
            const mousePick = [];

            for (let y = 0; y < height; y++)
            {
                for (let x = 0; x < width; x++)
                {
                    const tileX = (x * xMul);
                    const tileZ = (y * yMul);

                    const tile = Rsed.$currentProject.varimaa.tile_at(tileX, tileZ);
                    const pala = Rsed.$currentProject.palat.texture[tile];
                    let color = ((pala == null)? 0 : pala.indices[1]);

                    image.push(color);

                    mousePick.push({
                        type: "ui-component",
                        componentId: component.id,
                        cursor: Rsed.ui.cursorHandler.cursors.fingerHand,
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
                const frameWidth = Math.round((camera.viewportWidth / xMul));
                const frameHeight = Math.round((camera.viewportHeight / yMul));
                
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

                const cameraPos = camera.position_floored();
                const maxX = (Rsed.$currentProject.maasto.width - camera.viewportWidth);
                const maxZ = (Rsed.$currentProject.maasto.height - camera.viewportHeight);
                const camX = Math.max(0, (Math.min(maxX, cameraPos.x) / xMul));
                const camZ = Math.max(0, (Math.min(maxZ, cameraPos.z) / yMul));
                Rsed.ui.draw.image(frame, null, frameWidth, frameHeight, (offsetX - width + camX), (offsetY + camZ), true);
            }

            return;
        }

        return component;
    }
}
