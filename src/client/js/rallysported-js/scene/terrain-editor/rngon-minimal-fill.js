/*
 * 2019, 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

{ // A block to limit the scope of the unit-global variables we set up, below.

// We'll sort the n-gon's vertices into those on its left side and those on its
// right side.
const leftVerts = new Array(500);
const rightVerts = new Array(500);

// Then we'll organize the sorted vertices into edges (lines between given two
// vertices). Once we've got the edges figured out, we can render the n-gon by filling
// in the spans between its edges.
const leftEdges = new Array(500).fill().map(e=>({}));
const rightEdges = new Array(500).fill().map(e=>({}));

let numLeftVerts = 0;
let numRightVerts = 0;
let numLeftEdges = 0;
let numRightEdges = 0;

// A stripped-down version of the retro n-gon renderer's polygon filler. Includes
// only the features required by RallySportED-js, helping to boost FPS.
//
// For the original function, see Rngon.ngon_filler().
//
// Note: Consider this the inner render loop; it may contain ugly things like
// code repetition for the benefit of performance. If you'd like to refactor the
// code, please benchmark its effects on performance first - maintaining or
// improving performance would be great, losing performance would be bad.
//
Rsed.scenes["terrain-editor"].minimal_rngon_filler = function(auxiliaryBuffers = [])
{
    const pixelBuffer = Rngon.internalState.pixelBuffer.data;
    const renderWidth = Rngon.internalState.pixelBuffer.width;
    const renderHeight = Rngon.internalState.pixelBuffer.height;

    const vertexSorters =
    {
        verticalAscending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y < vertB.y)? -1 : 1)),
        verticalDescending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y > vertB.y)? -1 : 1))
    }

    // Rasterize the n-gons.
    for (let n = 0; n < Rngon.internalState.ngonCache.count; n++)
    {
        const ngon = Rngon.internalState.ngonCache.ngons[n];
        const material = ngon.material;
        const texture = ngon.material.texture;

        Rngon.assert && (ngon.vertices.length < leftVerts.length)
                     || Rngon.throw("Overflowing the vertex buffer");

        numLeftVerts = 0;
        numRightVerts = 0;
        numLeftEdges = 0;
        numRightEdges = 0;

        // In theory, we should never receive n-gons that have no vertices, but let's check
        // to make sure.
        if (ngon.vertices.length <= 0)
        {
            continue;
        }

        // Rasterize a line.
        if (ngon.vertices.length === 2)
        {
            Rngon.line_draw(ngon.vertices[0], ngon.vertices[1], material.color, n, false);

            continue;
        }
        // Rasterize a polygon with 3 or more vertices.
        else
        {
            // Figure out which of the n-gon's vertices are on its left side and which on the
            // right. The vertices on both sides will be arranged from smallest Y to largest
            // Y, i.e. top-to-bottom in screen space. The top-most vertex and the bottom-most
            // vertex will be shared between the two sides.
            {
                // For rectangular ground tiles.
                if (material.auxiliary.isGroundTile)
                {
                    Rngon.assert && (ngon.vertices.length == 4)
                                 || Rngon.throw("Expected a rectangle.");

                    let leftTop = ngon.vertices[3];
                    let leftBottom = ngon.vertices[0];
                    let rightTop = ngon.vertices[2];
                    let rightBottom = ngon.vertices[1];

                    if (leftTop.y > leftBottom.y)
                    {
                        [leftTop, leftBottom] = [leftBottom, leftTop];
                    }

                    if (rightTop.y > rightBottom.y)
                    {
                        [rightTop, rightBottom] = [rightBottom, rightTop];
                    }

                    if (leftTop.y < rightTop.y)
                    {
                        leftVerts[numLeftVerts++] = leftTop;
                        leftVerts[numLeftVerts++] = leftBottom;
                        rightVerts[numRightVerts++] = leftTop;
                        rightVerts[numRightVerts++] = rightTop;
                        rightVerts[numRightVerts++] = rightBottom;
                    }
                    else
                    {
                        leftVerts[numLeftVerts++] = rightTop;
                        leftVerts[numLeftVerts++] = leftTop;
                        leftVerts[numLeftVerts++] = leftBottom;
                        rightVerts[numRightVerts++] = rightTop;
                        rightVerts[numRightVerts++] = rightBottom;
                    }

                    if (leftBottom.y < rightBottom.y)
                    {
                        leftVerts[numLeftVerts++] = rightBottom;
                    }
                    else
                    {
                        rightVerts[numRightVerts++] = leftBottom;
                    }
                }
                // Generic algorithm for n-sided convex polygons.
                else
                {
                    // Sort the vertices by height from smallest Y to largest Y.
                    ngon.vertices.sort(vertexSorters.verticalAscending);

                    const topVert = ngon.vertices[0];
                    const bottomVert = ngon.vertices[ngon.vertices.length-1];

                    leftVerts[numLeftVerts++] = topVert;
                    rightVerts[numRightVerts++] = topVert;

                    // Trace a line along XY between the top-most vertex and the bottom-most vertex;
                    // and for the intervening vertices, find whether they're to the left or right of
                    // that line on X. Being on the left means the vertex is on the n-gon's left side,
                    // otherwise it's on the right side.
                    for (let i = 1; i < (ngon.vertices.length - 1); i++)
                    {
                        const lr = Rngon.lerp(topVert.x, bottomVert.x, ((ngon.vertices[i].y - topVert.y) / (bottomVert.y - topVert.y)));

                        if (ngon.vertices[i].x >= lr)
                        {
                            rightVerts[numRightVerts++] = ngon.vertices[i];
                        }
                        else
                        {
                            leftVerts[numLeftVerts++] = ngon.vertices[i];
                        }
                    }

                    leftVerts[numLeftVerts++] = bottomVert;
                    rightVerts[numRightVerts++] = bottomVert;
                }
            }

            // Create edges out of the vertices.
            {
                for (let l = 1; l < numLeftVerts; l++) add_edge(leftVerts[l-1], leftVerts[l], true);
                for (let r = 1; r < numRightVerts; r++) add_edge(rightVerts[r-1], rightVerts[r], false);

                function add_edge(vert1, vert2, isLeftEdge)
                {
                    const startY = Math.round(vert1.y);
                    const endY = Math.round(vert2.y);
                    const edgeHeight = (endY - startY);
                    
                    // Ignore horizontal edges.
                    if (edgeHeight === 0) return;

                    const startX = Math.round(vert1.x);
                    const endX = Math.ceil(vert2.x);
                    const deltaX = ((endX - startX) / edgeHeight);

                    const edge = (isLeftEdge? leftEdges[numLeftEdges++] : rightEdges[numRightEdges++]);
                    edge.startY = startY;
                    edge.endY = endY;
                    edge.startX = startX;
                    edge.deltaX = deltaX;
                }
            }

            // Draw the n-gon. On each horizontal raster line, there will be two edges: left and right.
            // We'll render into the pixel buffer each horizontal span that runs between the two edges.
            if (material.hasFill)
            {
                let curLeftEdgeIdx = 0;
                let curRightEdgeIdx = 0;
                let leftEdge = leftEdges[curLeftEdgeIdx];
                let rightEdge = rightEdges[curRightEdgeIdx];
                
                if (!numLeftEdges || !numRightEdges) continue;

                // Note: We assume the n-gon's vertices to be sorted by increasing Y.
                const ngonStartY = leftEdges[0].startY;
                const ngonEndY = leftEdges[numLeftEdges-1].endY;
                const ngonHeight = (ngonEndY - ngonStartY);
                
                // Rasterize the n-gon in horizontal pixel spans over its height.
                for (let y = ngonStartY; y < ngonEndY; y++)
                {
                    const spanStartX = Math.round(leftEdge.startX);
                    const spanEndX = Math.round(rightEdge.startX);
                    const spanWidth = ((spanEndX - spanStartX) + 1);

                    if ((spanWidth > 0) &&
                        (y >= 0) &&
                        (y < renderHeight))
                    {
                        // Assumes the pixel buffer consists of 4 elements per pixel (e.g. RGBA).
                        let pixelBufferIdx = (((spanStartX + y * renderWidth) * 4) - 4);

                        // Draw a solid-filled span.
                        if (!texture)
                        {
                            for (let x = spanStartX; x < spanEndX; x++)
                            {
                                pixelBufferIdx += 4;
                            
                                // Bounds-check, since we don't clip vertices to the viewport.
                                if (x < 0) continue;
                                if (x >= renderWidth) break;

                                pixelBuffer[pixelBufferIdx + 0] = material.color.red;
                                pixelBuffer[pixelBufferIdx + 1] = material.color.green;
                                pixelBuffer[pixelBufferIdx + 2] = material.color.blue;
                                pixelBuffer[pixelBufferIdx + 3] = (material.auxiliary.isCorner? 100 : 255);

                                for (let b = 0; b < auxiliaryBuffers.length; b++)
                                {
                                    if (material.auxiliary[auxiliaryBuffers[b].property] !== null)
                                    {
                                        // Buffers are expected to consist of one element per pixel.
                                        auxiliaryBuffers[b].buffer[pixelBufferIdx/4] = material.auxiliary[auxiliaryBuffers[b].property];
                                    }
                                }
                            }
                        }
                        // Draw a textured span.
                        else
                        {
                            const wDiv = (texture.width / spanWidth);
                            const hDiv = (texture.height / ngonHeight);
                            
                            for (let x = spanStartX; x < spanEndX; x++)
                            {
                                // Update values that're interpolated horizontally along the span.
                                pixelBufferIdx += 4;

                                // Bounds-check, since we don't clip vertices to the viewport.
                                if (x < 0) continue;
                                if (x >= renderWidth) break;

                                // Will hold the texture coordinates used if we end up drawing
                                // a textured pixel at the current x,y screen location.
                                let u = 0.0, v = 0.0;
                             
                                // Screen-space UV mapping, as used e.g. in the DOS game Rally-Sport.
                                {
                                    // Pixel coordinates relative to the polygon.
                                    const ngonX = (x - spanStartX + 1);
                                    const ngonY = (y - ngonStartY + 1);

                                    u = (ngonX * wDiv);
                                    v = (ngonY * hDiv);

                                    // The texture image is flipped, so we need to flip V as well.
                                    v = (texture.height - v);
                                }

                                const texel = texture.pixels[(~~u) + (~~v) * texture.width];

                                // Make sure we gracefully exit if accessing the texture out of bounds.
                                if (!texel) continue;

                                // Alpha-test the texture. If the texel isn't fully opaque, skip it.
                                if (texel.alpha !== 255) continue;

                                // The pixel passed its alpha test, depth test, etc., and should be drawn
                                // on screen.
                                {
                                    pixelBuffer[pixelBufferIdx + 0] = (texel.red   * material.color.unitRange.red);
                                    pixelBuffer[pixelBufferIdx + 1] = (texel.green * material.color.unitRange.green);
                                    pixelBuffer[pixelBufferIdx + 2] = (texel.blue  * material.color.unitRange.blue);
                                    pixelBuffer[pixelBufferIdx + 3] = (material.auxiliary.isCorner? 100 : 255);

                                    for (let b = 0; b < auxiliaryBuffers.length; b++)
                                    {
                                        if (material.auxiliary[auxiliaryBuffers[b].property] !== null)
                                        {
                                            // Buffers are expected to consist of one element per pixel.
                                            auxiliaryBuffers[b].buffer[pixelBufferIdx/4] = material.auxiliary[auxiliaryBuffers[b].property];
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Update values that're interpolated vertically along the edges.
                    leftEdge.startX  += leftEdge.deltaX;
                    rightEdge.startX += rightEdge.deltaX;

                    // We can move onto the next edge when we're at the end of the current one.
                    if (y === (leftEdge.endY - 1)) leftEdge = leftEdges[++curLeftEdgeIdx];
                    if (y === (rightEdge.endY - 1)) rightEdge = rightEdges[++curRightEdgeIdx];
                }
            }

            // Draw a wireframe around any n-gons that wish for one.
            if (Rngon.internalState.showGlobalWireframe ||
                material.hasWireframe)
            {
                for (let l = 1; l < numLeftVerts; l++)
                {
                    Rngon.line_draw(leftVerts[l-1], leftVerts[l], material.wireframeColor, n);
                }

                for (let r = 1; r < numRightVerts; r++)
                {
                    Rngon.line_draw(rightVerts[r-1], rightVerts[r], material.wireframeColor, n);
                }
            }
        }
    }

    return;
}

}
