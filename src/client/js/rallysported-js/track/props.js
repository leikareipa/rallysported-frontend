/*
 * Most recent known filename: js/track/props.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about and the means to modify a track's props (track-side 3d objects,
// like trees and the finish line). For more information about track props, check out the
// documentation at https://github.com/leikareipa/rallysported/tree/master/docs; and the
// prop metadata JSON file, distributable/assets/metadata/props.json.
//
// The textureAtlas parameter provides as an array the pixels of the prop texture atlas, with
// each byte in it giving the corresponding pixel's RGB color as a palette index.
Rsed.track.props = async function(textureAtlas = Uint8Array)
{
    const data = await fetch_prop_metadata_from_server();

    Rsed.assert && ((typeof data.propMeshes !== "undefined") &&
                    (typeof data.propLocations !== "undefined") &&
                    (typeof data.propNames !== "undefined"))
                || Rsed.throw("Missing properties in prop metadata.");

    // Filter out comments and other auxiliary info from the JSON data; and sort by the relevant
    // index, so we can access the xth element with [x].
    const propNames = data.propNames.filter(m=>(typeof m.propId !== "undefined"))
                                    .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));

    const propMeshes = data.propMeshes.filter(m=>(typeof m.propId !== "undefined"))
                                      .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));

    const trackPropLocations = data.propLocations.filter(m=>(typeof m.trackId !== "undefined"))
                                                 .sort((a, b)=>((a.trackId === b.trackId)? 0 : ((a.trackId > b.trackId)? 1 : -1)));

    const textureRects = data.propTextureRects.filter(m=>(typeof m.textureId !== "undefined"))
                                              .sort((a, b)=>((a.textureId === b.textureId)? 0 : ((a.textureId > b.textureId)? 1 : -1)));

    // The assumed width of the prop texture atlas.
    const textureAtlasWidth = 128;

    // Pre-compute the individual prop textures.
    const prebakedPropTextures = (new Array(textureRects.length)).fill().map((tex, idx)=>generate_prop_texture(idx));

    // Pre-compute prop meshes. Each mesh will be an object with the following form:
    //
    //     {
    //         ngons:
    //         [
    //             {
    //                 fill:
    //                 {
    //                     type: "color" | "texture",
    //                     idx: ...
    //                 }
    //                 vertices:
    //                 [
    //                     {x: ..., y: ..., z: ...},
    //                     {x: ..., y: ..., z: ...},
    //                     {x: ..., y: ..., z: ...},
    //                     ...
    //                 ]
    //             },
    //             {
    //                 fill: {type: ..., idx: ...}
    //                 vertices: [{...}]
    //             },
    //             ...
    //         ]
    //     }
    //
    // That is, each mesh consists of one or more n-gons, which themselves consist of
    // a fill property, which describes whether the n-gon should be filled with a solid
    // color or a texture (the fill.idx property defines either the color's palette index
    // or the texture's index, depending on the fill type); and a list of the n vertices
    // that define the n-gon.
    //
    const prebakedPropMeshes = (new Array(propMeshes.length)).fill().map((mesh, idx)=>
    {
        const ngons = propMeshes[idx].ngons.map(ngon=>
        {
            const meshNgon =
            {
                fill: Object.freeze(
                {
                    type: ngon.fill.type.slice(),
                    idx: ngon.fill.idx
                }),
                vertices: ngon.vertices.map(vert=>(Object.freeze(
                {
                    x: vert.x,
                    y: -vert.y,
                    z: -vert.z
                }))),
            };

            Object.freeze(meshNgon.vertices);

            return meshNgon;
        });

        // Pre-sort the mesh's ngons by depth, so that during rendering, we don't need to depth-
        // sort them every frame.
        ngons.sort((ngonA, ngonB)=>
        {
            const depthA = ngonA.vertices.reduce((depth, z)=>(depth + z)) / ngonA.vertices.length;
            const depthB = ngonB.vertices.reduce((depth, z)=>(depth + z)) / ngonB.vertices.length;

            return ((depthA === depthB)? 0 : ((depthA < depthB)? 1 : -1));
        });

        return {ngons};
    });

    const publicInterface =
    {
        mesh: Object.freeze(prebakedPropMeshes),
        texture: prebakedPropTextures,

        // Copies the given texture's data over the prop texture at the given index.
        // This causes the current texture to be re-generated; a reference to the
        // new texture object is returned.
        copy_texture_data: function(textureIdx = 0, srcTexture)
        {
            Rsed.throw_if_not_type("number", textureIdx);

            if ((srcTexture.width !== textureRects[textureIdx].rect.width) ||
                (srcTexture.height !== textureRects[textureIdx].rect.height))
            {
                Rsed.throw("Invalid prop texture dimensions for copying.")
            }

            for (let y = 0; y < srcTexture.height; y++)
            {
                for (let x = 0; x < srcTexture.width; x++)
                {
                    const dataIdx = ((textureRects[textureIdx].rect.topLeft.x + x) +
                                     (textureRects[textureIdx].rect.topLeft.y + y) *
                                     textureAtlasWidth);

                    textureAtlas[dataIdx] = srcTexture.indices[x + y * srcTexture.width];
                }
            }

            // Regenerate this texture to incorporate the changes we've made to the
            // master data array.
            prebakedPropTextures[textureIdx] = generate_prop_texture(textureIdx);

            return prebakedPropTextures[textureIdx];
        },

        name: (propId = 0)=>
        {
            Rsed.assert && ((propId >= 0) &&
                            (propId < propMeshes.length))
                        || Rsed.throw("Querying a prop mesh out of bounds (" + propId + ").");

            return propNames[propId].name;
        },

        names: ()=>
        {
            return propNames.map(nameObj=>nameObj.name);
        },

        // Returns the id of a prop with the supplied name. Throws if no such prop was found.
        id_for_name: (propName = "")=>
        {
            const idx = propNames.map(nameObj=>nameObj.name).indexOf(propName);

            Rsed.assert && (idx !== -1)
                        || Rsed.throw("Failed to find a prop called " + propName + ".");

            return propNames[idx].propId;
        },

        // Moves the propIdx'th prop on the given track by the given delta.
        move: (trackId = 0, propIdx = 0, delta = {x:0,y:0,z:0})=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            const currentLocation = trackPropLocations[trackId].locations[propIdx];

            delta =
            {
                ...{x:0,y:0,z:0},
                ...delta,
            };

            Rsed.ui.undoStack.mark_dirty_props();
            currentLocation.x = clamped_to_prop_margins(currentLocation.x + delta.x);
            currentLocation.y = (currentLocation.y + delta.y);
            currentLocation.z = clamped_to_prop_margins(currentLocation.z + delta.z);
        },

        remove: (trackId = 0, propIdx = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            /// TODO: Finish lines should not be user-removable; so we do a little string comparison
            /// kludge to ensure that doesn't happen. A more elegant implementation would ideally
            /// be substituted.
            if (propNames[trackPropLocations[trackId].locations[propIdx].propId].name.startsWith("finish"))
            {
                Rsed.alert("The finish line can't be removed.");

                // Prevent the same input from registering again next frame, before
                // the user has had time to release the mouse button.
                Rsed.ui.inputState.reset_mouse_buttons_state();

                return;
            }

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations.splice(propIdx, 1);
        },

        // Assigns a new location to the propIdx'th prop on the given track.
        set_prop_location: (trackId = 0, propIdx = 0, location = {x:0,y:0,z:0})=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            location =
            {
                ...
                {
                    x: trackPropLocations[trackId].locations[propIdx].x,
                    y: trackPropLocations[trackId].locations[propIdx].y,
                    z: trackPropLocations[trackId].locations[propIdx].z,
                },
                ...location,
            }

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations[propIdx].x = location.x;
            trackPropLocations[trackId].locations[propIdx].y = location.y;
            trackPropLocations[trackId].locations[propIdx].z = location.z;
        },

        // Set the number of props on the given track. Props whose index value is higher than this
        // count will be deleted. Note that this function is for RallySportED Loader pre-v.5.
        set_count: (trackId = 0, newPropCount = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((newPropCount >= 1) &&
                            (newPropCount <= trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Trying to set a new prop count out of bounds.");

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations.length = newPropCount;
        },

        // Set the number of props on the given track. For RallySportED Loader v.5.
        set_count__loader_v5: (trackId = 0, newPropCount = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((newPropCount >= 1) &&
                            (newPropCount <= Rsed.constants.maxPropCount))
                        || Rsed.throw("Trying to set a new prop count out of bounds.");

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations = new Array(newPropCount).fill().map(e=>({x:0, y:0, z:0, propId: 0}));
        },

        reset_count: (trackId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations.length = 0;
        },

        change_prop_type: (trackId = 0, propIdx = 0, newPropId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations[propIdx].propId = newPropId;
        },

        num_props_on_track: (trackId = 0)=>
        {
            return trackPropLocations[trackId].locations.length;
        },

        add_location: (trackId = 0, newPropId = 0, location = {x:0,y:0,z:0})=>
        {
            if (trackPropLocations[trackId].locations.length >= Rsed.constants.maxPropCount)
            {
                Rsed.alert("Maximum number of props already in use. Remove some to add more.");
                return;
            }

            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((newPropId >= 0) &&
                            (newPropId < propNames.length))
                        || Rsed.throw("Querying a prop id out of bounds.");

            location =
            {
                ...
                {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                ...location,
            }

            Rsed.ui.undoStack.mark_dirty_props();
            trackPropLocations[trackId].locations.push(
            {
                propId: newPropId,
                x: clamped_to_prop_margins(location.x),
                y: location.y,
                z: clamped_to_prop_margins(location.z),
            });
        },

        // Returns by value the locations of all the props on the given track.
        locations_of_props_on_track: (trackId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            return Object.freeze(trackPropLocations[trackId].locations.map(loc=>(
            {
                propId: loc.propId,
                x: loc.x,
                y: loc.y,
                z: loc.z
            })));
        },
    };

    return publicInterface;

    function generate_prop_texture(idx)
    {
        const width = textureRects[idx].rect.width;
        const height = textureRects[idx].rect.height;
        const pixels = [];
        const indices = [];

        // Copy the texture's pixel region from the texture atlas.
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const dataIdx = ((textureRects[idx].rect.topLeft.x + x) + (textureRects[idx].rect.topLeft.y + y) * textureAtlasWidth);

                indices.push(textureAtlas[dataIdx]);
                pixels.push(Rsed.visual.palette.color_at_idx(textureAtlas[dataIdx], true));
            }
        }

        return Rsed.visual.texture(
        {
            width,
            height,
            pixels: pixels,
            indices: indices,
            flipped: "no",
            set_pixel_at: function(x = 0, y = 0, newColorIdx = 0)
            {
                const texelIdx = ((textureRects[idx].rect.topLeft.x + x) +
                                  (textureRects[idx].rect.topLeft.y + y) *
                                  textureAtlasWidth);

                Rsed.ui.undoStack.mark_dirty_texture("props", idx);
                textureAtlas[texelIdx] = newColorIdx;

                // Regenerate this texture to incorporate the changes we've made to the
                // master data array.
                prebakedPropTextures[idx] = generate_prop_texture(idx);

                // Return the updated reference to this texture:
                return prebakedPropTextures[idx];
            },
        });
    }

    // Clamp the given value (expected to be track tile units) so that it doesn't exceed the
    // track prop margins. (E.g. if the track is 128 tiles wide and the margin is 2 tiles, a
    // value of 132 would be clamped to 126; and a value of -5 to 2.)
    function clamped_to_prop_margins(value)
    {
        const min = (Rsed.constants.propTileMargin * Rsed.constants.groundTileSize);
        const max = ((Rsed.core.current_project().maasto.width - Rsed.constants.propTileMargin) * Rsed.constants.groundTileSize);

        return Rsed.clamp(value, min, max);
    }

    // Prop metadata includes vertex data, texture UV coordinates, display names, etc. of
    // track props.
    async function fetch_prop_metadata_from_server()
    {
        return fetch("./client/assets/track-props.json")
               .then(response=>
               {
                   if (response.status !== 200)
                   {
                       throw "Failed to fetch prop metadata from the RallySportED-js server.";
                   }

                   return response.json();
               })
               .catch(error=>{ Rsed.throw(error); });
    }
}
