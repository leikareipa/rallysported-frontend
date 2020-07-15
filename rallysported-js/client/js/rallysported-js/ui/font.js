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
    const charWidth = 4;
    const charHeight = 7;

    // Shorthands for colors.
    const X = "black";
    const _ = "background";

    // The sequential range of ASCII symbols represented in the font's character set.
    const firstChar = ' ';
    const lastChar = '_';

    const charset = 
       [_,_,_,_, // Space
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        X,_,_,_,
        X,_,_,_,
        X,_,_,_,
        _,_,_,_,
        X,_,_,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_, // #
        _,X,_,_,
        X,X,X,_,
        _,X,_,_,
        X,X,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        _,X,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,X,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,_,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        X,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        X,_,X,_,
        _,X,_,_,
        X,_,X,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        X,X,X,_,
        _,X,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        X,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        X,X,X,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,X,_,
        _,_,X,_,
        _,X,_,_,
        X,_,_,_,
        X,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        _,_,X,_,
        _,X,_,_,
        X,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,X,_,
        X,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,X,_,
        _,X,X,_,
        X,_,X,_,
        X,X,X,_,
        _,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,X,_,
        X,_,_,_,
        X,X,_,_,
        _,_,X,_,
        X,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,X,_,
        X,_,_,_,
        X,X,_,_,
        X,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,X,_,
        _,_,X,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        _,X,_,_,
        X,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        _,X,X,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        X,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        X,_,_,_,
        _,X,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        X,X,X,_,
        _,_,_,_,
        X,X,X,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_, // ?
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,// @
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        X,X,X,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        X,_,X,_,
        X,X,_,_,
        X,_,X,_,
        X,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,X,_,
        X,_,_,_,
        X,_,_,_,
        X,_,_,_,
        _,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        X,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,X,_,
        X,_,_,_,
        X,X,X,_,
        X,_,_,_,
        _,X,X,_,
        _,_,_,_,

        _,_,_,_,
        _,X,X,_,
        X,_,_,_,
        X,X,X,_,
        X,_,_,_,
        X,_,_,_,
        _,_,_,_,

        _,_,_,_,
        _,X,X,_,
        X,_,_,_,
        X,_,X,_,
        X,_,X,_,
        _,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        X,X,X,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,X,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        X,X,X,_,
        _,_,_,_,

        _,_,_,_,
        _,_,X,_,
        _,_,X,_,
        _,_,X,_,
        X,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        X,X,_,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,_,_,
        X,_,_,_,
        X,_,_,_,
        X,_,_,_,
        _,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_, // M
        X,X,X,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_, // N
        X,X,X,_,
        X,X,X,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,

        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        X,_,X,_,
        X,X,_,_,
        X,_,_,_,
        X,_,_,_,
        _,_,_,_,
        
        _,_,_,_,
        _,X,_,_,
        X,_,X,_,
        X,_,X,_,
        X,X,X,_,
        _,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        X,_,X,_,
        X,X,_,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,
        
        _,_,_,_,
        _,X,X,_,
        X,_,_,_,
        _,X,_,_,
        _,_,X,_,
        X,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,X,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        X,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        X,_,X,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,_,_,X, // W
        X,_,_,X,
        X,X,X,X,
        X,X,X,X,
        _,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        _,X,_,_,
        X,_,X,_,
        X,_,X,_,
        _,_,_,_,

        _,_,_,_,
        X,_,X,_,
        X,_,X,_,
        _,X,_,_,
        _,X,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,X,_,
        _,_,X,_,
        _,X,_,_,
        X,_,_,_,
        X,X,X,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        X,X,_,_,
        _,_,X,_,
        _,X,_,_,
        _,_,_,_,
        _,X,_,_,
        _,_,_,_,

        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,_,_,_,
        _,X,X,_,
        _,_,_,_,];

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
