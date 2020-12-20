/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays a string.
 * 
 */

"use strict";

Rsed.ui.component.label =
{
    instance: function()
    {
        const component = Rsed.ui.component();

        let labelString = "Hello";

        component.draw = function(screenX = 0, screenY = 0)
        {
            Rsed.throw_if_not_type("number", screenX, screenY);

            Rsed.ui.draw.string(labelString, screenX, screenY);
        };

        component.update = function(string)
        {
            Rsed.throw_if_not_type("string", string);

            labelString = string;
        }

        return component;
    }
}
