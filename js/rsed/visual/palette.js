/*
 * Most recent known filename: js/palette.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Rally-Sport's four VGA mode 13h palettes.
 *
 */

"use strict";

Rsed.palette_n = (function()
{
    // There are four palettes in the game. This decides which of them is currently active.
    let currentPalette = 0;

    const palettes = [];

    const publicInterface = {};
    {
        // Re-initializes the palettes to their original values.
        publicInterface.reset_palettes = function()
        {
            palettes.length = 0;

            palettes.push([ new Rsed.color_n.rgba_o(0, 0, 0, 255),
                            new Rsed.color_n.rgba_o(8, 64, 16, 255),
                            new Rsed.color_n.rgba_o(16, 96, 36, 255),
                            new Rsed.color_n.rgba_o(24, 128, 48, 255),
                            new Rsed.color_n.rgba_o(252, 0, 0, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(192, 192, 192, 255),
                            new Rsed.color_n.rgba_o(128, 128, 128, 255),
                            new Rsed.color_n.rgba_o(64, 64, 64, 255),
                            new Rsed.color_n.rgba_o(0, 0, 252, 255),
                            new Rsed.color_n.rgba_o(72, 128, 252, 255),
                            new Rsed.color_n.rgba_o(208, 100, 252, 255),
                            new Rsed.color_n.rgba_o(208, 72, 44, 255),
                            new Rsed.color_n.rgba_o(252, 112, 76, 255),
                            new Rsed.color_n.rgba_o(16, 96, 32, 255),
                            new Rsed.color_n.rgba_o(32, 192, 64, 255),
                            new Rsed.color_n.rgba_o(228, 56, 244, 255),
                            new Rsed.color_n.rgba_o(132, 36, 172, 255),
                            new Rsed.color_n.rgba_o(68, 92, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 48, 255),
                            new Rsed.color_n.rgba_o(32, 32, 32, 255),
                            new Rsed.color_n.rgba_o(152, 48, 24, 255),
                            new Rsed.color_n.rgba_o(80, 24, 12, 255),
                            new Rsed.color_n.rgba_o(124, 124, 24, 255),
                            new Rsed.color_n.rgba_o(128, 0, 0, 255),
                            new Rsed.color_n.rgba_o(12, 20, 132, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(136, 28, 128, 255),
                            new Rsed.color_n.rgba_o(16, 252, 8, 255)]);

            palettes.push([ new Rsed.color_n.rgba_o(0, 0, 0, 255),
                            new Rsed.color_n.rgba_o(80, 88, 104, 255),
                            new Rsed.color_n.rgba_o(96, 104, 120, 255),
                            new Rsed.color_n.rgba_o(112, 128, 144, 255),
                            new Rsed.color_n.rgba_o(252, 0, 0, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(192, 192, 192, 255),
                            new Rsed.color_n.rgba_o(128, 128, 128, 255),
                            new Rsed.color_n.rgba_o(64, 64, 64, 255),
                            new Rsed.color_n.rgba_o(0, 0, 252, 255),
                            new Rsed.color_n.rgba_o(72, 128, 252, 255),
                            new Rsed.color_n.rgba_o(208, 100, 252, 255),
                            new Rsed.color_n.rgba_o(208, 72, 44, 255),
                            new Rsed.color_n.rgba_o(252, 112, 76, 255),
                            new Rsed.color_n.rgba_o(8, 136, 16, 255),
                            new Rsed.color_n.rgba_o(32, 192, 64, 255),
                            new Rsed.color_n.rgba_o(228, 56, 244, 255),
                            new Rsed.color_n.rgba_o(132, 36, 172, 255),
                            new Rsed.color_n.rgba_o(68, 92, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 48, 255),
                            new Rsed.color_n.rgba_o(32, 32, 32, 255),
                            new Rsed.color_n.rgba_o(152, 48, 24, 255),
                            new Rsed.color_n.rgba_o(80, 24, 12, 255),
                            new Rsed.color_n.rgba_o(124, 124, 24, 255),
                            new Rsed.color_n.rgba_o(128, 0, 0, 255),
                            new Rsed.color_n.rgba_o(12, 20, 132, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(136, 28, 128, 255),
                            new Rsed.color_n.rgba_o(16, 252, 8, 255)]);

            palettes.push([ new Rsed.color_n.rgba_o(0, 0, 0, 255),
                            new Rsed.color_n.rgba_o(72, 20, 12, 255),
                            new Rsed.color_n.rgba_o(144, 44, 20, 255),
                            new Rsed.color_n.rgba_o(168, 56, 28, 255),
                            new Rsed.color_n.rgba_o(252, 0, 0, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(192, 192, 192, 255),
                            new Rsed.color_n.rgba_o(128, 128, 128, 255),
                            new Rsed.color_n.rgba_o(64, 64, 64, 255),
                            new Rsed.color_n.rgba_o(0, 0, 252, 255),
                            new Rsed.color_n.rgba_o(72, 128, 252, 255),
                            new Rsed.color_n.rgba_o(208, 100, 252, 255),
                            new Rsed.color_n.rgba_o(208, 72, 44, 255),
                            new Rsed.color_n.rgba_o(252, 112, 76, 255),
                            new Rsed.color_n.rgba_o(16, 96, 32, 255),
                            new Rsed.color_n.rgba_o(32, 192, 64, 255),
                            new Rsed.color_n.rgba_o(228, 56, 244, 255),
                            new Rsed.color_n.rgba_o(132, 36, 172, 255),
                            new Rsed.color_n.rgba_o(68, 92, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 48, 255),
                            new Rsed.color_n.rgba_o(32, 32, 32, 255),
                            new Rsed.color_n.rgba_o(152, 48, 24, 255),
                            new Rsed.color_n.rgba_o(80, 24, 12, 255),
                            new Rsed.color_n.rgba_o(124, 124, 24, 255),
                            new Rsed.color_n.rgba_o(128, 0, 0, 255),
                            new Rsed.color_n.rgba_o(12, 20, 132, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(136, 28, 128, 255),
                            new Rsed.color_n.rgba_o(16, 252, 8, 255)]);

            palettes.push([ new Rsed.color_n.rgba_o(0, 0, 0, 255),
                            new Rsed.color_n.rgba_o(28, 52, 8, 255),
                            new Rsed.color_n.rgba_o(64, 64, 16, 255),
                            new Rsed.color_n.rgba_o(80, 84, 28, 255),
                            new Rsed.color_n.rgba_o(252, 0, 0, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(192, 192, 192, 255),
                            new Rsed.color_n.rgba_o(128, 128, 128, 255),
                            new Rsed.color_n.rgba_o(64, 64, 64, 255),
                            new Rsed.color_n.rgba_o(0, 0, 252, 255),
                            new Rsed.color_n.rgba_o(72, 128, 252, 255),
                            new Rsed.color_n.rgba_o(208, 100, 252, 255),
                            new Rsed.color_n.rgba_o(208, 72, 44, 255),
                            new Rsed.color_n.rgba_o(252, 112, 76, 255),
                            new Rsed.color_n.rgba_o(32, 64, 32, 255),
                            new Rsed.color_n.rgba_o(64, 128, 64, 255),
                            new Rsed.color_n.rgba_o(228, 56, 244, 255),
                            new Rsed.color_n.rgba_o(132, 36, 172, 255),
                            new Rsed.color_n.rgba_o(68, 92, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 48, 255),
                            new Rsed.color_n.rgba_o(32, 32, 32, 255),
                            new Rsed.color_n.rgba_o(152, 48, 24, 255),
                            new Rsed.color_n.rgba_o(80, 24, 12, 255),
                            new Rsed.color_n.rgba_o(124, 124, 24, 255),
                            new Rsed.color_n.rgba_o(128, 0, 0, 255),
                            new Rsed.color_n.rgba_o(12, 20, 132, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(252, 252, 252, 255),
                            new Rsed.color_n.rgba_o(136, 28, 128, 255),
                            new Rsed.color_n.rgba_o(16, 252, 8, 255)]);
        }
        // Set new r,g,b values for the given palette entry in the currently-active palette.
        publicInterface.modify_palette_entry = function(paletteIdx, r, g, b)
        {
            Rsed.assert && ((paletteIdx >= 0) &&
                            (paletteIdx < palettes[currentPalette].length))
                        || Rsed.throw("Invalid palette index.");

            palettes[currentPalette][paletteIdx].r = r;
            palettes[currentPalette][paletteIdx].g = g;
            palettes[currentPalette][paletteIdx].b = b;
        }

        publicInterface.set_palette_for_track = function(trackId = 0)
        {
            Rsed.assert && ((trackId >= 1) &&
                            (trackId <= 8))
                        || Rsed.throw("Trying to set palette for a track index out of bounds.");

            switch (trackId)
            {
                case 1:
                case 2:
                case 3:
                case 4:
                case 6:
                case 7: currentPalette = 0; break;
                case 5: currentPalette = 1; break;
                case 8: currentPalette = 3; break;
                default: Rsed.throw("Unknown track id for setting a palette."); break;
            }
        }

        publicInterface.palette_idx_to_rgba = function(idx = 0)
        {
            if (palettes.length === 0) return new Rsed.color_n.rgba_o(0, 0, 0, 0);

            switch (idx)
            {
                // UI colors.
                case "black": return new Rsed.color_n.rgba_o(0, 0, 0, 255);
                case "gray": case "grey": return new Rsed.color_n.rgba_o(127, 127, 127, 255);
                case "lightgray": case "lightgrey": return new Rsed.color_n.rgba_o(192, 192, 192, 255);
                case "dimgray": case "dimgrey": return new Rsed.color_n.rgba_o(64, 64, 64, 255);
                case "white": return new Rsed.color_n.rgba_o(255, 255, 255, 255);
                case "blue": return new Rsed.color_n.rgba_o(0, 0, 255, 255);
                case "darkorchid": return new Rsed.color_n.rgba_o(153, 50, 204, 255);
                case "paleorchid": return new Rsed.color_n.rgba_o(158, 123, 176, 255);
                case "yellow": return new Rsed.color_n.rgba_o(255, 255, 0, 255);
                case "red": return new Rsed.color_n.rgba_o(255, 0, 0, 255);
                case "green": return new Rsed.color_n.rgba_o(0, 255, 0, 255);
                case "gold": return new Rsed.color_n.rgba_o(179, 112, 25, 255);
                
                // Rally-Sport's palettes.
                default: return palettes[currentPalette][idx||0];
            }
        }
    }
    return publicInterface;
})();
