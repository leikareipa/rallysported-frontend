/*
 * Most recent known filename: js/world-builder.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.worldBuilder = function()
{
    const publicInterface =
    {
        // Returns a renderable 3d mesh of the track from the given viewing position (in tile units).
        track_mesh: function(viewPos = {x:0,y:0,z:0})
        {
            this.prop_mesh(0, 0);

            // The polygons that make up the track mesh.
            const trackPolygons = [];

            const isTopdownView = (Rsed.ui_view_n.current_view() === "3d-topdown");

            // We'll shift the track mesh by these values (world units) to center the mesh on screen.
            const centerView = {x: (isTopdownView? -1152 : -1088),
                                y: (isTopdownView? -1800 : -680),
                                z: (isTopdownView? 700 : 2612)};

            // Add the ground tiles.
            for (let z = 0; z < Rsed.camera_n.view_height(); z++)
            {
                for (let x = 0; x < Rsed.camera_n.view_width(); x++)
                {
                    // Coordinates of the current ground tile.
                    const tileX = (x + viewPos.x);
                    const tileZ = (z + viewPos.z);

                    // Coordinates in world units of the ground tile's top left vertex.
                    const vertX = ((x * Rsed.constants.groundTileSize) + centerView.x);
                    const vertZ = (centerView.z - (z * Rsed.constants.groundTileSize));

                    const tilePalaIdx = (()=>
                    {
                        let idx = Rsed.core.project().varimaa.tile_at(tileX, (tileZ - 1));

                        // If the mouse cursor is hovering over this tile, mark it with the brush's PALA.
                        if ((tileX === Rsed.ui_input_n.mouse_tile_hover_x()) &&
                            ((tileZ - 1) === Rsed.ui_input_n.mouse_tile_hover_y()))
                        {
                            idx = Rsed.ui_brush_n.brush_pala_idx();
                        }

                        return idx;
                    })();

                    // Construct the ground quad polygon.
                    {
                        // The heights of the ground quad's corner points.
                        const height1 = centerView.y + Rsed.core.project().maasto.tile_at( tileX,       tileZ);
                        const height2 = centerView.y + Rsed.core.project().maasto.tile_at((tileX + 1),  tileZ);
                        const height3 = centerView.y + Rsed.core.project().maasto.tile_at((tileX + 1), (tileZ - 1));
                        const height4 = centerView.y + Rsed.core.project().maasto.tile_at( tileX,      (tileZ - 1));
                        
                        const groundQuad = new Rsed.geometry_n.polygon_o(4);
                        groundQuad.verts[0] = new Rsed.geometry_n.vertex_o( vertX, height1, vertZ);
                        groundQuad.verts[1] = new Rsed.geometry_n.vertex_o((vertX + Rsed.constants.groundTileSize), height2, vertZ);
                        groundQuad.verts[2] = new Rsed.geometry_n.vertex_o((vertX + Rsed.constants.groundTileSize), height3, (vertZ + Rsed.constants.groundTileSize));
                        groundQuad.verts[3] = new Rsed.geometry_n.vertex_o( vertX, height4, (vertZ + Rsed.constants.groundTileSize));
                        
                        groundQuad.hasWireframe = Rsed.ui_view_n.show3dWireframe;
                        groundQuad.texture = Rsed.core.project().palat.texture[tilePalaIdx];

                        // We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
                        // rasterization we'll write into the mouse-picking buffer, so we can later determine which
                        // quad the mouse cursor is hovering over.
                        groundQuad.mousePickId = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ground,
                                                                                         {tileX, tileZ: (tileZ - 1)});

                        trackPolygons.push(groundQuad);
                    }

                    // If this tile has a billboard, add that too.
                    if (tilePalaIdx > 239 && tilePalaIdx < 248)
                    {
                        const baseHeight = centerView.y + Rsed.core.project().maasto.tile_at(tileX, (tileZ - 1));

                        const billboardQuad = new Rsed.geometry_n.polygon_o(4);
                        billboardQuad.verts[0] = new Rsed.geometry_n.vertex_o( vertX, baseHeight, vertZ);
                        billboardQuad.verts[1] = new Rsed.geometry_n.vertex_o((vertX + Rsed.constants.groundTileSize), baseHeight, vertZ);
                        billboardQuad.verts[2] = new Rsed.geometry_n.vertex_o((vertX + Rsed.constants.groundTileSize), baseHeight+Rsed.constants.groundTileSize, vertZ);
                        billboardQuad.verts[3] = new Rsed.geometry_n.vertex_o( vertX, baseHeight+Rsed.constants.groundTileSize, vertZ);

                        switch (tilePalaIdx)
                        {
                            // Spectators.
                            case 240:
                            case 241:
                            case 242: billboardQuad.texture = Rsed.core.project().palat.generate_texture(spectator_texture_at(tileX, (tileZ - 1)), {alpha:true});
                            break;
        
                            // Shrubs.
                            case 243: billboardQuad.texture = Rsed.core.project().palat.generate_texture(208, {alpha:true}); break;
                            case 244: billboardQuad.texture = Rsed.core.project().palat.generate_texture(209, {alpha:true}); break;
                            case 245: billboardQuad.texture = Rsed.core.project().palat.generate_texture(210, {alpha:true}); break;
        
                            // Small poles.
                            case 246:
                            case 247: billboardQuad.texture = Rsed.core.project().palat.generate_texture(211, {alpha:true}); break;
                            case 250: bbillboardQuadll.texture = Rsed.core.project().palat.generate_texture(212, {alpha:true}); break;
        
                            default: Rsed.throw("Unrecognized billboard texture."); continue;
                        }

                        trackPolygons.push(billboardQuad);
                    }
                    // If the tile has a bridge, add that.
                    else if (tilePalaIdx === 248 || tilePalaIdx === 249)
                    {
                        const bridgeQuad = new Rsed.geometry_n.polygon_o(4);
                        bridgeQuad.verts[0] = new Rsed.geometry_n.vertex_o( vertX,  centerView.y, vertZ);
                        bridgeQuad.verts[1] = new Rsed.geometry_n.vertex_o((vertX + Rsed.constants.groundTileSize), centerView.y, vertZ);
                        bridgeQuad.verts[2] = new Rsed.geometry_n.vertex_o((vertX + Rsed.constants.groundTileSize), centerView.y, (vertZ+Rsed.constants.groundTileSize));
                        bridgeQuad.verts[3] = new Rsed.geometry_n.vertex_o( vertX, centerView.y, (vertZ+Rsed.constants.groundTileSize));

                        bridgeQuad.texture = Rsed.core.project().palat.generate_texture(177, {alpha:true});

                        trackPolygons.push(bridgeQuad);
                    }
                }
            }

            // Add any track prop meshes that should be visible on the currently-drawn track.
            const propLocations = Rsed.core.project().props.locations_of_props_on_track(Rsed.core.project().track_id());
            propLocations.forEach((pos, idx)=>
            {
                if ((pos.x >= (Rsed.camera_n.pos_x() * Rsed.constants.groundTileSize)) &&
                    (pos.x <= ((Rsed.camera_n.pos_x() + Rsed.camera_n.view_width()) * Rsed.constants.groundTileSize)) &&
                    (pos.z >= (Rsed.camera_n.pos_z() * Rsed.constants.groundTileSize)) &&
                    (pos.z <= ((Rsed.camera_n.pos_z() + Rsed.camera_n.view_height()) * Rsed.constants.groundTileSize)))
                {
                    const x = (pos.x + centerView.x - (viewPos.x * Rsed.constants.groundTileSize));
                    const z = (centerView.z - pos.z + (viewPos.z * Rsed.constants.groundTileSize));
                    const groundHeight = centerView.y + Rsed.core.project().maasto.tile_at((pos.x / Rsed.constants.groundTileSize), (pos.z / Rsed.constants.groundTileSize));
                    const y = (groundHeight + pos.y);

                    trackPolygons.push(...this.prop_mesh(pos.propId, idx, {x, y, z}, {wireframe: Rsed.ui_view_n.show3dWireframe}));
                }
            });

            /// Temp hack. We're tilting down all the ground elements to get the viewing angle we want,
            /// but really it should be the camera's view vector that's pointed down and not the objects
            /// themselves.
            return new Rsed.geometry_n.polygon_mesh_o(trackPolygons, new Rsed.geometry_n.vector3_o(0, 0, 0),
                                                                     new Rsed.geometry_n.vector3_o(isTopdownView? (-Math.PI / 2) : -0.45, 0, 0));
        },

        // Returns a renderable 3d mesh of the given prop at the given world position.
        prop_mesh: (propId = 0, idxOnTrack = 0, pos = {x:0,y:0,z:0}, args = {})=>
        {
            args =
            {
                ...
                {
                    // Whether the renderer should draw a wireframe around this mesh.
                    wireframe:false, // | true
                },
                ...args
            };

            const srcMesh = Rsed.core.project().props.mesh(propId);
            const dstMesh = [];

            srcMesh.ngons.forEach(ngon=>
            {
                const newPoly = new Rsed.geometry_n.polygon_o(ngon.vertices.length);
                
                dstMesh.push(newPoly);

                ngon.vertices.forEach((vert, idx)=>
                {
                    newPoly.verts[idx].x = (vert.x + pos.x);
                    newPoly.verts[idx].y = (vert.y + pos.y);
                    newPoly.verts[idx].z = (vert.z + pos.z);
                });

                newPoly.color = Rsed.palette.color(0);
                newPoly.texture = null;

                if (ngon.fill.type === "texture")
                {
                    newPoly.texture = Rsed.core.project().props.texture(ngon.fill.idx);
                }
                else
                {
                    newPoly.color = Rsed.palette.color(ngon.fill.idx);
                }

                newPoly.hasWireframe = args.wireframe;
                newPoly.isEthereal = Rsed.ui_view_n.hideProps;
                newPoly.mousePickId = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.prop,
                                                                              {
                                                                                  propIdx: propId,
                                                                                  propTrackId: idxOnTrack
                                                                              });
            });

            return dstMesh;
        }
    };

    return publicInterface;

    // The game by default has four different 'skins' for spectators, and it decides which skin a
    // spectator will be given based on the spectator's x,y coordinates on the track. This will
    // return the correct skin for the given coordinates.
    function spectator_texture_at(tileX = 0, tileY = 0)
    {
        const firstSpectatorTexIdx = 236; // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
        const numSkins = 4;
        const sameRows = ((Rsed.core.project().maasto.width === 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.

        const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
        const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;

        const palaId = (firstSpectatorTexIdx + texOffs);

        return palaId;
    }
};
