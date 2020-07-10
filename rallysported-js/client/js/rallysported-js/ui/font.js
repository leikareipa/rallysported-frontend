/*
 * Most recent known filename: js/ui/font.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

Rsed.ui.font = (function()
{
    // The font's pixel size.
    const charWidth = 8;
    const charHeight = 8;

    // Shorthands for colors.
    const X = "lightgray";
    const Z = 1;
    const W = "white";
    const L = "blue";
    const R = "gold";
    const A = "dimgray";
    const _ = "background";

    // The sequential range of ASCII symbols represented in the font's character set.
    const firstChar = ' ';
    const lastChar = '_';

    const charset = 
       [_,_,_,_,_,_,_,_, // Space
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,X,_,_,_,_, // #
        X,X,X,X,X,_,_,_,
        _,X,_,X,_,_,_,_,
        X,X,X,X,X,_,_,_,
        _,X,_,X,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,Z,Z,Z,_,_,_, // $
        _,_,Z,_,_,Z,_,_,
        _,_,Z,_,_,_,Z,_,
        _,_,Z,_,_,Z,_,_,
        _,_,Z,Z,Z,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_, // %
        _,A,A,_,A,A,_,_,
        _,A,A,_,A,A,A,A,
        _,_,_,_,_,_,A,A,
        _,A,A,_,A,A,_,_,
        _,_,_,_,_,_,A,A,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_, // &
        _,W,W,L,W,W,_,_,
        _,W,W,L,W,W,W,W,
        _,L,L,L,L,L,W,W,
        _,W,W,L,W,W,L,L,
        _,_,_,_,_,_,W,W,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,X,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,X,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_, // ?
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_, // @
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_, // M
        X,X,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_, // N
        X,X,X,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,_,X,_,_,_,_, // W
        X,_,_,X,_,_,_,_,
        X,X,X,X,_,_,_,_,
        X,X,X,X,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        X,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        X,_,_,_,_,_,_,_,
        X,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        X,X,_,_,_,_,_,_,
        _,_,X,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,R,R,R,R,_,_,_, // ^
        _,_,_,R,R,_,_,_,
        _,_,R,_,R,_,_,_,
        _,R,_,_,R,_,_,_,
        R,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,

        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,X,X,_,_,_,_,_,
        _,_,_,_,_,_,_,_,
        _,_,_,_,_,_,_,_,];

    const publicInterface = {};
    {
        // Returns a copy of the pixels in the charset of the given character.
        publicInterface.character = function(ch = 'A')
        {
            let idx = ch.charCodeAt(0);

            Rsed.assert && ((idx >= firstChar.charCodeAt(0)) &&
                            (idx <= lastChar.charCodeAt(0))
                        || Rsed.throw("Was asked for a font character that isn't in the charset."));

            // Convert to 0-indexed, where 0 is the first character.
            idx -= firstChar.charCodeAt(0);

            // Convert to a starting index of this character in the charset.
            idx = (idx * charWidth * charHeight);

            const character = charset.slice(idx, (idx + (charWidth * charHeight)));

            Rsed.assert && (character.length === (charWidth * charHeight))
                        || Rsed.throw("Failed to return the given character.");

            return character;
        }

        publicInterface.font_width = function() { return charWidth; }
        publicInterface.font_height = function() { return charHeight; }
    }
    return publicInterface;
})();
