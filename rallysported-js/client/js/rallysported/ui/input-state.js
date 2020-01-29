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

    const mouseState =
    {
        // Which of the mouse buttons are currently down.
        buttons:
        {
            left: false,
            mid: false,
            right: false,
        },

        // Wheel scroll.
        wheel: 0,

        // Where inside the RallySportED canvas the mouse cursor is currently located.
        position:
        {
            x: 0,
            y: 0,
        },

        // Which mouse-picking buffer element the cursor is currently hovering over.
        hover: null,

        // Which mouse-picking buffer element the cursor most recently clicked on.
        // When the button is clicked, the grab is put into effect; and when the
        // button is released, the grab is released also.
        grab: null,
    };

    const publicInterface =
    {
        mouse_pos: function()
        {
            return {...mouseState.position};
        },

        mouse_pos_scaled_to_render_resolution: function()
        {
            // Note: We guard against Rsed.visual.canvas being undefined, which
            // it may be when running unit tests.
            const scaledX = Math.floor(mouseState.position.x * (Rsed.visual.canvas? Rsed.visual.canvas.scalingFactor : 1));
            const scaledY = Math.floor(mouseState.position.y * (Rsed.visual.canvas? Rsed.visual.canvas.scalingFactor : 1));

            const clampedX = Math.max(0, Math.min(((Rsed.visual.canvas? Rsed.visual.canvas.width : 1) - 1), scaledX));
            const clampedY = Math.max(0, Math.min(((Rsed.visual.canvas? Rsed.visual.canvas.height : 1) - 1), scaledY));

            return {...mouseState.position, x:clampedX, y:clampedY};
        },

        mouse_button_down: function()
        {
            return (this.left_mouse_button_down() |
                    this.mid_mouse_button_down() |
                    this.right_mouse_button_down());
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

        left_or_right_mouse_button_down: function()
        {
            return (mouseState.buttons.left || mouseState.buttons.right);
        },

        key_down: function(key)
        {
            Rsed.throw_if_not_type("string", key);

            return Boolean(keyboardState[key.toUpperCase()]);
        },

        current_mouse_hover: function()
        {
            return mouseState.hover;
        },

        current_mouse_grab: function()
        {
            return mouseState.grab;
        },

        // Force the current mouse hover information to update.
        update_mouse_hover: function()
        {
            this.set_mouse_pos(this.mouse_pos().x, this.mouse_pos().y);

            return;
        },

        reset_mouse_hover: function()
        {
            mouseState.hover = null;
            mouseState.grab = null;

            return;
        },

        reset_mouse_buttons_state: function()
        {
            mouseState.buttons.left = false;
            mouseState.buttons.mid = false;
            mouseState.buttons.right = false;

            return;
        },

        reset_modifier_keys_state: function()
        {
            this.set_key_down("shift", false);
            this.set_key_down("control", false);
            this.set_key_down("alt", false);
            this.set_key_down("altgraph", false);
            this.set_key_down("tab", false);

            return;
        },

        reset_keys: function()
        {
            keyboardState.fill(false);

            return;
        },

        reset_wheel_scroll: function()
        {
            mouseState.wheel = 0;

            return;
        },

        mouse_wheel_scroll: function()
        {
            return mouseState.wheel;
        },

        append_wheel_scroll: function(delta)
        {
            Rsed.throw_if_not_type("number", delta);

            // Note: For now, we require that the Shift key be pressed down for mouse
            // scroll to be registered. This is done so that the scroll wheel can be
            // used normally to scroll the contents of the viewport when the Shift is
            // not pressed, and when it is, the viewport is assumed to not scroll and
            // so we can instead act on the scroll in RallySportED.
            if (this.key_down("shift"))
            {
                mouseState.wheel += delta;
            }

            return;
        },
        
        set_key_down: function(keyCode, isDown = false)
        {
            Rsed.throw_if_not_type("boolean", isDown);

            const keyIdx = (()=>
            {
                switch (typeof keyCode)
                {
                    case "string": return keyCode.toUpperCase();
                    case "number": return String.fromCharCode(keyCode).toUpperCase();
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

            // Update the hover info.
            // Note: We guard against Rsed.visual.canvas being undefined, which
            // it may be when running unit tests.
            const mousePos = this.mouse_pos_scaled_to_render_resolution();
            mouseState.hover = (Rsed.visual.canvas? Rsed.visual.canvas.mousePickingBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width] : null);

            return;
        },

        set_mouse_button_down: function(state = {})
        {
            Rsed.throw_if_not_type("object", state);

            mouseState.buttons = {...mouseState.buttons, ...state};

            if (!this.mouse_button_down())
            {
                mouseState.grab = null;
            }
            else if (!mouseState.grab)
            {
                mouseState.grab = mouseState.hover;
            }

            return;
        },
    };

    return publicInterface;
})();
