/*
 * Most recent known filename: js/ui/font.js
 *
 * 2018-2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

Rsed.ui.font = (function()
{
    // Shorthands for colors.
    const X = "black";
    const _ = "background";

    const charset = {
        " ": c([[_]]),

        "!": c([[X],
                [X],
                [X],
                [_],
                [X]]),

        "?": c([[X,X,_],
                [_,_,X],
                [_,X,_],
                [_,_,_],
                [_,X,_]]),

        "\"": c([[_,X,_,X],
                 [_,X,_,X],
                 [X,_,X,_]]),

        "#": c([[_,X,_,X,_],
                [X,X,X,X,X],
                [_,X,_,X,_],
                [X,X,X,X,X],
                [_,X,_,X,_]]),

        "(": c([[_,X],
                [X,_],
                [X,_],
                [X,_],
                [_,X]]),


        ")": c([[X,_],
                [_,X],
                [_,X],
                [_,X],
                [X,_]]),

        "*": c([[X,_,X],
                [_,X,_],
                [X,_,X]], {y: 1}),

        "/": c([[_,_,X],
                [_,_,X],
                [_,X,_],
                [X,_,_],
                [X,_,_]]),

        "+": c([[_,X,_],
                [X,X,X],
                [_,X,_]], {y: 1}),

        "-": c([[X,X,X]], {y: 2}),

        ".": c([[X]], {y: 4}),

        ",": c([[_,X],
                [X,_]], {y: 3}),

        ":": c([[X],
                [_],
                [X]], {y: 1}),

        ";": c([[_,X],
                [_,_],
                [_,X],
                [X,_]], {y: 1}),

        "<": c([[_,X],
                [X,_],
                [_,X]], {y: 1}),

        ">": c([[X,_],
                [_,X],
                [X,_]], {y: 1}),

        "=": c([[X,X,X],
                [_,_,_],
                [X,X,X]], {y: 1}),

        "_": c([[X,X,X]], {y: 3}),

        "0": c([[_,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,_]]),

        "1": c([[_,_,X],
                [_,X,X],
                [_,_,X],
                [_,_,X],
                [_,_,X]], {x: -1}),

        "2": c([[_,X,_],
                [X,_,X],
                [_,_,X],
                [_,X,_],
                [X,X,X]]),

        "3": c([[X,X,_],
                [_,_,X],
                [_,X,_],
                [_,_,X],
                [X,X,_]]),

        "4": c([[_,_,X],
                [_,X,X],
                [X,_,X],
                [X,X,X],
                [_,_,X]]),

        "5": c([[X,X,X],
                [X,_,_],
                [X,X,_],
                [_,_,X],
                [X,X,_]]),

        "6": c([[_,X,X],
                [X,_,_],
                [X,X,_],
                [X,_,X],
                [_,X,_]]),

        "7": c([[X,X,X],
                [_,_,X],
                [_,X,_],
                [_,X,_],
                [_,X,_]]),

        "8": c([[_,X,_],
                [X,_,X],
                [_,X,_],
                [X,_,X],
                [_,X,_]]),

        "9": c([[_,X,_],
                [X,_,X],
                [_,X,X],
                [_,_,X],
                [_,X,_]]),

        "A": c([[_,X,_],
                [X,_,X],
                [X,X,X],
                [X,_,X],
                [X,_,X]]),

        "B": c([[X,X,_],
                [X,_,X],
                [X,X,_],
                [X,_,X],
                [X,X,_]]),

        "C": c([[_,X,X],
                [X,_,_],
                [X,_,_],
                [X,_,_],
                [_,X,X]]),

        "D": c([[X,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [X,X,_]]),

        "E": c([[_,X,X],
                [X,_,_],
                [X,X,X],
                [X,_,_],
                [_,X,X]]),

        "F": c([[_,X,X],
                [X,_,_],
                [X,X,_],
                [X,_,_],
                [X,_,_]]),

        "G": c([[_,X,X],
                [X,_,_],
                [X,_,X],
                [X,_,X],
                [_,X,X]]),

        "H": c([[X,_,X],
                [X,_,X],
                [X,X,X],
                [X,_,X],
                [X,_,X]]),

        "I": c([[X,X,X],
                [_,X,_],
                [_,X,_],
                [_,X,_],
                [X,X,X]]),

        "J": c([[_,X,X],
                [_,_,X],
                [_,_,X],
                [X,_,X],
                [_,X,_]]),

        "K": c([[X,_,X],
                [X,_,X],
                [X,X,_],
                [X,_,X],
                [X,_,X]]),

        "L": c([[X,_,_],
                [X,_,_],
                [X,_,_],
                [X,_,_],
                [_,X,X]]),

        "M": c([[X,X,_,X,_],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X]]),

        "N": c([[X,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [X,_,X]]),

        "O": c([[_,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,_]]),

        "P": c([[X,X,_],
                [X,_,X],
                [X,X,_],
                [X,_,_],
                [X,_,_]]),

        "Q": c([[_,X,_],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,X],
                [_,_,X]]),

        "R": c([[X,X,_],
                [X,_,X],
                [X,X,_],
                [X,_,X],
                [X,_,X]]),

        "S": c([[_,X,X],
                [X,_,_],
                [_,X,_],
                [_,_,X],
                [X,X,_]]),

        "T": c([[X,X,X],
                [_,X,_],
                [_,X,_],
                [_,X,_],
                [_,X,_]]),

        "U": c([[X,_,X],
                [X,_,X],
                [X,_,X],
                [X,_,X],
                [_,X,X]]),

        "W": c([[_,_,_,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [X,_,X,_,X],
                [_,X,_,X,_]]),

        "X": c([[X,_,X],
                [X,_,X],
                [_,X,_],
                [X,_,X],
                [X,_,X]]),

        "Y": c([[X,_,X],
                [X,_,X],
                [_,X,_],
                [_,X,_],
                [_,X,_]]),

        "Z": c([[X,X,X],
                [_,_,X],
                [_,X,_],
                [X,_,_],
                [X,X,X]]),
    };

    const publicInterface = Object.freeze({
        nativeHeight: 5,

        character: function(ch = "?")
        {
            return (charset[ch] ||
                    c([[X,_,X,_],
                       [_,X,_,X],
                       [X,_,X,_],
                       [_,X,_,X],
                       [X,_,X,_]]));
        },

        width_in_pixels: function(string = "A", characterSpacing = 1)
        {
            Rsed.throw_if_not_type("string", string);
            Rsed.throw_if(!string.length);

            const combinedCharacterWidth = Array.from(string).reduce((width, ch)=>(width + publicInterface.character(ch).width), 0);

            return (combinedCharacterWidth + (characterSpacing * (string.length - 1)));
        }
    });

    return publicInterface;

    // Creates and returns a new character object.
    function c(pixels = [[],[],], options = {})
    {
        Rsed.throw_if_not_type("array", pixels);

        const width = pixels[0].length;
        const height = pixels.length;

        Rsed.throw_if(pixels.some(line=>(line.length != width)), "Malformed character bitmap.");

        options = {
            ...{
                x: 0,
                y: 0,
            },
            ...options
        };

        return Object.freeze({
            width,
            height,
            offsetX: options.x,
            offsetY: options.y,

            pixel_at: function(x = 0, y = 0)
            {
                x -= this.offsetX;
                y -= this.offsetY;
                
                if((x < 0) ||
                   (y < 0) ||
                   (x >= width) ||
                   (y >= height))
                {
                    return undefined;
                }

                return pixels[y][x];
            },
        });
    }
})();
