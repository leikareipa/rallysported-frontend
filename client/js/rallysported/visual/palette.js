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
        [{r:0, g:0, b:0},
        {r:8, g:64, b:16},
        {r:16, g:96, b:36},
        {r:24, g:128, b:48},
        {r:252, g:0, b:0},
        {r:252, g:252, b:252},
        {r:192, g:192, b:192},
        {r:128, g:128, b:128},
        {r:64, g:64, b:64},
        {r:0, g:0, b:252},
        {r:72, g:128, b:252},
        {r:208, g:100, b:252},
        {r:208, g:72, b:44},
        {r:252, g:112, b:76},
        {r:16, g:96, b:32},
        {r:32, g:192, b:64},
        {r:228, g:56, b:244},
        {r:132, g:36, b:172},
        {r:68, g:92, b:252},
        {r:252, g:252, b:48},
        {r:32, g:32, b:32},
        {r:152, g:48, b:24},
        {r:80, g:24, b:12},
        {r:124, g:124, b:24},
        {r:128, g:0, b:0},
        {r:12, g:20, b:132},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:136, g:28, b:128},
        {r:16, g:252, b:8}],

        // Palette #2.
        [{r:0, g:0, b:0},
        {r:80, g:88, b:104},
        {r:96, g:104, b:120},
        {r:112, g:128, b:144},
        {r:252, g:0, b:0},
        {r:252, g:252, b:252},
        {r:192, g:192, b:192},
        {r:128, g:128, b:128},
        {r:64, g:64, b:64},
        {r:0, g:0, b:252},
        {r:72, g:128, b:252},
        {r:208, g:100, b:252},
        {r:208, g:72, b:44},
        {r:252, g:112, b:76},
        {r:8, g:136, b:16},
        {r:32, g:192, b:64},
        {r:228, g:56, b:244},
        {r:132, g:36, b:172},
        {r:68, g:92, b:252},
        {r:252, g:252, b:48},
        {r:32, g:32, b:32},
        {r:152, g:48, b:24},
        {r:80, g:24, b:12},
        {r:124, g:124, b:24},
        {r:128, g:0, b:0},
        {r:12, g:20, b:132},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:136, g:28, b:128},
        {r:16, g:252, b:8}],

        // Palette #3.
        [{r:0, g:0, b:0},
        {r:72, g:20, b:12},
        {r:144, g:44, b:20},
        {r:168, g:56, b:28},
        {r:252, g:0, b:0},
        {r:252, g:252, b:252},
        {r:192, g:192, b:192},
        {r:128, g:128, b:128},
        {r:64, g:64, b:64},
        {r:0, g:0, b:252},
        {r:72, g:128, b:252},
        {r:208, g:100, b:252},
        {r:208, g:72, b:44},
        {r:252, g:112, b:76},
        {r:16, g:96, b:32},
        {r:32, g:192, b:64},
        {r:228, g:56, b:244},
        {r:132, g:36, b:172},
        {r:68, g:92, b:252},
        {r:252, g:252, b:48},
        {r:32, g:32, b:32},
        {r:152, g:48, b:24},
        {r:80, g:24, b:12},
        {r:124, g:124, b:24},
        {r:128, g:0, b:0},
        {r:12, g:20, b:132},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:136, g:28, b:128},
        {r:16, g:252, b:8}],

        // Palette #4.
        [{r:0, g:0, b:0},
        {r:28, g:52, b:8},
        {r:64, g:64, b:16},
        {r:80, g:84, b:28},
        {r:252, g:0, b:0},
        {r:252, g:252, b:252},
        {r:192, g:192, b:192},
        {r:128, g:128, b:128},
        {r:64, g:64, b:64},
        {r:0, g:0, b:252},
        {r:72, g:128, b:252},
        {r:208, g:100, b:252},
        {r:208, g:72, b:44},
        {r:252, g:112, b:76},
        {r:32, g:64, b:32},
        {r:64, g:128, b:64},
        {r:228, g:56, b:244},
        {r:132, g:36, b:172},
        {r:68, g:92, b:252},
        {r:252, g:252, b:48},
        {r:32, g:32, b:32},
        {r:152, g:48, b:24},
        {r:80, g:24, b:12},
        {r:124, g:124, b:24},
        {r:128, g:0, b:0},
        {r:12, g:20, b:132},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:252, g:252, b:252},
        {r:136, g:28, b:128},
        {r:16, g:252, b:8}]
    ];

    // The palette we'll operate on; which is to say, when the user requests us to return a
    // color for a particular palette index, or to change the color at a particular index,
    // this is the palette we'll use. Generally, this palette will contain a modifiable
    // copy of one of Rally-Sport's hard-coded palettes.
    const activePalette = (new Array(256)).fill().map(e=>({r:127,g:127,b:127}));

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
                case "background":  return {r:16,  g:16,  b:16};
                case "black":       return {r:0,   g:0,   b:0};
                case "gray":
                case "grey":        return {r:127, g:127, b:127};
                case "lightgray":
                case "lightgrey":   return {r:192, g:192, b:192};
                case "dimgray":
                case "dimgrey":     return {r:64,  g:64,  b:64};
                case "white":       return {r:255, g:255, b:255};
                case "blue":        return {r:0,   g:0,   b:255};
                case "darkorchid":  return {r:153, g:50,  b:204};
                case "paleorchid":  return {r:158, g:123, b:176};
                case "yellow":      return {r:255, g:255, b:0};
                case "red":         return {r:255, g:0,   b:0};
                case "green":       return {r:0,   g:255, b:0};
                case "gold":        return {r:179, g:112, b:25};
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
                activePalette[idx].r = color.r;
                activePalette[idx].g = color.g;
                activePalette[idx].b = color.b;
            });
        },

        // Change the color at the given palette index in the current active palette.
        set_color: (paletteIdx = 0, newColor = {r:0,g:0,b:0})=>
        {
            Rsed.assert && ((paletteIdx >= 0) &&
                            (paletteIdx < rallySportPalettes.length))
                        || Rsed.throw("Trying to access a palette index out of bounds.");

            newcolor =
            {
                ...
                {
                    r: activePalette[paletteIdx].r,
                    g: activePalette[paletteIdx].g,
                    b: activePalette[paletteIdx].b,
                },
                ...newColor,
            }

            activePalette[paletteIdx].r = newColor.r;
            activePalette[paletteIdx].g = newColor.g;
            activePalette[paletteIdx].b = newColor.b;
        },
    };

    return publicInterface;
})();
