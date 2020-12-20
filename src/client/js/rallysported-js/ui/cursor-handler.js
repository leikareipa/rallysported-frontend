/*
 * Most recent known filename: js/ui/cursor-handler.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.cursorHandler = (function()
{
    let currentCursor = undefined;

    const cursors = {
        arrow: "./client/assets/cursors/rsed-cursor-arrow.png",
        openHand: "./client/assets/cursors/rsed-cursor-openhand.png",
        openHand2: "./client/assets/cursors/rsed-cursor-openhand2.png",
        fingerHand: "./client/assets/cursors/rsed-cursor-fingerhand.png",
        closedHand: "./client/assets/cursors/rsed-cursor-closedhand.png",
        groundSmoothing: "./client/assets/cursors/rsed-cursor-arrowsmooth.png",
        blocked: "./client/assets/cursors/rsed-cursor-blocked.png",
        eyedropper: "./client/assets/cursors/rsed-cursor-eyedropper.png",
        default: undefined,
    };

    cursors.default = cursors.arrow;

    // Pre-load the cursor images' data so they'll be immediately available for display
    // when required.
    const cursorImages = Object.keys(cursors).map(c=>{
        const image = new Image();
        image.src = cursors[c];
        return image;
    });

    const publicInterface = {
        cursors: Object.freeze(cursors),

        set_cursor: function(cursor = cursors.default)
        {
            cursor = (cursor || cursors.default);

            if (currentCursor === cursor)
            {
                return;
            }

            /// TODO: Chrome 86 (haven't tested other versions) seems to have some
            /// trouble with setting the cursor in this way. Seems the image isn't
            /// cached (so a new network request is fired every time the cursor
            /// changes), and there may be some flickering when displaying it.
            document.body.style.cursor = `url(${cursor}), auto`;

            currentCursor = cursor;

            return;
        }
    };

    publicInterface.set_cursor(cursors.default);

    return publicInterface;
})();
