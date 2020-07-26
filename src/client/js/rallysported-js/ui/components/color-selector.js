/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays a list of clickable color swatches that represents the
// current project's color palette, allowing the user to indicate which color he wants
// (e.g. to paint a texture with).
Rsed.ui.component.colorSelector =
{
    instance: function()
    {
        const component = Rsed.ui.component();

        const swatchSideLen = Rsed.ui.font.font_height();
        const swatch = new Array(swatchSideLen * swatchSideLen);
        const mousePick = new Array(swatch.length);

        // The currently-selected color - an index to the current Rsed.visual.palette
        // palette.
        let currentColorIdx = 19;

        component.update = function(sceneSettings = {})
        {
            Rsed.throw_if_not_type("object", sceneSettings);
            Rsed.throw_if_undefined(sceneSettings.selectedColorIdx);

            sceneSettings.selectedColorIdx = currentColorIdx;

            if (component.is_grabbed())
            {
                currentColorIdx = Rsed.ui.inputState.current_mouse_grab().colorIdx;
                Rsed.ui.inputState.reset_mouse_grab();
            }
        };

        component.draw = function(offsetX = 0, offsetY = 0)
        {
            Rsed.throw_if_not_type("number", offsetX, offsetY);

            const numSwatchesPerRow = 4;

            // Draw a grid of color swatches.
            for (let i = 0; i < Rsed.visual.palette.numColorsInPalette; i++)
            {
                const y = Math.floor(i / numSwatchesPerRow);
                const x = (i % numSwatchesPerRow);

                swatch.fill(Rsed.visual.palette.color_at_idx(i));

                mousePick.fill({
                    type: "ui-component",
                    componentId: component.id,
                    colorIdx: i,
                });

                Rsed.ui.draw.image(swatch, mousePick,
                                   swatchSideLen, swatchSideLen,
                                   (offsetX + (x * swatchSideLen)),
                                   (offsetY + (y * swatchSideLen)));
            }

            // Draw a frame around the currently-selected swatch.
            {
                const frame = [];
                const frameWidth = 9;
                const frameHeight = 9;
                
                for (let y = 0; y < frameHeight; y++)
                {
                    for (let x = 0; x < frameWidth; x++)
                    {
                        let color = 0;

                        if (y % (frameHeight - 1) === 0) color = (currentColorIdx || "black");
                        if (x % (frameWidth - 1) === 0) color = (currentColorIdx || "black");

                        frame.push(color);
                    }
                }

                const y = Math.floor(currentColorIdx / numSwatchesPerRow);
                const x = (currentColorIdx - y * numSwatchesPerRow);

                Rsed.ui.draw.image(frame, null,
                                   frameWidth, frameHeight,
                                   (offsetX + (x * swatchSideLen) - 1),
                                   (offsetY + (y * swatchSideLen) - 1),
                                   true);
            }
        };

        return component;
    }
}
