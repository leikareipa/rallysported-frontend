/*
 * Most recent known filename: js/ui/input-state.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Stores and provides information about the current state of user input (keyboard and
// mouse interaction).
Rsed.ui.inputState = (function()
{
    // For each key code, a boolean to indicate whether that key is current down. Note
    // that the key codes are stored as lowercase characters, so e.g. 69 is stored as "e".
    const keyboardState = [];

    // Booleans to indicate which mouse buttons are currently down; and values giving
    // the mouse cursor's position relative to the RallySportED canvas.
    const mouseState =
    {
        buttons:
        {
            left: false,
            mid: false,
            right: false,
        },
        position:
        {
            x: 0,
            y: 0,
        },
    };

    const publicInterface =
    {
        mouse_pos: function()
        {
            return {...mouseState.position};
        },

        mouse_pos_scaled_to_render_resolution: function()
        {
            const scaledX = Math.floor(mouseState.position.x * Rsed.core.scaling_multiplier());
            const scaledY = Math.floor(mouseState.position.y * Rsed.core.scaling_multiplier());

            const clampedX = Math.max(0, Math.min((Rsed.core.render_width() - 1), scaledX));
            const clampedY = Math.max(0, Math.min((Rsed.core.render_height() - 1), scaledY));

            return {clampedX, clampedY};
        },

        mouse_button_down: function()
        {
            return (mouseState.buttons.left |
                    mouseState.buttons.mid  |
                    mouseState.buttons.right);
        },

        left_mouse_button_down: function()
        {
            return mouseState.buttons.left;
        },

        mid_mouse_button_down: function()
        {
            return mouseState.buttons.mid;
        },

        right_mouse_button_down: function()
        {
            return mouseState.buttons.right;
        },

        key_down: function(key)
        {
            return keyboardState[key];
        },
        
        set_key_down: function(keyCode, isDown = false)
        {
            Rsed.throw_if_not_type("boolean", isDown);

            const keyIdx = (()=>
            {
                switch (typeof keyCode)
                {
                    case "string": return keyCode;
                    case "number": return String.fromCharCode(keyCode).toLowerCase();
                    default: Rsed.throw("Unknown variable type for key code."); return "unknown";
                }
            })();

            keyboardState[keyIdx] = isDown;

            return;
        },

        set_mouse_pos: function(x = 0, y = 0)
        {
            Rsed.throw_if_not_type("number", x, y);

            mouseState.position.x = x;
            mouseState.position.y = y;

            return;
        },

        set_mouse_button_down: function(state = {})
        {
            Rsed.throw_if_not_type("object", state);

            mouseState.buttons = {...mouseState.buttons, ...state};

            return;
        },
    };

    return publicInterface;
})();
