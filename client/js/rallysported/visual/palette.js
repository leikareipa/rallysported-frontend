/*
 * Most recent known filename: js/visual/palette.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.palette = (function()
{
    // The four hard-coded palettes in Rally-Sport's demo. These should not be changed
    // during run-time.
    const rallySportPalettes = [
        // Palette #1.
        [{red:0, green:0, blue:0},
        {red:8, green:64, blue:16},
        {red:16, green:96, blue:36},
        {red:24, green:128, blue:48},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:16, green:96, blue:32},
        {red:32, green:192, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}],

        // Palette #2.
        [{red:0, green:0, blue:0},
        {red:80, green:88, blue:104},
        {red:96, green:104, blue:120},
        {red:112, green:128, blue:144},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:8, green:136, blue:16},
        {red:32, green:192, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}],

        // Palette #3.
        [{red:0, green:0, blue:0},
        {red:72, green:20, blue:12},
        {red:144, green:44, blue:20},
        {red:168, green:56, blue:28},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:16, green:96, blue:32},
        {red:32, green:192, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}],

        // Palette #4.
        [{red:0, green:0, blue:0},
        {red:28, green:52, blue:8},
        {red:64, green:64, blue:16},
        {red:80, green:84, blue:28},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:32, green:64, blue:32},
        {red:64, green:128, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}]
    ];

    // The palette we'll operate on; which is to say, when the user requests us to return a
    // color for a particular palette index, or to change the color at a particular index,
    // this is the palette we'll use. Generally, this palette will contain a modifiable
    // copy of one of Rally-Sport's hard-coded palettes.
    const activePalette = (new Array(256)).fill().map(e=>({red:127,green:127,blue:127,alpha:255,unitRange:{red:1, green:1, blue:1, alpha:1}}));

    const publicInterface =
    {
        // Return the color at the given index in the palette. Optionally, the index may be
        // a string identifying one of the pre-set UI colors (which are otherwise the same as
        // regular colors, but guaranteed to remain constant even when the palette is otherwise
        // altered during operation). The color is returned as an object containing the color's
        // r, g, and b (for red, green, blue) properties. Aside from the UI colors, the object
        // will be returned by reference to an index in the palette, so any changes to the
        // palette afterwards will be reflected in colors returned previously.
        color: (colorIdx = 0)=>
        {
            // Named UI colors.
            switch (colorIdx)
            {
                case "background":  return {red:16,  green:16,  blue:16};
                case "black":       return {red:0,   green:0,   blue:0};
                case "gray":
                case "grey":        return {red:127, green:127, blue:127};
                case "lightgray":
                case "lightgrey":   return {red:192, green:192, blue:192};
                case "dimgray":
                case "dimgrey":     return {red:64,  green:64,  blue:64};
                case "white":       return {red:255, green:255, blue:255};
                case "blue":        return {red:0,   green:0,   blue:255};
                case "darkorchid":  return {red:153, green:50,  blue:204};
                case "paleorchid":  return {red:158, green:123, blue:176};
                case "yellow":      return {red:255, green:255, blue:0};
                case "red":         return {red:255, green:0,   blue:0};
                case "green":       return {red:0,   green:255, blue:0};
                case "gold":        return {red:179, green:112, blue:25};
                default: break;
            }

            return activePalette[colorIdx];
        },

        // Assign one of the four Rally-Sport palettes as the current active one.
        set_palette: (paletteIdx)=>
        {
            Rsed.assert && ((paletteIdx >= 0) &&
                            (paletteIdx < rallySportPalettes.length))
                        || Rsed.throw("Trying to access a palette index out of bounds.");

            rallySportPalettes[paletteIdx].forEach((color, idx)=>
            {
                activePalette[idx].red = color.red;
                activePalette[idx].green = color.green;
                activePalette[idx].blue = color.blue;
            });
        },

        // Change the color at the given palette index in the current active palette.
        set_color: (paletteIdx = 0, newColor = {red:0,green:0,blue:0})=>
        {
            Rsed.assert && ((paletteIdx >= 0) &&
                            (paletteIdx < rallySportPalettes.length))
                        || Rsed.throw("Trying to access a palette index out of bounds.");

            newcolor =
            {
                ...
                {
                    red: activePalette[paletteIdx].red,
                    green: activePalette[paletteIdx].green,
                    blue: activePalette[paletteIdx].blue,
                },
                ...newColor,
            }

            activePalette[paletteIdx].red = newColor.red;
            activePalette[paletteIdx].green = newColor.green;
            activePalette[paletteIdx].blue = newColor.blue;
        },
    };

    return publicInterface;
})();
