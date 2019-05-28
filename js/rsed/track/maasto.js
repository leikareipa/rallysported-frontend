/*
 * Most recent known filename: js/track/maasto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

Rsed.maasto_n = (function()
{
    // The number of tiles per side on this MAASTO.
    let maastoSideLength = 0

    const maxHeightmapValue = 255;
    const minHeightmapValue = -511;

    // The checkpoint is a point on the track next to which the player's car must pass for the
    // lap to be counted as valid.
    const trackCheckpoint = new geometry_n.vector2_o();

    // The side length, in world units, of a single ground tile.
    const tileSize = 128;

    // The MAASTO's height points. These will be about in the range -511..255.
    const heightmap = [];

    // For each tile on the MAASTO, the PALA texture it uses. These will be
    // index values in the range 0..255.
    const tilemap = [];

    // The x,y,z coordinates of each prop on this MAASTO.
    const propLocations = [];
    const propNames = [];

    // The maximum number of props that can exist on a track.
    const maxNumProps = 14;

    // The number of tiles on each side of the track that can't have user-placed props on them. This
    // prevents the user from placing props out of bounds, etc.
    const propMargin = 2;

    // The byte sizes of the binary MAASTO and VARIMAA data that our current heightmap and tilemap are based on.
    let originalMaastoBytesize = 0;
    let originalVarimaaBytesize = 0;

    const publicInterface = {};
    {
        publicInterface.tile_size = function()
        {
            return tileSize;
        }


        publicInterface.set_checkpoint_pos = function(x, y)
        {
            trackCheckpoint.x = x;
            trackCheckpoint.y = y;
        }

        publicInterface.num_props = function()
        {
            k_assert((propLocations.length === propNames.length), "Detected mismatched prop data.");

            return propLocations.length;
        }

        publicInterface.remove_prop = function(propIdx)
        {
            k_assert((propIdx >= 0 && propIdx < propLocations.length), "Trying to delete a prop whose index is out of bounds.");

            // Don't allow removing the finish line, since a track needs to have one at all times. But if you
            // really want to remove it, and you know what you're doing, you need to call some other function,
            // whichever that may be.
            if (propIdx === 0) return;

            propLocations.splice(propIdx, 1);
            propNames.splice(propIdx, 1);
        }

        // Returns a copy of the value such that it's clamped to within allowable track boundaries, considering both
        // the side length of the track and its prop margin. Note that the value is expected to be in tile units
        // multiplied by the tile size (e.g. 53 * 128 for tile 53).
        publicInterface.clamped_to_track_prop_boundaries = function(value)
        {
            const min = (this.prop_margin() * this.tile_size());
            const max = ((this.track_side_length() - this.prop_margin()) * this.tile_size());

            return k_clamp(value, min, max);
        }

        publicInterface.set_prop_position = function(propIdx, x, z)
        {
            k_assert((propIdx >= 0 && propIdx < propLocations.length), "Trying to move a prop whose index is out of bounds.");

            /// TODO: For now, this doesn't clamp the values to track boundaries, as some tracks made with
            /// old versions of RallySportED may try to put props outside of those boundaries (and expect
            /// it to succeed).
            propLocations[propIdx].x = x;
            propLocations[propIdx].z = z;
        }
        
        publicInterface.move_prop = function(propIdx, deltaX, deltaZ)
        {
            k_assert((propIdx >= 0 && propIdx < propLocations.length), "Trying to move a prop whose index is out of bounds.");

            propLocations[propIdx].x = this.clamped_to_track_prop_boundaries(propLocations[propIdx].x + deltaX);
            propLocations[propIdx].z = this.clamped_to_track_prop_boundaries(propLocations[propIdx].z + deltaZ);
        }

        publicInterface.level_terrain = function()
        {
            const heightString = window.prompt("Level the terrain to a height of...");
            if (heightString == null) return;

            const heightValue = Number(heightString);

            if (!Number.isInteger(heightValue) ||
                heightValue < minHeightmapValue ||
                heightValue > maxHeightmapValue)
            {
                window.alert("The given height value is out of range (" + minHeightmapValue + ".." + maxHeightmapValue + ").");
                return;
            }

            heightmap.fill(heightValue);
        }

        // Returns a byte array that can be saved into a RallySportED project file.
        publicInterface.get_saveable_maasto = function()
        {
            let bytes = new Uint8Array(heightmap.length * 2);

            // Convert our single-value heightmap into Rally-Sport's two-byte format.
            for (let i = 0; i < heightmap.length; i++)
            {
                const height = heightmap[i];
                let b1 = 0;
                let b2 = 0;

                if (height > 0)
                {
                    b2 = 255;
                    b1 = (255 - height);
                }
                else if (height <= 0)
                {
                    if (height < -255)
                    {
                        b2 = 1;
                        b1 = (Math.abs(height) - 256);
                    }
                    else
                    {
                        b2 = 0;
                        b1 = Math.abs(height);
                    }
                }

                bytes[i*2] = b1;
                bytes[i*2+1] = b2;
            }

            k_assert((bytes.length === originalMaastoBytesize), "Returning too many/few bytes in the saveable MAASTO buffer.");

            return bytes;
        }

        // Returns a byte array that can be saved into a RallySportED project file.
        publicInterface.get_saveable_varimaa = function()
        {
            let bytes = new Uint8Array(tilemap.length);

            for (let i = 0; i < tilemap.length; i++)
            {
                bytes[i] = tilemap[i];
            }

            k_assert((bytes.length === originalVarimaaBytesize), "Returning too many/few bytes in the saveable MAASTO buffer.");

            return bytes;
        }

        // Returns the x,y,z track coordinates of the given prop.
        publicInterface.position_of_prop = function(propId)
        {
            k_assert((propId >= 0 && propId < propLocations.length), "Querying prop position out of bounds.");
            return propLocations[propId];
        }

        // Returns the name of the given prop.
        publicInterface.name_of_prop = function(propId)
        {
            k_assert((propId >= 0 && propId < propNames.length), "Querying prop position out of bounds.");
            return propNames[propId].slice(0);
        }

        publicInterface.change_prop_type = function(propIdx, newPropIdx)
        {
            k_assert((propIdx >= 0 && propIdx < propNames.length), "Attempting to change prop type out of bounds.");
            propNames[propIdx] = Rsed.props_n.prop_name_for_idx(newPropIdx);
        }

        publicInterface.set_prop_count = function(numProps = 0)
        {
            // Each track needs at least one prop, i.e. the starting line.
            k_assert(((numProps >= 1) && (numProps <= propLocations.length)), "Attempting to set prop count out of bounds (" + numProps + ").");

            propLocations.length = numProps;
            propNames.length = numProps;
        }

        // Removes any MAASTO data we've added, wiping the slate clean as it were.
        publicInterface.clear_maasto_data = function(propsToo = false)
        {
            maastoSideLength = 0;
            heightmap.length = 0;
            tilemap.length = 0;

            if (propsToo)
            {
                propLocations.length = 0;
                propNames.length = 0;
            }
        }

        publicInterface.add_prop_location = function(trackId = 0, propName = "", x = 0, y = 0, z = 0)
        {
            k_assert((trackId >= 0 && trackId <= 8), "Track id is out of bounds.");
            k_assert((propName.length > 0), "Expected a non-empty prop name.");

            /// Temp hack.
            if (trackId !== rsed_n.underlying_track_id()) return;

            if (propLocations.length >= maxNumProps)
            {
                k_popup("A track can have " + maxNumProps +" props, at most. This one has that many, already. Remove some to make room for more.");
                return;
            }
            
            const pos = new geometry_n.vector3_o(x, y, z);
            propLocations.push(pos);
            propNames.push(propName);
        }

        // Call this with a n array of height points (sideLength * sideLength) long.
        publicInterface.set_maasto = function(sideLength = 0, heights = [])
        {
            k_assert((heights[0] != null), "Can't set the MAASTO with potentially bad data.");
            k_assert((heights.length === (sideLength * sideLength)), "Incorrect number of height points for MAASTO.");

            maastoSideLength = sideLength;
            heightmap.push(...heights);
        }

        publicInterface.set_maasto_height_at = function(x = 0, y = 0, newHeight = 0)
        {
            k_assert(((x >= 0 && x < maastoSideLength) &&
                      (y >= 0 && y < maastoSideLength)), "Attempting to set MAASTO height out of bounds (" + x + "," + y + ").");

            if (newHeight > maxHeightmapValue) newHeight = maxHeightmapValue;
            else if (newHeight < minHeightmapValue) newHeight = minHeightmapValue;

            heightmap[x + y * maastoSideLength] = newHeight;
        }

        publicInterface.set_varimaa_tile_at = function(x = 0, y = 0, palaIdx = 0)
        {
            k_assert(((x >= 0 && x < maastoSideLength) &&
                      (y >= 0 && y < maastoSideLength)), "Attempting to set a VARIMAA tile out of bounds (" + x + "," + y + ").");

            tilemap[x + y * maastoSideLength] = palaIdx;
        }

        publicInterface.set_varimaa = function(sideLength = 0, tiles = [])
        {
            k_assert((sideLength === maastoSideLength), "Expected the MAASTO side length to be set and identical to that of the VARIMAA.");
            tilemap.push(...tiles);
        }

        publicInterface.maasto_height_at = function(x = 0, y = 0)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            if (x < 0 || x >= maastoSideLength ||
                y < 0 || y >= maastoSideLength)
            {
                return 0;
            }

            return heightmap[x + y * maastoSideLength];
        }

        publicInterface.varimaa_tile_at = function(x = 0, y = 0)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            if (x < 0 || x >= maastoSideLength ||
                y < 0 || y >= maastoSideLength)
            {
                return 0;
            }

            return tilemap[x + y * maastoSideLength];
        }

        // The game by default has four different 'skins' for spectators, and it decides which skin a
        // spectator will be given based on the spectator's x,y coordinates on the track. This will
        // return the correct skin for the given coordinates.
        publicInterface.spectator_texture_at = function(tileX = 0, tileY = 0)
        {
            const firstSpectatorTexIdx = 236;      // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
            const numSkins = 4;
            const sameRows = ((this.track_side_length() == 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.

            const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
            const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;

            const textureIdx = (firstSpectatorTexIdx + texOffs);

            return textureIdx;
        }

        // Returns a polygon mesh of the track at the given viewing position, given in track tile units.
        publicInterface.maasto_mesh = function(viewOffsetX = 0, viewOffsetZ = 0)
        {
            // The list of polygons that make up the track mesh.
            const polys = [];

            const topdown = (ui_view_n.current_view() === "3d-topdown");

            // We'll center the track on the screen with these.
            const trackOffsetX = topdown? -1152 : -1088;
            const trackOffsetY = topdown? -1800 : -680;
            const trackOffsetZ = topdown? 700 : 2612;

            const wireframeOnRequest = ui_view_n.show3dWireframe;

            // Add the ground tiles.
            for (let z = 0; z < Rsed.camera_n.view_height(); z++)
            {
                for (let x = 0; x < Rsed.camera_n.view_width(); x++)
                {
                    const tileX = (x + viewOffsetX);
                    const tileZ = (z + viewOffsetZ);

                    const vertX = ((x * tileSize) + trackOffsetX);
                    const vertZ = (trackOffsetZ - (z * tileSize));

                    let tilePala = this.varimaa_tile_at(tileX, (tileZ - 1));

                    // If the mouse cursor is hovering over this tile, mark it with the brush's PALA.
                    if (tileX === ui_input_n.mouse_tile_hover_x() &&
                        (tileZ - 1) === ui_input_n.mouse_tile_hover_y())
                    {
                        tilePala = ui_brush_n.brush_pala_idx();
                    }

                    // Constuct the ground quad polygon.
                    const quad = new geometry_n.polygon_o(4);
                    {
                        // The heights of the ground quad's corner points.
                        const height1 = trackOffsetY + this.maasto_height_at( tileX,       tileZ);
                        const height2 = trackOffsetY + this.maasto_height_at((tileX + 1),  tileZ);
                        const height3 = trackOffsetY + this.maasto_height_at((tileX + 1), (tileZ - 1));
                        const height4 = trackOffsetY + this.maasto_height_at( tileX,      (tileZ - 1));
                        
                        quad.v[0] = new geometry_n.vertex_o( vertX,             height1, vertZ);
                        quad.v[1] = new geometry_n.vertex_o((vertX + tileSize), height2, vertZ);
                        quad.v[2] = new geometry_n.vertex_o((vertX + tileSize), height3, (vertZ + tileSize));
                        quad.v[3] = new geometry_n.vertex_o( vertX,             height4, (vertZ + tileSize));
                        
                        quad.hasWireframe = wireframeOnRequest;
                        quad.texture = Rsed.palat_n.pala_texture(tilePala);
                    }

                    // We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
                    // rasterization we'll write into the mouse-picking buffer, so we can later determine which
                    // quad, if any, the mouse cursor is hovering over.
                    quad.mousePickId = ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.ground,
                                                                          {"tileX":tileX,
                                                                           "tileZ":(tileZ - 1)});

                    polys.push(quad);

                    // If this tile has a billboard, add that too.
                    if (tilePala > 239 && tilePala <= 247)
                    {
                        const baseHeight = trackOffsetY + this.maasto_height_at(tileX, (tileZ - 1));

                        const bill = new geometry_n.polygon_o(4);
                        bill.v[0] = new geometry_n.vertex_o( vertX,             baseHeight,          vertZ);
                        bill.v[1] = new geometry_n.vertex_o((vertX + tileSize), baseHeight,          vertZ);
                        bill.v[2] = new geometry_n.vertex_o((vertX + tileSize), baseHeight+tileSize, vertZ);
                        bill.v[3] = new geometry_n.vertex_o( vertX,             baseHeight+tileSize, vertZ);

                        switch (tilePala)
                        {
                            // Spectators.
                            case 240:
                            case 241:
                            case 242: bill.texture = Rsed.palat_n.pala_texture(this.spectator_texture_at(tileX, (tileZ - 1)), true);
                            break;
        
                            // Shrubs.
                            case 243: bill.texture = Rsed.palat_n.pala_texture(208, true); break;
                            case 244: bill.texture = Rsed.palat_n.pala_texture(209, true); break;
                            case 245: bill.texture = Rsed.palat_n.pala_texture(210, true); break;
        
                            // Small poles.
                            case 246:
                            case 247: bill.texture = Rsed.palat_n.pala_texture(211, true); break;
                            case 250: bill.texture = Rsed.palat_n.pala_texture(212, true); break;
        
                            default: k_assert(0, "Unrecognized billboard texture."); continue;
                        }

                        polys.push(bill);
                    }
                    // If the tile has a bridge, add that.
                    else if (tilePala === 248 || tilePala === 249)
                    {
                        const bridge = new geometry_n.polygon_o(4);
                        bridge.v[0] = new geometry_n.vertex_o( vertX,             trackOffsetY, vertZ);
                        bridge.v[1] = new geometry_n.vertex_o((vertX + tileSize), trackOffsetY, vertZ);
                        bridge.v[2] = new geometry_n.vertex_o((vertX + tileSize), trackOffsetY, (vertZ+tileSize));
                        bridge.v[3] = new geometry_n.vertex_o( vertX,             trackOffsetY, (vertZ+tileSize));

                        bridge.texture = Rsed.palat_n.pala_texture(177, true);

                        polys.push(bridge);
                    }
                }
            }

            // Add any track prop meshes that should be visible on the currently-drawn track.
            for (let i = 0; i < propLocations.length; i++)
            {
                const pos = propLocations[i];
                if ((pos.x >= (Rsed.camera_n.pos_x() * tileSize)) &&
                    (pos.x <= ((Rsed.camera_n.pos_x() + Rsed.camera_n.view_width()) * tileSize)) &&
                    (pos.z >= (Rsed.camera_n.pos_z() * tileSize)) &&
                    (pos.z <= ((Rsed.camera_n.pos_z() + Rsed.camera_n.view_height()) * tileSize)))
                {
                    const x = (pos.x + trackOffsetX - (viewOffsetX * tileSize));
                    const z = (trackOffsetZ - pos.z + (viewOffsetZ * tileSize));
                    const groundHeight = trackOffsetY + this.maasto_height_at((pos.x / tileSize), (pos.z / tileSize));
                    const y = (groundHeight + pos.y);

                    const mesh = Rsed.props_n.prop_mesh(propNames[i], i, x, y, z, wireframeOnRequest);
                    polys.push(...mesh);
                }
            }
            
            /// Temp hack. We're tilting down all the ground elements to get the viewing angle we want,
            /// but really it should be the camera's view vector that's pointed down and not the objects
            /// themselves.
            return new geometry_n.polygon_mesh_o(polys, new geometry_n.vector3_o(0, 0, 0),
                                                        new geometry_n.vector3_o(topdown? (-Math.PI / 2) : -0.45, 0, 0));
        }

        publicInterface.prop_locations = function() { return propLocations.slice(0); }
        publicInterface.prop_names = function() { return propNames.slice(0); }

        publicInterface.track_checkpoint_x = function() { return trackCheckpoint.x; }
        publicInterface.track_checkpoint_y = function() { return trackCheckpoint.y; }

        publicInterface.prop_margin = function() { return propMargin; }

        publicInterface.track_side_length = function() { return maastoSideLength; }

        publicInterface.set_maasto_bytesize = function(numBytes) { originalMaastoBytesize = numBytes; }
        publicInterface.set_varimaa_bytesize = function(numBytes) { originalVarimaaBytesize = numBytes; }
    }
    return publicInterface;
})();
