/*
 * Most recent known filename: js/ui/cursor.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * The mouse cursor.
 * 
 */

"use strict";

const ui_cursor_n = (function()
{
    const cursorWidth = 16;
    const cursorHeight = 16;

    const X = 5;
    const Y = 6;
    const _ = 20;
    const graphic =
        [_,_,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        _,X,_,0,0,0,0,0,0,0,0,0,0,0,0,0,
        _,Y,X,_,0,0,0,0,0,0,0,0,0,0,0,0,
        _,Y,X,X,_,0,0,0,0,0,0,0,0,0,0,0,
        _,Y,Y,X,X,_,0,0,0,0,0,0,0,0,0,0,
        _,Y,Y,X,X,X,_,0,0,0,0,0,0,0,0,0,
        _,Y,Y,Y,X,X,X,_,0,0,0,0,0,0,0,0,
        _,Y,Y,Y,X,X,X,X,_,0,0,0,0,0,0,0,
        _,Y,Y,Y,Y,X,_,_,_,0,0,0,0,0,0,0,
        _,Y,_,_,Y,Y,_,0,0,0,0,0,0,0,0,0,
        _,_,0,0,_,Y,X,_,0,0,0,0,0,0,0,0,
        0,0,0,0,_,Y,Y,_,0,0,0,0,0,0,0,0,
        0,0,0,0,0,_,_,_,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    const publicInterface = {};
    {
        publicInterface.graphic = function()
        {
            return graphic.slice(0);
        }

        publicInterface.cursor_width = function() { return cursorWidth; }
        publicInterface.cursor_height = function() { return cursorHeight; }
    }
    return publicInterface;
})();
