/*
 * Most recent known filename: js/track/props.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

Rsed.track.props = async function(textureAtlas = Uint8Array)
{
    const data = await fetch_prop_metadata_from_server();

    Rsed.assert && ((typeof data.propMeshes !== "undefined") &&
                    (typeof data.propLocations !== "undefined") &&
                    (typeof data.propNames !== "undefined"))
                || Rsed.throw("Missing properties in prop metadata.");

    // Filter out comments and other auxiliary info from the JSON data; and sort by the relevant
    // index, so we can access the desired element with [x].
    const names = data.propNames.filter(m=>(typeof m.propId !== "undefined"))
                                 .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));

    const meshes = data.propMeshes.filter(m=>(typeof m.propId !== "undefined"))
                                  .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));

    const locations = data.propLocations.filter(m=>(typeof m.trackId !== "undefined"))
                                        .sort((a, b)=>((a.trackId === b.trackId)? 0 : ((a.trackId > b.trackId)? 1 : -1)));

    const textureRects = data.propTextureRects.filter(m=>(typeof m.textureId !== "undefined"))
                                              .sort((a, b)=>((a.textureId === b.textureId)? 0 : ((a.textureId > b.textureId)? 1 : -1)));

    // Manifesto files can manipulate the number of props on a given track; we'll offer
    // that functionality by only returning the first x prop locations on that track.
    locations.maxCount = (new Array(locations.length)).fill().map((e, idx)=>locations[idx].locations.length);
    locations.count = (new Array(locations.length)).fill().map((e, idx)=>locations[idx].locations.length);

    const publicInterface =
    {
        // Returns an object containing the given prop's 3d mesh (with properties copied by
        // value). The mesh object will be of the following form:
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
        mesh: (propId = 0)=>
        {
            Rsed.assert && ((propId >= 0) &&
                            (propId < meshes.length))
                        || Rsed.throw("Querying a prop mesh out of bounds (" + propId + ").");

            return {
                ngons:meshes[propId].ngons.map(ngon=>
                {
                    const meshNgon =
                    {
                        fill:Object.freeze(
                        {
                            type: ngon.fill.type.slice(),
                            idx: ngon.fill.idx
                        }),
                        vertices:ngon.vertices.map(vert=>(Object.freeze(
                        {
                            x: vert.x,
                            y: -vert.y,
                            z: -vert.z
                        }))),
                    };

                    Object.freeze(meshNgon.vertices);

                    return meshNgon;
                }),
            }
        },

        // Returns a by-value copy of the given prop texture.
        texture: (textureId = 0, args = {})=>
        {
            args =
            {
                ...
                {
                    alpha: true,
                    flipped: "vertical",
                },
                ...args
            };
            
            Rsed.assert && ((textureId >= 0) &&
                            (textureId < textureRects.length))
                        || Rsed.throw("Querying a prop texture out of bounds.");

            const width = textureRects[textureId].rect.width;
            const height = textureRects[textureId].rect.height;
            const pixels = [];
            const indices = [];

            // Copy the texture's pixel region from the texture atlas.
            for (let y = 0; y < height; y++)
            {
                for (let x = 0; x < width; x++)
                {
                    const idx = ((textureRects[textureId].rect.topLeft.x + x) + (textureRects[textureId].rect.topLeft.y + y) * 128);

                    indices.push(textureAtlas[idx]);
                    pixels.push(Rsed.palette_n.palette_idx_to_rgba(textureAtlas[idx]));
                }
            }

            return Rsed.texture(
            {
                width,
                height,
                pixels: pixels,
                indices: indices,
                ...args,
            });
        },

        name: (propId = 0)=>
        {
            Rsed.assert && ((propId >= 0) &&
                            (propId < meshes.length))
                        || Rsed.throw("Querying a prop mesh out of bounds (" + propId + ").");

            return names[propId].name;
        },

        names: ()=>
        {
            return names.map(nameObj=>nameObj.name);
        },

        // Returns the id of a prop with the supplied name. Throws if no such prop was found.
        id_for_name: (propName = "")=>
        {
            const idx = names.map(nameObj=>nameObj.name).indexOf(propName);

            Rsed.assert && (idx !== -1)
                        || Rsed.throw("Failed to find a prop called " + propName + ".");

            return names[idx].propId;
        },

        // Moves the propIdx'th prop on the given track by the given delta.
        move: (trackId = 0, propIdx = 0, delta = {x:0,y:0,z:0})=>
        {
            // For now, shared mode doesn't support moving props.
            if (Rsed.shared_mode_n.enabled()) return;

            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < locations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            const currentLocation = locations[trackId].locations[propIdx];

            delta =
            {
                ...{x:0,y:0,z:0},
                ...delta,
            };

            currentLocation.x = clamped_to_track_prop_boundaries(currentLocation.x + delta.x);
            currentLocation.y = (currentLocation.y + delta.y);
            currentLocation.z = clamped_to_track_prop_boundaries(currentLocation.z + delta.z);

            function clamped_to_track_prop_boundaries(value)
            {
                const min = (Rsed.constants.propTileMargin * Rsed.constants.groundTileSize);
                const max = ((Rsed.main_n.project().maasto.width - Rsed.constants.propTileMargin) * Rsed.constants.groundTileSize);

                return Rsed.clamp(value, min, max);
            }
        },

        // Assigns a new location to the propIdx'th prop on the given track.
        set_prop_location: (trackId = 0, propIdx = 0, location = {x:0,y:0,z:0})=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId < 8))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < locations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            location =
            {
                ...
                {
                    x: locations[trackId].locations[propIdx].x,
                    y: locations[trackId].locations[propIdx].y,
                    z: locations[trackId].locations[propIdx].z,
                },
                ...location,
            }

            locations[trackId].locations[propIdx].x = location.x;
            locations[trackId].locations[propIdx].y = location.y;
            locations[trackId].locations[propIdx].z = location.z;
        },

        set_prop_count: (trackId = 0, newPropCount = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId < 8))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((newPropCount >= 0) &&
                            (newPropCount < locations.maxCount[trackId]))
                    || Rsed.throw("Trying to set a new prop count out of bounds.");

            locations.count[trackId] = newPropCount;
        },

        change_prop_type: (trackId = 0, propIdx = 0, newPropId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId < 8))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < locations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            locations[trackId].locations[propIdx].propId = newPropId;

            console.log(trackId, propIdx, newPropId, locations[trackId].locations[propIdx].propId)
        },

        // Returns by value the locations of all the props on the given track.
        locations_of_props_on_track: (trackId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId < 8))
                        || Rsed.throw("Querying a track out of bounds.");

            return Object.freeze(locations[trackId].locations.slice(0, locations.count[trackId]).map(loc=>(
            {
                propId: loc.propId,
                x: loc.x,
                y: loc.y,
                z: loc.z
            })));
        },
    };

    return publicInterface;

    async function fetch_prop_metadata_from_server()
    {
        return fetch("server/get-prop-metadata.php")
               .then(response=>
               {
                   if (!response.ok)
                   {
                       throw "A GET request to the server failed.";
                   }

                   return response.json();
               })
               .then(ticket=>
               {
                   if (!ticket.valid || (typeof ticket.data === "undefined"))
                   {
                       throw ("The server sent a GET ticket marked invalid. It said: " + ticket.message);
                   }

                   return JSON.parse(ticket.data);
               })
               .catch(error=>{ Rsed.throw(error); });
    }
}
