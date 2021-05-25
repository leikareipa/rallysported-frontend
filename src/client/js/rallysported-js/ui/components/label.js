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
    instance: function(options = {})
    {
        options = {
            // Default options.
            ...{
                // A function called when the label is clicked on, or
                // undefined to disable the on-click event handler.
                onClick: undefined,
            },
            ...options,
        };

        let labelString = "Hello";

        const component = Rsed.ui.component();

        component.draw = function(screenX = 0, screenY = 0)
        {
            Rsed.throw_if_not_type("number", screenX, screenY);

            const mousePick = {
                type: "ui-component",
                componentId: component.id,
            };

            Rsed.ui.draw.string(labelString, screenX, screenY, (options.onClick? mousePick : undefined));
        };

        component.update = function(string)
        {
            Rsed.throw_if_not_type("string", string);

            labelString = string;

            const grab = component.is_grabbed();

            if (grab && (typeof options.onClick === "function"))
            {
                options.onClick();
            }
        }

        return component;
    }
}
