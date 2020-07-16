/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays the current renderer frame rate (FPS).
 * 
 */

"use strict";

export const component = Rsed.ui.component();

component.draw = function(offsetX = 0, offsetY = 0)
{
    Rsed.throw_if_not_type("number", offsetX, offsetY);

    Rsed.ui.draw.string(`FPS: ${Rsed.core.renderer_fps()}`, offsetX, offsetY);
};
