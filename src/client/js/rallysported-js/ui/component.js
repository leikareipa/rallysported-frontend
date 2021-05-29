/*
 * Most recent known filename: js/ui/component.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A base implementation of a UI component.
//
// To create a new component, call this function to receive a component base,
// then modify its draw() and update() functions according to your wishes.
Rsed.ui.component = function()
{
    const publicInterface =
    {
        // A string that uniquely identifies this component from other components.
        id: Object.freeze(Rsed.generate_uuid4()),

        // If the mouse cursor is currently grabbing this component, returns the grab
        // information; otherwise null is returned.
        is_grabbed: function()
        {
            const grab = Rsed.ui.inputState.current_mouse_grab();

            if (grab && (grab.componentId == this.id))
            {
                return grab;
            }
            else
            {
                return null;
            }
        },

        // If the mouse cursor is currently hovering over this component, returns the
        // hover information; otherwise null is returned.
        is_hovered: function()
        {
            const hover = Rsed.ui.inputState.current_mouse_hover();

            if (hover && (hover.componentId == this.id))
            {
                return hover;
            }
            else
            {
                return null;
            }
        },

        // Updates the component's internal state (e.g. to respond to user input).
        update: function(sceneSettings = {})
        {
            return;
        },

        // Renders the component to the currently-active canvas and at the given
        // XY canvas coordinates.
        draw: function(offsetX = 0, offsetY = 0)
        {
            return;
        },
    };

    return publicInterface;
}
