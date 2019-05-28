/*
 * Most recent known filename: js/track/palat.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

const palat_n = (function()
{
    // Resolution of a single PALA.
    const palaWidth = 16;
    const palaHeight = 16;

    // The list of PALA textures that we know about.
    const palat = [];

    // The list of PALA textures that we know about, with alpha-testing enabled.
    const palatWithAlpha = [];

    let originalPalatBytesize = 0;

    const publicInterface = {};
    {
        publicInterface.set_palat_bytesize = function(numBytes)
        {
            originalPalatBytesize = numBytes;
        }

        // Returns a byte array that can be saved into a RallySportED project file.
        publicInterface.get_saveable_palat = function()
        {
            let bytes = new Uint8Array(originalPalatBytesize);
            
            let idx = 0;
            for (let i = 0; i < palat.length; i++)
            {
                for (let y = (palaHeight - 1); y >= 0; y--) // Iterate backward to flip the image on y.
                {
                    for (let x = 0; x < palaWidth; x++)
                    {
                        if (idx >= originalPalatBytesize) return bytes;

                        bytes[idx++] = palat[i].paletteIndices[x + y * palaWidth];
                    }
                }
            }

            return bytes;
        }

        // Removes any PALAT data we've added, wiping the slate clean as it were.
        publicInterface.clear_palat_data = function()
        {
            palat.length = 0;
            palatWithAlpha.length = 0;
        }

        // Adds the given texture as a known PALA.
        publicInterface.add_pala = function(palaTexture = texture_n.texture_o)
        {
            k_assert((palaTexture instanceof texture_n.texture_o), "Expected a texture object.");

            let tex = new texture_n.texture_o;
            tex.pixels = palaTexture.pixels.slice(0);
            tex.paletteIndices = palaTexture.paletteIndices.slice(0);
            tex.width = palaTexture.width;
            tex.height = palaTexture.height;
            tex.hasAlpha = false;
            palat.push(tex);
    
            tex = new texture_n.texture_o;
            tex.pixels = palaTexture.pixels.slice(0);
            tex.paletteIndices = palaTexture.paletteIndices.slice(0);
            tex.width = palaTexture.width;
            tex.height = palaTexture.height;
            tex.hasAlpha = true;
            palatWithAlpha.push(tex);
        }

        // Returns the PALA with the given index.
        publicInterface.pala_texture = function(palaIdx = 0, withAlpha = false)
        {
            const palaSource = (withAlpha? palatWithAlpha : palat);
           // k_assert((palaSource[palaIdx] != null), "Can't return a valid PALA texture.");
            //k_assert((palaSource[palaIdx] instanceof texture_n.texture_o), "Expected a texture object.");

            return (palaSource[palaIdx] == null)? null : palaSource[palaIdx];
        }

        publicInterface.num_palas = function() { return palat.length; }
        publicInterface.pala_width = function() { return palaWidth; }
        publicInterface.pala_height = function() { return palaHeight; }
    }
    return publicInterface;
})();
