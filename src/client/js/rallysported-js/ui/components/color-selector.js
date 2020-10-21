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

        // A swatch of a particular color, clickable by the user to select that color.
        const swatchSideLen = 8;
        const swatch = new Array(swatchSideLen * swatchSideLen);
        const swatchMousePick = new Array(swatch.length);

        // A swatch indicating the currently-selecter color.
        const curColorSwatchSideLen = 32;
        const curColorSwatch = new Array(curColorSwatchSideLen * curColorSwatchSideLen);  

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

            const numSwatchesPerRow = 8;

            // Draw a grid of color swatches.
            for (let i = 0; i < Rsed.visual.palette.numColorsInPalette; i++)
            {
                const y = Math.floor(i / numSwatchesPerRow);
                const x = (i % numSwatchesPerRow);

                swatch.fill(Rsed.visual.palette.color_at_idx(i));

                swatchMousePick.fill({
                    type: "ui-component",
                    componentId: component.id,
                    colorIdx: i,
                });

                Rsed.ui.draw.image(swatch, swatchMousePick,
                                   swatchSideLen, swatchSideLen,
                                   (offsetX + (x * swatchSideLen)),
                                   (offsetY + (y * swatchSideLen)));
            }

            // Draw a frame around the currently-selected swatch.
            {
                const frame = [];
                const frameWidth = (swatchSideLen + 2);
                const frameHeight = (swatchSideLen + 2);
                
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

            // Draw a large swatch of the currently-selected color.
            {
                curColorSwatch.fill(Rsed.visual.palette.color_at_idx(currentColorIdx));

                Rsed.ui.draw.image(curColorSwatch, null,
                                   curColorSwatchSideLen, curColorSwatchSideLen,
                                   (offsetX + (numSwatchesPerRow * swatchSideLen) + 2),
                                   offsetY);
            }
        };

        return component;
    }
}
