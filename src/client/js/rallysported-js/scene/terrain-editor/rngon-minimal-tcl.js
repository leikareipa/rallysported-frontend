/*
 * 2019, 2020 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED-js
 *
 */

"use strict";

// A stripped-down version of the retro n-gon renderer's polygon transformer. Includes
// only the features required by RallySportED-js, helping to boost FPS.
//
// Expects vertices to already be in screen space.
//
// For the original function, see Rngon.ngon_transform_and_light().
Rsed.scenes["terrain-editor"].minimal_rngon_tcl = function(ngons = [])
{
    const ngonCache = Rngon.internalState.ngonCache;
    const renderWidth = Rngon.internalState.pixelBuffer.width;
    const renderHeight = Rngon.internalState.pixelBuffer.height;

    for (const ngon of ngons)
    {
        // Ignore n-gons that would be fully outside of the screen.
        {
            const boundingBox = ngon.vertices.reduce((bounds, v)=>{
                if (bounds.xMin > v.x) bounds.xMin = v.x;
                if (bounds.xMax < v.x) bounds.xMax = v.x;
                if (bounds.yMin > v.y) bounds.yMin = v.y;
                if (bounds.yMax < v.y) bounds.yMax = v.y;
                return bounds;
            }, {xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity});

            if ((boundingBox.xMin >= renderWidth) || (boundingBox.xMax < 0) ||
                (boundingBox.yMin >= renderHeight) || (boundingBox.yMax < 0))
            {
                continue;
            }
        }

        // Ignore fully transparent n-gons.
        if (!ngon.material.color.alpha &&
            !ngon.material.hasWireframe)
        {
            continue;
        }

        // Copy the ngon into the internal n-gon cache, so we can operate on it without
        // mutating the original n-gon's data.
        const cachedNgon = ngonCache.ngons[ngonCache.count++];
        {
            cachedNgon.vertices.length = 0;

            for (let v = 0; v < ngon.vertices.length; v++)
            {
                cachedNgon.vertices[v] = Rngon.vertex(ngon.vertices[v].x,
                                                      ngon.vertices[v].y,
                                                      ngon.vertices[v].z);
            }

            cachedNgon.material = ngon.material;
            cachedNgon.isActive = true;
        }
    };

    // Mark as inactive any cached n-gons that we didn't touch, so the renderer knows
    // to ignore them for the current frame.
    for (let i = ngonCache.count; i < ngonCache.ngons.length; i++)
    {
        ngonCache.ngons[i].isActive = false;
    }

    return;
}
