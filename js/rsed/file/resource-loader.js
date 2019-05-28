/*
 * Most recent known filename: js/file/resource-loader.js
 *
 * Tarpeeksi Hyvae Soft 2018, 2019 /
 * RallySportED-js
 * 
 * Loads data from various resource files related to Rally-Sport and RallySportED.
 *
 */

"use strict";

const resource_loader_n = (function()
{
    // The names of the types of binary resources we recognize.
    // Any binary resource we're asked to load must be one of these types.
    const binaryResourceTypes = Object.freeze(["palat",
                                               "maasto",
                                               "varimaa",
                                               "kierros",
                                               "track-header",
                                               "prop-textures",
                                               "rsed-project-zip"]);

    // The names of the types of JSON resources we recognize.
    // Any JSON resource we're asked to load must be one of these types.
    const jsonResourceTypes = Object.freeze(["prop-meshes",
                                             "prop-locations"]);

    // Takes in a JSON object describing the locations of each track's props; for instance,
    //
    //   "tracks":
    //   [
    //      {
    //         "trackId": 1,
    //         "props":
    //         [
    //            {"name": "finish(normal)", "x": 3328, "y": 0, "z": 2016},
    //            {"name": "tree", "x": 3500, "y": 0, "z": 3872}
    //         ]
    //      }
    //   ]
    //
    // and adds them into RallySportED.
    //
    function load_prop_locations(data = Object)
    {
        k_assert((data.tracks != null), "Expected a JSON object containing track prop locations.");
        data.tracks.forEach(track=>
        {
            k_assert((track.props != null), "Expected a JSON object containing track prop locations.");
            track.props.forEach(prop=>
            {
                Rsed.maasto_n.add_prop_location(track.trackId, prop.name, prop.x, prop.y, prop.z);
            });
        });
    }

    // Takes in a JSON object describing the 3d mesh data of each track's props; for instance,
    //
    //   "props":
    //   [
    //      {
    //         "displayName": "tree",
    //         "propId": 3492597896,
    //         "polygons":
    //         [
    //            {"textureIdx": null, "paletteIdx": 15, "verts": [-21, -500, 12, 21, -500, -12, 60, -550, -38, -15, -550, -63]},
    //            {"textureIdx": null, "paletteIdx": 14, "verts": [-15, -550, -63, 60, -550, -38, 0, -425, -138]}
    //         ]
    //      }
    //   ]
    //
    // and converts these meshes into RallySportED's mesh format for rendering.
    //
    function load_prop_meshes(data = Object)
    {
        k_assert((data.props != null), "Expected a JSON object containing prop meshes.");
        data.props.forEach(prop=>
        {
            const convertedPolygons = [];

            k_assert((prop.polygons != null), "Encountered a track prop with no polygons.");
            prop.polygons.forEach(propPoly=>
            {
                const numVertices = (propPoly.verts.length / 3);
                const convertedPoly = new Rsed.geometry_n.polygon_o(numVertices);

                convertedPoly.texture = Rsed.props_n.prop_texture(propPoly.textureIdx);
                convertedPoly.color = Rsed.palette_n.palette_idx_to_rgba(propPoly.paletteIdx);

                k_assert((convertedPoly.v.length === numVertices), "Incorrect number of vertices in prop polygon.");
                convertedPoly.v.forEach((vertex, idx)=>
                {
                    vertex.x = propPoly.verts[idx*3];
                    vertex.y = -propPoly.verts[idx*3+1];
                    vertex.z = -propPoly.verts[idx*3+2];
                });

                convertedPolygons.push(convertedPoly);
            });

            Rsed.props_n.add_prop_mesh(prop.displayName, convertedPolygons);
        });
    }

    // Takes in a byte array describing the current track's header; and loads it into
    // RallySportED. For information about Rally-Sport's track headers, refer to the
    // documentation on Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
    function load_track_header(data = Uint8Array)
    {
        // Track checkpoint.
        {
            const byteOffs = ((Rsed.rsed_n.underlying_track_id() - 1) * 18);
            const checkpointX = (data[byteOffs + 13] * 2);
            const checkpointY = (data[byteOffs + 15] * 2);
            Rsed.maasto_n.set_checkpoint_pos(checkpointX, checkpointY);
        }
    }

    // Takes in a byte array providing track prop textures' pixel data; and creates a copy
    // of the data converted into RallySportED's texture format for use in rendering. For
    // information about Rally-Sport's prop textures, refer to the documentation on Rally-
    // Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
    function load_prop_textures(data = Uint8Array)
    {
        let idx = 0;
        const numTextures = data[idx++];

        for (let i = 0; i < numTextures; i++)
        {
            const texture = new Rsed.texture_n.texture_o();
            texture.width = data[idx++];
            texture.height = data[idx++];

            for (let t = 0; t < (texture.width * texture.height); t++)
            {
                let paletteIdx = data[idx++];
                if (paletteIdx < 0 || paletteIdx > 31) paletteIdx = 0;

                texture.pixels.push(Rsed.palette_n.palette_idx_to_rgba(paletteIdx));
                texture.paletteIndices.push(paletteIdx);
            }

            Rsed.props_n.add_prop_texture(texture);
        }
    }

    const publicInterface = {};
    {
        // Loads a RallySportED project's data from file, and feeds it to the given callback
        // function.
        publicInterface.load_project_data = function(args = {}, returnCallback)
        {
            k_assert((returnCallback instanceof Function), "Expected to receive a callback function.");

            const projectData = {};

            // Get the data from a zip file.
            if (args.fromZip)
            {
                const zipContents = new JSZip();

                zipContents.loadAsync(args.zipFile)
                .then(()=>
                {
                    // Parse the zip file's contents. We'll require that it contains exactly one directory, which stores
                    // the project's $FT and DTA files.
                    const files = [];
                    {
                        const dirs = [];
                        zipContents.forEach((path, entry)=>
                        {
                            if (entry.dir)
                            {
                                dirs.push(entry);
                            }
                            else files.push(entry);
                        });

                        if (dirs.length != 1)
                        {
                            alert("The RallySportED project zip file must contain at least one directory under which the project's .DTA and .$FT files are found.");
                            return;
                        }

                        projectData.name = dirs[0].name.slice(0, -1).toLowerCase();

                        switch (projectData.name)
                        {
                            // For the original Rally-Sport tracks, have display names that reflect the in-game names
                            // rather than the project names (like "demoa", "demob", ...).
                            case "demoa": projectData.displayName = "Nurtsi-cruising"; break;
                            case "demob": projectData.displayName = "Vesistövedätys"; break;
                            case "democ": projectData.displayName = "Ralli-cross"; break;
                            case "demod": projectData.displayName = "Yleisö-ek"; break;
                            case "demoe": projectData.displayName = "Very slippery.."; break;
                            case "demof": projectData.displayName = "You asked it.."; break;
                            case "demog": projectData.displayName = "Bumps and jumps"; break;
                            case "demoh": projectData.displayName = "Short and easy"; break;

                            // Otherwise, use the project name as the display name.
                            default: projectData.displayName = (projectData.name.charAt(0).toUpperCase() + projectData.name.slice(1));
                        }

                        // Find the project's $FT and DTA files inside the zip file.
                        let manifestoFile = null, dtaFile = null;
                        {
                            files.forEach(file=>
                            {
                                if (manifestoFile && dtaFile) return;

                                const suffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
                                const basePath = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
                                const baseName = basePath.slice(basePath.lastIndexOf("/") + 1);

                                // Each resource file is expected to hold the same name as the project itself.
                                if (baseName !== projectData.name) return;

                                switch (suffix)
                                {
                                    case "$ft": manifestoFile = file; break;
                                    case "dta": dtaFile = file; break;
                                    default: break;
                                }
                            });

                            if (!manifestoFile || !dtaFile)
                            {
                                alert("The given RallySportED project zip file didn't contain all of the required .DTA and .$FT files.");
                                return;
                            }
                        }

                        // Extract the project's $FT and DTA files from the zip file.
                        (async()=>
                        {
                            projectData.manifestoData = await manifestoFile.async("string");
                            projectData.dtaData = await dtaFile.async("arraybuffer");

                            returnCallback(projectData);
                        })();
                    }
                })
                .catch((error)=>{k_assert(0, "Failed to extract project data (JSZip error: '" + error + "').");});
            }
            else
            {
                k_assert(0, "Unknown file format for loading project data.");
            }
        }

        // Takes in a byte array containing a Rally-Sport's track textures' pixel data; and
        // loads it into RallySportED. For information about Rally-Sport's track textures,
        // refer to the documentation on Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
        publicInterface.load_palat_data = function(bytes)
        {
            // The dimensions of a single texture.
            const palaWidth = 16;
            const palaHeight = 16;

            // How many textures we expect to receive.
            const numPalas = 256;

            k_assert((bytes.byteLength === (numPalas * palaWidth * palaHeight)), "Incorrect number of bytes for PALA data.");

            // Add each PALA as an individual texture.
            for (let i = 0; i < numPalas; i++)
            {
                const texture = new Rsed.texture_n.texture_o();

                texture.width = palaWidth;
                texture.height = palaHeight;

                for (let y = (palaHeight - 1); y >= 0; y--) // Iterate backwards to flip the texture on y.
                {
                    for (let x = 0; x < palaWidth; x++)
                    {
                        let paletteIdx = bytes[(x + y * palaWidth) + (i * (palaWidth * palaHeight))];
                        if ((paletteIdx < 0) || (paletteIdx > 31)) paletteIdx = 0;

                        texture.pixels.push(Rsed.palette_n.palette_idx_to_rgba(paletteIdx));
                        texture.paletteIndices.push(paletteIdx);
                    }
                }

                Rsed.palat_n.add_pala(texture);
            }

            // Create an image containing thumbnails of all the textures we loaded.
            Rsed.ui_draw_n.prebake_palat_pane();
        }

        // Takes in a byte array containing a track's tilemap; and loads it into RallySportED.
        // For information about Rally-Sport's track tilemaps, refer to the documentation on
        // Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
        publicInterface.load_varimaa_data = function(bytes)
        {
            const tilesPerSide = Math.sqrt(bytes.byteLength);
            k_assert(((tilesPerSide === 64) || (tilesPerSide === 128)), "Unsupported VARIMAA size.");

            // Verify the data.
            for (let i = 0; i < bytes.byteLength; i++)
            {
                k_assert((Number.isInteger(bytes[i])), "Detected invalid VARIMAA data.");
                k_assert((bytes[i] >= 0 && bytes[i] <= 255), "Detected invalid VARIMAA data.");
            }

            Rsed.maasto_n.set_varimaa(tilesPerSide, bytes);
        }

        // Takes in a byte array containing a track's heightmap; and loads it into RallySportED.
        // For information about Rally-Sport's track heightmaps, refer to the documentation on
        // Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
        publicInterface.load_maasto_data = function(bytes)
        {
            const tilesPerSide = Math.sqrt(bytes.byteLength / 2);
            k_assert(((tilesPerSide === 64) || (tilesPerSide === 128)), "Unsupported MAASTO size.");

            // Convert Rally-Sport's two-byte height format into RallySportED's single values.
            const convertedHeightmap = [];
            for (let i = 0; i < (bytes.byteLength / 2); i++)
            {
                const b1 = bytes[i*2];
                const b2 = bytes[i*2+1];

                const height = (b2 === 1)? (-256 - b1)  // More than -255 below ground level.
                                         : (b2 - b1);   // Above ground when b2 == 255, otherwise below ground.

                convertedHeightmap.push(height);
            }

            k_assert((convertedHeightmap.length === (tilesPerSide * tilesPerSide)), "Detected an invalid MAASTO height conversion.");

            Rsed.maasto_n.set_maasto(tilesPerSide, convertedHeightmap);
        }

        // Loads from a JSON file resources of the given type.
        publicInterface.load_json_resource = function(filename = "", resourceType = "")
        {
            k_assert(((typeof filename === "string") && (filename.length > 0)), "Expected a non-null filename string.");
            k_assert(jsonResourceTypes.includes(resourceType), "Expected a valid resource type.");

            return new Promise((resolve, reject)=>
            {
                fetch(filename)
                .then((response)=>response.json())
                .then((data)=>
                {
                    switch (resourceType)
                    {
                        case "prop-meshes": load_prop_meshes(data); break;
                        case "prop-locations": load_prop_locations(data); break;
                        default: k_assert(0, "Unknown resource type."); reject(); break;
                    }
                    
                    resolve();
                })
                .catch((error)=>{k_assert(0, "Failed to fetch resource file " + filename + ". Error: " + error)});
            });
        }

        // Loads from a binary file resources of the given type; returning a promise resolved once the
        // data has been loaded and processed. The receptacle is an object that can receive from this
        // function the raw data loaded from file (without subsequent processing by this function), and
        // is required for some of the resource types.
        publicInterface.load_binary_resource = function(filename = "", resourceType = "", receptacle)
        {
            k_assert((filename.length > 0), "Expected a non-empty string.");
            k_assert(binaryResourceTypes.includes(resourceType), "Expected a valid resource type.");

            return new Promise((resolve, reject)=>
            {
                fetch(filename)
                .then((response)=>response.arrayBuffer())
                .then((dataBuffer)=>
                {
                    const bytes = new Uint8Array(dataBuffer);
                    k_assert((bytes != null), "Received invalid binary file data.");

                    switch (resourceType)
                    {
                        case "rsed-project-zip": receptacle(bytes); break;
                        case "track-header": load_track_header(bytes); break;
                        case "prop-textures": load_prop_textures(bytes); break;
                        case "palat": publicInterface.load_palat_data(bytes); break;
                        case "maasto": publicInterface.load_maasto_data(bytes); break;
                        case "varimaa": publicInterface.load_varimaa_data(bytes); break;
                        default: k_assert(0, "Unknown resource type."); reject(); break;
                    }

                    resolve();
                })
                .catch((error)=>{k_assert(0, "Failed to fetch resource file " + filename + ". Error: " + error)});
            });
        }
    }
    return publicInterface;
})();
