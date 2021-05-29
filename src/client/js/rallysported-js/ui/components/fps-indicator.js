/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A UI component that displays the current renderer frame rate (FPS).
Rsed.ui.component.fpsIndicator =
{
    instance: function()
    {
        const component = Rsed.ui.component();

        component.draw = function(offsetX = 0, offsetY = 0)
        {
            Rsed.throw_if_not_type("number", offsetX, offsetY);

            Rsed.ui.draw.string(`FPS: ${Rsed.core.ticksPerSecond}`, offsetX, offsetY);
        };

        return component;
    }
}
