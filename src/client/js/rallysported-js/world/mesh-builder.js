/*
 * Most recent known filename: js/world/mesh-builder.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides functions returning renderable 3d meshes of various world items - like the track and
// its props - accounting for user-specified arguments such as camera position.
Rsed.world.meshBuilder = (function()
{
    const publicInterface =
    {
        // Returns a renderable 3d mesh of the current project's track from the given viewing position
        // (in tile units). The mesh will be assigned such world coordinates that it'll be located
        // roughly in the middle of the canvas when rendered.
        track_mesh: function(args = {})
        {
            Rsed.throw_if_not_type("object", args);

            args =
            {
                // Default args.
                ...{
                    // The camera's tile position in integer values.
                    cameraPos: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },

                    // The camera's world position in floating-point values - e.g. the same as
                    // 'cameraPos' but without having rounded to integer values. If this is given,
                    // camera movement will be pixel-based (smooth) instead of tile-based (jagged).
                    cameraPosFloat: undefined,

                    // Whether to draw props with solid colors(/textures) or with just a wireframe.
                    solidProps: true,

                    includeWireframe: false,

                    paintHoverPala: false,
                },
                ...args,
            };

            if (!args.cameraPosFloat)
            {
                args.cameraPosFloat = args.cameraPos;
            }  

            // Returns true if the given XY coordinates are out of track bounds.
            function out_of_bounds(x, y)
            {
                return Boolean((x < 0) || (x >= Rsed.core.current_project().maasto.width) ||
                               (y < 1) || (y > Rsed.core.current_project().maasto.height));
            }

            // The polygons that make up the track mesh.
            const trackPolygons = [];

            // We'll shift the track mesh by these values (world units) to center the mesh on screen.
            // Note that we adjust Z to account for vertical camera zooming.
            const centerView = {x: -((Rsed.world.camera.view_width / 2) * Rsed.constants.groundTileSize),
                                y: (-650 + args.cameraPos.y),
                                z: (3628 - (Rsed.world.camera.rotation().x / 7.5) + (Rsed.constants.groundTileSize * 3.5))};

            const mouseHover = Rsed.ui.inputState.current_mouse_hover();
            const mouseGrab = Rsed.ui.inputState.current_mouse_grab();

            const fractionX = (args.cameraPosFloat.x - args.cameraPos.x);
            const fractionZ = (args.cameraPosFloat.z - args.cameraPos.z);

            const project = Rsed.core.current_project();

            for (let z = 0; z < Rsed.world.camera.view_height; z++)
            {
                // Add the ground tiles.
                for (let x = 0; x < Rsed.world.camera.view_width; x++)
                {
                    // Coordinates of the current ground tile.
                    const tileX = (x + args.cameraPos.x);
                    const tileZ = (z + args.cameraPos.z);

                    if (out_of_bounds(tileX, tileZ))
                    {
                        continue;
                    }

                    const isCornerTile = ((x == 0) ||
                                          (z == 0) ||
                                          (x == (Rsed.world.camera.view_width - 1)));

                    // Coordinates in world units of the ground tile's top left vertex.
                    const vertX = (((x * Rsed.constants.groundTileSize) + centerView.x) - (fractionX * Rsed.constants.groundTileSize));
                    const vertZ = ((centerView.z - (z * Rsed.constants.groundTileSize)) + (fractionZ * Rsed.constants.groundTileSize));

                    const tilePalaIdx = (()=>
                    {
                        let idx = project.varimaa.tile_at(tileX, (tileZ - 1));

                        if (args.paintHoverPala &&
                            !mouseGrab &&
                            (mouseHover && (mouseHover.type === "ground")) &&
                            (Math.abs(mouseHover.groundTileX - tileX) <= Rsed.ui.groundBrush.brush_size()) &&
                            (Math.abs(mouseHover.groundTileY - (tileZ - 1)) <= Rsed.ui.groundBrush.brush_size()))
                        {
                            idx = Rsed.ui.groundBrush.brush_pala_idx();
                        }

                        return idx;
                    })();

                    // Construct the ground quad polygon.
                    {
                        // The heights of the ground quad's corner points.
                        let height1 = project.maasto.tile_at( tileX,       tileZ);
                        let height2 = project.maasto.tile_at((tileX + 1),  tileZ);
                        let height3 = project.maasto.tile_at((tileX + 1), (tileZ - 1));
                        let height4 = project.maasto.tile_at( tileX,      (tileZ - 1));

                        // We'll do rudimentary shading of the polygon based on its orientation.
                        // Ideally, the shading would replicate that of Rally-Sport, but this
                        // particular implementation doesn't.
                        const heightDiff = Math.max(150, Math.min(255, (255 - ((height1 - height3) * 2))));

                        // Each track in Rally-Sport has a water level, i.e. a height to which all water
                        // tiles' corners will be set. The tiles' actual height can be lower, in which case
                        // driving onto them will cause the car to become submerged under the apparent water
                        // level. In other words, the game will render all water tiles flush with the water
                        // level, but also keeps track of the tiles' actual height for car-ground collisions.
                        //
                        // In wireframe mode, we'll draw the ground tile heights as they are, but in non-
                        // wireframe mode, we'll make them flush with the track's water level.
                        if (!args.includeWireframe)
                        {
                            if (tilePalaIdx == 0) // Water tiles are those whose PALA index is 0.
                            {
                                height1 = project.waterLevel;
                                height2 = project.waterLevel;
                                height3 = project.waterLevel;
                                height4 = project.waterLevel;
                            }
                            // This tile is not a water tile but is adjacent to one. In that case, we'll
                            // adjust the heights of such neighboring corners.
                            else
                            {
                                if (project.varimaa.tile_at(tileX, (tileZ - 1) + 1) == 0)
                                {
                                    height2 = project.waterLevel;
                                    height1 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX, (tileZ - 1) - 1) == 0)
                                {
                                    height3 = project.waterLevel;
                                    height4 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX - 1, (tileZ - 1)) == 0)
                                {
                                    height1 = project.waterLevel;
                                    height4 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX + 1, (tileZ - 1)) == 0)
                                {
                                    height2 = project.waterLevel;
                                    height3 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX + 1, (tileZ - 1) + 1) == 0)
                                {
                                    height2 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX - 1, (tileZ - 1) + 1) == 0)
                                {
                                    height1 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX + 1, (tileZ - 1) - 1) == 0)
                                {
                                    height3 = project.waterLevel;
                                }
                                if (project.varimaa.tile_at(tileX - 1, (tileZ - 1) - 1) == 0)
                                {
                                    height4 = project.waterLevel;
                                }
                            }
                        }

                        height1 += centerView.y;
                        height2 += centerView.y;
                        height3 += centerView.y;
                        height4 += centerView.y;

                        const texture = project.palat.texture[tilePalaIdx];

                        const groundQuad = Rngon.ngon([Rngon.vertex(vertX, height1, vertZ, 0, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), height2, vertZ, 1, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), height3, (vertZ + Rsed.constants.groundTileSize), 1, 1),
                                                       Rngon.vertex(vertX, height4, (vertZ + Rsed.constants.groundTileSize), 0, 1)],
                        {
                            color: Rngon.color_rgba(heightDiff, heightDiff, heightDiff),
                            texture: texture,
                            hasWireframe: (!isCornerTile && args.includeWireframe),
                            auxiliary:
                            {
                                // We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
                                // rasterization we'll write into the mouse-picking buffer, so we can later determine which
                                // quad the mouse cursor is hovering over.
                                mousePickId: Rsed.ui.mouse_picking_element("ground",
                                {
                                    texture: texture,
                                    groundTileX: tileX,
                                    groundTileY: (tileZ - 1),
                                }),

                                isCorner: isCornerTile,
                            }
                        });

                        trackPolygons.push(groundQuad);
                    }
                }

                // Add the billboard and bridge tiles. We do this as a separate loop from adding
                // the ground tiles so that the n-gons are properly sorted by depth for rendering.
                // Otherwise, billboard/bridge tiles can become obscured by ground tiles behind
                // them.
                for (let x = 0; x < Rsed.world.camera.view_width; x++)
                {
                    const tileX = (x + args.cameraPos.x);
                    const tileZ = (z + args.cameraPos.z);

                    if (out_of_bounds(tileX, tileZ))
                    {
                        continue;
                    }

                    const isCornerTile = ((x == 0) ||
                                          (z == 0) ||
                                          (x == (Rsed.world.camera.view_width - 1)));

                    const vertX = (((x * Rsed.constants.groundTileSize) + centerView.x) - (fractionX * Rsed.constants.groundTileSize));
                    const vertZ = ((centerView.z - (z * Rsed.constants.groundTileSize)) + (fractionZ * Rsed.constants.groundTileSize));

                    const tilePalaIdx = (()=>
                    {
                        let idx = project.varimaa.tile_at(tileX, (tileZ - 1));

                        if ( args.paintHoverPala &&
                             !mouseGrab &&
                            (mouseHover && (mouseHover.type === "ground")) &&
                            (Math.abs(mouseHover.groundTileX - tileX) <= Rsed.ui.groundBrush.brush_size()) &&
                            (Math.abs(mouseHover.groundTileY - (tileZ - 1)) <= Rsed.ui.groundBrush.brush_size()))
                        {
                            idx = Rsed.ui.groundBrush.brush_pala_idx();
                        }

                        return idx;
                    })();

                    // If this tile has a billboard, add it.
                    const billboardPalaIdx = project.palat.billboard_idx(tilePalaIdx, tileX, (tileZ - 1));
                    if (billboardPalaIdx != null)
                    {
                        const baseHeight = centerView.y + project.maasto.tile_at(tileX, (tileZ - 1));
                        const billboardTexture = project.palat.texture[billboardPalaIdx];
                        const billboardVertices = (()=>
                        {
                            // Bridges (lay horizontally).
                            if (billboardPalaIdx == 177)
                            {
                                return [Rngon.vertex( vertX,  centerView.y, vertZ, 0, 0),
                                        Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, vertZ, 1, 0),
                                        Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, (vertZ+Rsed.constants.groundTileSize), 1, 1),
                                        Rngon.vertex( vertX, centerView.y, (vertZ+Rsed.constants.groundTileSize), 0, 1)];
                            }
                            // Other billboards (lay vertically).
                            else
                            {
                                return [Rngon.vertex( vertX, baseHeight, vertZ, 0, 0),
                                        Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight, vertZ, 1, 0),
                                        Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight+Rsed.constants.groundTileSize, vertZ, 1, 1),
                                        Rngon.vertex( vertX, baseHeight+Rsed.constants.groundTileSize, vertZ, 0, 1)];
                            }
                        })();

                        const billboardQuad = Rngon.ngon(billboardVertices,
                        {
                            texture: billboardTexture,
                            hasFill: true,
                            auxiliary:
                            {
                                mousePickId: null,
                                isCorner: isCornerTile,
                            }
                        });

                        trackPolygons.push(billboardQuad);
                    }
                }
            }

            // Add any track prop meshes that should be visible on the currently-drawn track.
            const propLocations = project.props.locations_of_props_on_track(project.track_id());
            propLocations.forEach((pos, idx)=>
            {
                if ((pos.x >= (args.cameraPos.x * Rsed.constants.groundTileSize)) &&
                    (pos.x <= ((args.cameraPos.x + Rsed.world.camera.view_width) * Rsed.constants.groundTileSize)) &&
                    (pos.z >= (args.cameraPos.z * Rsed.constants.groundTileSize)) &&
                    (pos.z <= ((args.cameraPos.z + Rsed.world.camera.view_height) * Rsed.constants.groundTileSize)))
                {
                    const x = ((pos.x + centerView.x - (args.cameraPos.x * Rsed.constants.groundTileSize)) - (fractionX * Rsed.constants.groundTileSize));
                    const z = ((centerView.z - pos.z + (args.cameraPos.z * Rsed.constants.groundTileSize)) + (fractionZ * Rsed.constants.groundTileSize));
                    
                    const groundHeight = centerView.y + project.maasto.tile_at((pos.x / Rsed.constants.groundTileSize), (pos.z / Rsed.constants.groundTileSize));
                    const y = (groundHeight + pos.y);

                    trackPolygons.push(...this.prop_mesh(pos.propId, idx,
                    {
                        position:
                        {
                            x,
                            y,
                            z,
                        },
                        ...args,
                    }));
                }
            });

            return Rngon.mesh(trackPolygons);
        },

        // Returns a renderable 3d mesh of the given prop at the given position (in world units).
        prop_mesh: (propId = 0, idxOnTrack = 0, args = {})=>
        {
            Rsed.throw_if_not_type("object", args);

            args =
            {
                ...// Default args.
                {
                    position:
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    solidProps: true,
                    includeWireframe: false,
                },
                ...args
            };

            const project = Rsed.core.current_project();
            const srcMesh = project.props.mesh[propId];
            const dstMesh = [];

            srcMesh.ngons.forEach(ngon=>
            {
                const texture = (args.solidProps? (ngon.fill.type === "texture"? project.props.texture[ngon.fill.idx]
                                                                               : null)
                                                : null);

                const propNgon = Rngon.ngon(ngon.vertices.map(v=>Rngon.vertex((v.x + args.position.x),
                                                                              (v.y + args.position.y),
                                                                              (v.z + args.position.z))),
                {
                    color: (args.solidProps? (ngon.fill.type === "texture"? Rsed.visual.palette.color_at_idx(0)
                                                                          : Rsed.visual.palette.color_at_idx(ngon.fill.idx))
                                           : Rsed.visual.palette.color_at_idx(0, true)),
                    texture: texture,
                    textureMapping: "ortho",
                    wireframeColor: Rsed.visual.palette.color_at_idx(args.solidProps? "black" : "lightgray"),
                    hasWireframe: (args.solidProps? args.includeWireframe : true),
                    hasFill: args.solidProps,
                    auxiliary:
                    {
                        mousePickId: Rsed.ui.mouse_picking_element("prop",
                        {
                            texture: texture,
                            propId: propId,
                            propTrackIdx: idxOnTrack
                        }),
                    }
                });

                dstMesh.push(propNgon);
            });

            return dstMesh;
        },
    };

    return publicInterface;
})();
