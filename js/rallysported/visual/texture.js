/*
 * Most recent known filename: js/texture.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.texture_n = (function()
{
    const publicInterface = {};
    {
        publicInterface.texture_o = function(width = 0, height = 0, pixels = [Rsed.color_n.rgba_o])
        {
            this.width = width;
            this.height = height;

            // If set to true, any pixel in the texture whose palette index is 0 is considered
            // see-through and won't be drawn when rendering.
            this.hasAlpha = false;

            // For each pixel, a matching index in Rally-Sport's palette.
            this.paletteIndices = [];

            this.pixels = [];
            for (let i = 0; i < (width * height); i++)
            {
                Rsed.assert && (pixels[i] instanceof Rsed.color_n.rgba_o)
                            || Rsed.throw("Expected a color object.");
                            
                this.pixels.push(new Rsed.color_n.rgba_o(pixels[i].r, pixels[i].g, pixels[i].b, pixels[i].a));
            }
        }
    }
    return publicInterface;
})();