/*
 * 2019, 2020 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED-js
 * 
 * A stripped-down version of the retro n-gon renderer's polygon transformer.
 * Includes only the features required by RallySportED-js, helping to boost
 * FPS.
 *
 */

"use strict";

// Applies lighting to the given n-gons, and transforms them into screen space
// for rendering. The processed n-gons are stored in the internal n-gon cache.
Rngon.ngon_transform_and_light = function(ngons = [],
                                          objectMatrix = [],
                                          cameraMatrix = [],
                                          projectionMatrix = [],
                                          screenSpaceMatrix = [],
                                          cameraPos)
{
    const ngonCache = Rngon.internalState.ngonCache;
    const clipSpaceMatrix = Rngon.matrix44.multiply(projectionMatrix, cameraMatrix);

    for (const ngon of ngons)
    {
        // Ignore fully transparent polygons.
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

        // Transform vertices into screen space and apply clipping. We'll do the transforming
        // in steps: first into object space, then into clip space, and finally into screen
        // space.
        if (cachedNgon.material.allowTransform)
        {
            // Object space. Any built-in lighting is applied, if requested by the n-gon's
            // material.
            Rngon.ngon.transform(cachedNgon, objectMatrix);

            // Clip space. Vertices that fall outside of the view frustum will be removed.
            {
                Rngon.ngon.transform(cachedNgon, clipSpaceMatrix);

                if (Rngon.internalState.applyViewportClipping)
                {
                    Rngon.ngon.clip_to_viewport(cachedNgon);
                }

                // If there are no vertices left after clipping, it means this n-gon is
                // not visible on the screen at all, and so we don't need to consider it
                // for rendering.
                if (!cachedNgon.vertices.length)
                {
                    ngonCache.count--;
                    continue;
                }
            }

            // Screen space. Vertices will be transformed such that their XY coordinates
            // map directly into XY pixel coordinates in the rendered image (although
            // the values may still be in floating-point).
            {
                Rngon.ngon.transform(cachedNgon, screenSpaceMatrix);
                Rngon.ngon.perspective_divide(cachedNgon);
            }
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
