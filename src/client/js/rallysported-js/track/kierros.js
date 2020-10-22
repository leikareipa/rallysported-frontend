/*
 * Most recent known filename: js/track/kierros.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about a track's KIERROS data (the AI driver's checkpoints).
// You can learn more about the KIERROS format at https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.track.kierros = function(data = Uint8Array)
{
    const checkpoints = [];
    const bytesPerCheckpoint = 8;
    const numCheckpoints = ((data.length / bytesPerCheckpoint) - 1);

    for (let i = 0; i < numCheckpoints; i++)
    {
        const idx = (i * bytesPerCheckpoint);

        checkpoints.push({
            x:          ((data[idx+0] | (data[idx+1] << 8)) / 128),
            z:          ((data[idx+2] | (data[idx+3] << 8)) / 128),
            orientation: (data[idx+4] | (data[idx+5] << 8)),
            speed:       (data[idx+6] | (data[idx+7] << 8)),
        });
    }

    const publicInterface =
    {
        checkpoints: Object.freeze(checkpoints),
    };
    
    return publicInterface;
}
