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
                ...// Default args.
                {
                    cameraPos:
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    solidProps: true, // Whether to draw props with solid colors(/textures) or with just a wireframe.
                    includeWireframe: false,
                },
                ...args,
            };

            // The polygons that make up the track mesh.
            const trackPolygons = [];

            // We'll shift the track mesh by these values (world units) to center the mesh on screen.
            // Note that we adjust Z to account for vertical camera zooming.
            const centerView = {x: -((Rsed.world.camera.view_width() / 2) * Rsed.constants.groundTileSize),
                                y: (-680 + args.cameraPos.y),
                                z: (2800 - (Rsed.world.camera.rotation().x / 7.5) + (Rsed.constants.groundTileSize * 3.5))};

            const grab = Rsed.ui.inputState.current_mouse_grab();
            const hover = Rsed.ui.inputState.current_mouse_hover();
            const tabPressed = Rsed.ui.inputState.key_down("tab");

            for (let z = 0; z < Rsed.world.camera.view_height(); z++)
            {
                // Add the ground tiles.
                for (let x = 0; x < Rsed.world.camera.view_width(); x++)
                {
                    // Coordinates of the current ground tile.
                    const tileX = (x + args.cameraPos.x);
                    const tileZ = (z + args.cameraPos.z);

                    // Coordinates in world units of the ground tile's top left vertex.
                    const vertX = ((x * Rsed.constants.groundTileSize) + centerView.x);
                    const vertZ = (centerView.z - (z * Rsed.constants.groundTileSize));

                    const tilePalaIdx = (()=>
                    {
                        let idx = Rsed.core.current_project().varimaa.tile_at(tileX, (tileZ - 1));

                        if ( tabPressed &&
                            (hover && (hover.type === "ground")) &&
                            (hover.groundTileX === tileX) &&
                            (hover.groundTileY === (tileZ - 1)))
                        {
                            idx = Rsed.ui.groundBrush.brush_pala_idx();
                        }

                        return idx;
                    })();

                    // Construct the ground quad polygon.
                    {
                        // The heights of the ground quad's corner points.
                        const height1 = centerView.y + Rsed.core.current_project().maasto.tile_at( tileX,       tileZ);
                        const height2 = centerView.y + Rsed.core.current_project().maasto.tile_at((tileX + 1),  tileZ);
                        const height3 = centerView.y + Rsed.core.current_project().maasto.tile_at((tileX + 1), (tileZ - 1));
                        const height4 = centerView.y + Rsed.core.current_project().maasto.tile_at( tileX,      (tileZ - 1));

                        const groundQuad = Rngon.ngon([Rngon.vertex(vertX, height1, vertZ, 0, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), height2, vertZ, 1, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), height3, (vertZ + Rsed.constants.groundTileSize), 1, 1),
                                                       Rngon.vertex(vertX, height4, (vertZ + Rsed.constants.groundTileSize), 0, 1)],
                        {
                            color: Rngon.color_rgba(255, 255, 255),
                            texture: Rsed.core.current_project().palat.texture[tilePalaIdx],
                            textureMapping: "ortho",
                            uvWrapping: "clamp",
                            hasSolidFill: true,
                            hasWireframe: args.includeWireframe,
                            auxiliary:
                            {
                                // We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
                                // rasterization we'll write into the mouse-picking buffer, so we can later determine which
                                // quad the mouse cursor is hovering over.
                                mousePickId: Rsed.ui.mouse_picking_element("ground",
                                {
                                    groundTileX: tileX,
                                    groundTileY: (tileZ - 1),
                                }),
                            }
                        });

                        trackPolygons.push(groundQuad);
                    }
                }

                // Add the billboard and bridge tiles. We do this as a separate loop from adding
                // the ground tiles so that the n-gons are properly sorted by depth for rendering.
                // Otherwise, billboard/bridge tiles can become obscured by ground tiles behind
                // them.
                for (let x = 0; x < Rsed.world.camera.view_width(); x++)
                {
                    const tileX = (x + args.cameraPos.x);
                    const tileZ = (z + args.cameraPos.z);

                    const vertX = ((x * Rsed.constants.groundTileSize) + centerView.x);
                    const vertZ = (centerView.z - (z * Rsed.constants.groundTileSize));
                    
                    const tilePalaIdx = (()=>
                    {
                        let idx = Rsed.core.current_project().varimaa.tile_at(tileX, (tileZ - 1));

                        if ( tabPressed &&
                            (hover && (hover.type === "ground")) &&
                            (hover.groundTileX === tileX) &&
                            (hover.groundTileY === (tileZ - 1)))
                        {
                            idx = Rsed.ui.groundBrush.brush_pala_idx();
                        }

                        return idx;
                    })();

                    // If this tile has a billboard, add it.
                    if (tilePalaIdx > 239 && tilePalaIdx < 248)
                    {
                        const baseHeight = centerView.y + Rsed.core.current_project().maasto.tile_at(tileX, (tileZ - 1));

                        const texture = (()=>
                        {
                            switch (tilePalaIdx)
                            {
                                // Spectators.
                                case 240:
                                case 241:
                                case 242: return Rsed.core.current_project().palat.texture[spectator_texture_at(tileX, (tileZ - 1))];
                                break;
            
                                // Shrubs.
                                case 243: return Rsed.core.current_project().palat.texture[208];
                                case 244: return Rsed.core.current_project().palat.texture[209];
                                case 245: return Rsed.core.current_project().palat.texture[210];
            
                                // Small poles.
                                case 246:
                                case 247: return Rsed.core.current_project().palat.texture[211];
                                case 250: return Rsed.core.current_project().palat.texture[212];
            
                                default: Rsed.throw("Unrecognized billboard texture."); return null;
                            }
                        })();

                        const billboardQuad = Rngon.ngon([Rngon.vertex( vertX, baseHeight, vertZ, 0, 0),
                                                          Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight, vertZ, 1, 0),
                                                          Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight+Rsed.constants.groundTileSize, vertZ, 1, 1),
                                                          Rngon.vertex( vertX, baseHeight+Rsed.constants.groundTileSize, vertZ, 0, 1)],
                        {
                            color: Rngon.color_rgba(255, 255, 255),
                            texture: texture,
                            textureMapping: "ortho",
                            hasSolidFill: true,
                            hasWireframe: false,
                            auxiliary:
                            {
                                mousePickId: null,
                            }
                        });

                        trackPolygons.push(billboardQuad);
                    }
                    // If the tile has a bridge, add that.
                    else if (tilePalaIdx === 248 || tilePalaIdx === 249)
                    {
                        const bridgeQuad = Rngon.ngon([Rngon.vertex( vertX,  centerView.y, vertZ, 0, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, vertZ, 1, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, (vertZ+Rsed.constants.groundTileSize), 1, 1),
                                                       Rngon.vertex( vertX, centerView.y, (vertZ+Rsed.constants.groundTileSize), 0, 1)],
                        {
                            color: Rngon.color_rgba(255, 255, 255),
                            texture: Rsed.core.current_project().palat.texture[177],
                            textureMapping: "ortho",
                            hasSolidFill: true,
                            hasWireframe: false,
                            auxiliary:
                            {
                                mousePickId: null,
                            }
                        });

                        trackPolygons.push(bridgeQuad);
                    }
                }
            }

            // Add any track prop meshes that should be visible on the currently-drawn track.
            const propLocations = Rsed.core.current_project().props.locations_of_props_on_track(Rsed.core.current_project().track_id());
            propLocations.forEach((pos, idx)=>
            {
                if ((pos.x >= (args.cameraPos.x * Rsed.constants.groundTileSize)) &&
                    (pos.x <= ((args.cameraPos.x + Rsed.world.camera.view_width()) * Rsed.constants.groundTileSize)) &&
                    (pos.z >= (args.cameraPos.z * Rsed.constants.groundTileSize)) &&
                    (pos.z <= ((args.cameraPos.z + Rsed.world.camera.view_height()) * Rsed.constants.groundTileSize)))
                {
                    const x = (pos.x + centerView.x - (args.cameraPos.x * Rsed.constants.groundTileSize));
                    const z = (centerView.z - pos.z + (args.cameraPos.z * Rsed.constants.groundTileSize));
                    const groundHeight = centerView.y + Rsed.core.current_project().maasto.tile_at((pos.x / Rsed.constants.groundTileSize), (pos.z / Rsed.constants.groundTileSize));
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

            const srcMesh = Rsed.core.current_project().props.mesh[propId];
            const dstMesh = [];

            srcMesh.ngons.forEach(ngon=>
            {
                const propNgon = Rngon.ngon(ngon.vertices.map(v=>Rngon.vertex((v.x + args.position.x), (v.y + args.position.y), (v.z + args.position.z))),
                {
                    color: (args.solidProps? (ngon.fill.type === "texture"? Rsed.visual.palette.color_at_idx(0)
                                                                          : Rsed.visual.palette.color_at_idx(ngon.fill.idx))
                                           : Rsed.visual.palette.color_at_idx(0, true)),
                    texture: (args.solidProps? (ngon.fill.type === "texture"? Rsed.core.current_project().props.texture[ngon.fill.idx]
                                                                            : null)
                                             : null),
                    textureMapping: "ortho",
                    wireframeColor: Rsed.visual.palette.color_at_idx(args.solidProps? "black" : "lightgray"),
                    hasWireframe: (args.solidProps? args.includeWireframe : true),
                    auxiliary:
                    {
                        mousePickId: Rsed.ui.mouse_picking_element("prop",
                        {
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

    // The game by default has four different 'skins' for spectators, and it decides which skin a
    // spectator will be given based on the spectator's x,y coordinates on the track. This will
    // return the correct skin for the given coordinates.
    function spectator_texture_at(tileX = 0, tileY = 0)
    {
        const firstSpectatorTexIdx = 236; // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
        const numSkins = 4;
        const sameRows = ((Rsed.core.current_project().maasto.width === 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.

        const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
        const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;

        const palaId = (firstSpectatorTexIdx + texOffs);

        return palaId;
    }
})();
