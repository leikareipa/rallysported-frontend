/*
 * Most recent known filename: js/ui/cursor.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.cursor = (function()
{
    const cursors = {
        arrow: "./client/assets/cursors/rsed-cursor-arrow.png",
        openHand: "./client/assets/cursors/rsed-cursor-openhand.png",
    };

    cursors.default = cursors.arrow;

    let currentCursor = cursors.default;

    const publicInterface = {
        // Inspect the app's current state (e.g. of user input), and select
        // the most appropriate cursor.
        update_cursor: function()
        {
            const cursor = (()=>
            {
                const mouseHover = Rsed.ui.inputState.current_mouse_hover();
                const mouseGrab = Rsed.ui.inputState.current_mouse_grab();

                if (mouseHover && mouseHover.type == "prop")
                {
                    return cursors.openHand;
                }

                return cursors.default;
            })();

            set_cursor(cursor);
            
            return;
        },
    };

    return publicInterface;

    function set_cursor(cursor = cursors.default)
    {
        if (!cursor)
        {
            cursor = cursors.default;
        }

        if (currentCursor == cursor)
        {
            return;
        }

        document.body.style.cursor = `url(${cursor}), auto`;
        currentCursor = cursor;

        return;
    }
})();
