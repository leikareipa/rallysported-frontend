/*
 * Most recent known filename: js/resource_loader.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Loads data from various resource files related to Rally-Sport and RallySportED.
 *
 */

"use strict"

const resource_loader_n = (function()
{
    // The names of the types of resources we recognize. Any resource we're asked to load must be one
    // of these types.
    const binaryResourceTypes = Object.freeze(["rsed-project-zip", "palat", "maasto", "varimaa", "kierros", "prop-textures", "track-header"]);
    const jsonResourceTypes = Object.freeze(["prop-meshes", "prop-locations", "track-database"]);

    function load_prop_locations(data, receptacle)
    {
        k_assert((data.tracks != null), "Expected data with track props info.");

        for (let i = 0; i < data.tracks.length; i++)
        {
            const track = data.tracks[i];
            for (let p = 0; p < track.props.length; p++)
            {
                const prop = track.props[p];
                maasto_n.add_prop_location(track.id, prop.name, prop.x, prop.y, prop.z);
            }
        }
    }

    function load_prop_meshes(data)
    {
        k_assert((data.props != null), "Expected data with prop meshes.");

        for (let i = 0; i < data.props.length; i++)
        {
            const prop = data.props[i];
            
            const polys = [];
            for (let p = 0; p < prop.polygons.length; p++)
            {
                const jsonPoly = prop.polygons[p];

                const numVertices = (jsonPoly.verts.length / 3);
                const polygon = new geometry_n.polygon_o(numVertices);
                polygon.texture = props_n.prop_texture(jsonPoly.texture);
                polygon.color = palette_n.palette_idx_to_rgba(jsonPoly.color);

                for (let v = 0; v < numVertices; v++)
                {
                    polygon.v[v].x = jsonPoly.verts[v*3];
                    polygon.v[v].y = -jsonPoly.verts[v*3+1];
                    polygon.v[v].z = -jsonPoly.verts[v*3+2];
                }

                polys.push(polygon);
            }

            props_n.add_prop_mesh(prop.name, polys);
        }
    }

    const publicInterface = {};
    {
        publicInterface.get_project_data = function(args = {}, callbackFn)
        {
            k_assert((callbackFn instanceof Function), "Expected a callback function.");

            const projectData = {};

            if (args.fromZip)
            {
                const zipContents = new JSZip();
                zipContents.loadAsync(args.zipFile)
                .then(()=>
                {
                    // Parse the zip file's contents. We'll require that it contains exactly one directory, which stores
                    // the project's manifesto and dta files.
                    const files = [];
                    {
                        const dirs = [];

                        zipContents.forEach(function(path, entry)
                        {
                            if (entry.dir) dirs.push(entry);
                            else files.push(entry);
                        });

                        if (dirs.length != 1)
                        {
                            alert("The RallySportED project zip file must contain at least one directory under which the project's .DTA and .$FT files are found.");
                            return;
                        }

                        projectData.name = dirs[0].name.slice(0, -1).toLowerCase();

                        // For original Rally-Sport tracks, have a display names that reflect the tracks' in-game names.
                        switch (projectData.name)
                        {
                            case "demoa": projectData.displayName = "Nurtsi-cruising"; break;
                            case "demob": projectData.displayName = "Vesistövedätys"; break;
                            case "democ": projectData.displayName = "Ralli-cross"; break;
                            case "demod": projectData.displayName = "Yleisö-ek"; break;
                            case "demoe": projectData.displayName = "Very slippery.."; break;
                            case "demof": projectData.displayName = "You asked it.."; break;
                            case "demog": projectData.displayName = "Bumps and jumps"; break;
                            case "demoh": projectData.displayName = "Short and easy"; break;
                            default: projectData.displayName = (projectData.name.charAt(0).toUpperCase() + projectData.name.slice(1));
                        }

                        // Grab the required project files.
                        let manifestoFile = null, dtaFile = null;
                        {
                            for (let i = 0; i < files.length; i++)
                            {
                                const file = files[i];

                                // Decide the type of the file based on its suffix.
                                const suffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
                                const baseName = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
                                switch (suffix)
                                {
                                    case "$ft":
                                    {
                                        if (manifestoFile != null)
                                        {
                                            alert("The given RallySportED project zip file contains more then one .$FT file. That's not good.");
                                            return;
                                        }

                                        manifestoFile = file;
                                        manifestoFile.baseName = baseName;

                                        break;
                                    }
                                    case "dta":
                                    {
                                        if (dtaFile != null)
                                        {
                                            alert("The given RallySportED project zip file contains more than one .DTA file. That's not good.");
                                            return;
                                        }

                                        dtaFile = file;
                                        dtaFile.baseName = baseName
                                        
                                        break;
                                    }
                                    default: break;
                                }
                            }

                            if ((manifestoFile == null) && (dtaFile == null))
                            {
                                alert("The given RallySportED project zip file didn't contain the required .DTA and .$FT files.");
                                return;
                            }

                            if (!(manifestoFile.name.toLowerCase().startsWith(projectData.name) &&
                                dtaFile.name.toLowerCase().startsWith(projectData.name)))
                            {
                                alert("The given RallySportED project has mismatched file names. Can't load it.");
                                return;
                            }
                        }

                        // Extract the project data from the zip file.
                        /// FIXME: This code's pretty unsightly.
                        {
                            manifestoFile.async("string")
                            .then((manifestoData)=>
                            {
                                projectData.manifestoData = manifestoData;

                                dtaFile.async("arraybuffer")
                                .then((dtaData)=>
                                {
                                    projectData.dtaData = dtaData;

                                    callbackFn(projectData);
                                });
                            });
                        }
                    }
                })
                .catch((error)=>{k_assert(0, "Failed to extract project data (JSZip error: '" + error + "').");});
            }
        }

        publicInterface.load_track_header = function(bytes)
        {
            // Track checkpoint.
            const byteOffs = ((rsed_n.underlying_track_id() - 1) * 18);
            const checkpointX = (bytes[byteOffs + 13] * 2);
            const checkpointY = (bytes[byteOffs + 15] * 2);
            maasto_n.set_checkpoint_pos(checkpointX, checkpointY);
        }

        publicInterface.load_prop_textures = function(bytes)
        {
            let idx = 0;
            const numTextures = bytes[idx++];
    
            // Add each PALA as an individual texture.
            for (let i = 0; i < numTextures; i++)
            {
                const texture = new texture_n.texture_o();
                texture.width = bytes[idx++];
                texture.height = bytes[idx++];
    
                for (let t = 0; t < (texture.width * texture.height); t++)
                {
                    let paletteIdx = bytes[idx++];
                    if (paletteIdx < 0 || paletteIdx > 31) paletteIdx = 0;
    
                    texture.pixels.push(palette_n.palette_idx_to_rgba(paletteIdx));
                    texture.paletteIndices.push(paletteIdx);
                }
    
                props_n.add_prop_texture(texture);
            }
        }

        publicInterface.load_palat_data = function(bytes, receptacle)
        {
            const palaW = 16;
            const palaH = 16;
            const numPalas = 256;
            k_assert((bytes.byteLength === (numPalas * palaW * palaH)), "Incorrect number of bytes for PALA data.");

            // Add each PALA as an individual texture.
            for (let i = 0; i < numPalas; i++)
            {
                const texture = new texture_n.texture_o();
                texture.width = palaW;
                texture.height = palaH;

                for (let y = (palaH - 1); y >= 0; y--) // Iterate backward to flip the image on y.
                {
                    for (let x = 0; x < palaW; x++)
                    {
                        let paletteIdx = bytes[(x + y * palaW) + (i * (palaW * palaH))];
                        if (paletteIdx < 0 || paletteIdx > 31) paletteIdx = 0;

                        texture.pixels.push(palette_n.palette_idx_to_rgba(paletteIdx));
                        texture.paletteIndices.push(paletteIdx);
                    }
                }

                palat_n.add_pala(texture);
            }

            ui_draw_n.prebake_palat_pane();
        }

        publicInterface.load_varimaa_data = function(bytes, receptacle)
        {
            // How many tiles there are per side on the MAASTO. The game should only have maps where
            // the vertical and horizontal sides are equal.
            const sideLen = Math.sqrt(bytes.byteLength);
            k_assert(((sideLen === 64) || (sideLen === 128)), "Unsupported VARIMAA dimensions");

            // Verify the data.
            for (let i = 0; i < bytes.byteLength; i++)
            {
                k_assert((Number.isInteger(bytes[i])), "Detected invalid VARIMAA data.");
                k_assert((bytes[i] >= 0 && bytes[i] <= 255), "Detected invalid VARIMAA data.");
            }

            maasto_n.set_varimaa(sideLen, bytes);
        }

        publicInterface.load_maasto_data = function(bytes, receptacle)
        {
            // How many tiles there are per side on the MAASTO. The game should only have maps where
            // the vertical and horizontal sides are equal.
            const sideLen = Math.sqrt(bytes.byteLength / 2);
            k_assert(((sideLen === 64) || (sideLen === 128)), "Unsupported MAASTO dimensions");

            // Convert Rally-Sport's two-byte height format into single values.
            const heightPoints = [];
            for (let i = 0; i < (bytes.byteLength / 2); i++)
            {
                const b1 = bytes[i*2];
                const b2 = bytes[i*2+1];

                const height = (b2 === 1)? (-256 - b1)  // More than -255 below ground level.
                                         : (b2 - b1);   // Above ground when b2 == 255, otherwise below ground.
                k_assert((Number.isInteger(height)), "Detected invalid height data.");

                heightPoints.push(height);
            }

            k_assert((heightPoints.length === (sideLen * sideLen)), "Incorrect MAASTO height conversion.");
            maasto_n.set_maasto(sideLen, heightPoints);
        }

        publicInterface.fetch_json_resource = function(filename = "", resourceType = "")
        {
            k_assert((filename.length > 0), "Expected a non-empty string.");
            k_assert(jsonResourceTypes.includes(resourceType), "Expected a valid resource type.");

            const request = new XMLHttpRequest();
            function make_file_request()
            {
                return new Promise((resolve, reject) =>
                                    {
                                        request.open("GET", filename);
                                        request.responseType = "json";
                                        request.onload = ()=>resolve();
                                        request.onerror = ()=>{k_assert(0, "Failed to get resource '" + filename + "'.")};
                                        request.send();
                                    });
            };
            function parse_file_data()
            {
                return new Promise((resolve, reject) =>
                {
                    const data = request.response;

                    switch (resourceType)
                    {
                        case "prop-meshes":
                        {
                            load_prop_meshes(data);
                            break;
                        }
                        case "prop-locations":
                        {
                            load_prop_locations(data);
                            break;
                        }
                        case "track-database":
                        {
                            receptacle(data);
                            break;
                        }
                        default: k_assert(0, "Unknown resource type."); reject();
                    }

                    //console.log("Finished loading JSON resource", filename, "(type '" + resourceType +"')");
                    resolve();
                })
            };

            return make_file_request().then(()=>parse_file_data());
        }

        // Attempts to load the given file's data as a binary array buffer. Returns a promise
        // of full completion, i.e. fetching the file's contents, and parsing them into the
        // receptacle. The receptacle is an optional object containing suitable methods for inserting
        // the data once it's been loaded.
        publicInterface.fetch_binary_resource = function(filename = "", resourceType = "", receptacle)
        {
            k_assert((filename.length > 0), "Expected a non-empty string.");
            k_assert(binaryResourceTypes.includes(resourceType), "Expected a valid resource type.");

            const request = new XMLHttpRequest();
            function make_file_request()
            {
                return new Promise((resolve, reject) =>
                {
                    request.open("GET", filename);
                    request.responseType = "arraybuffer";
                    request.onload = ()=>resolve();
                    request.onerror = ()=>{k_assert(0, "Failed to get resource '" + filename + "'.")};
                    request.send();
                });
            };
            function parse_file_data()
            {
                return new Promise((resolve, reject) =>
                {
                    const bytes = new Uint8Array(request.response);
                    k_assert((bytes != null), "Received invalid binary file data.");

                    switch (resourceType)
                    {
                        case "palat":
                        {
                            publicInterface.load_palat_data(bytes);
                            break;
                        }
                        case "maasto":
                        {
                            publicInterface.load_maasto_data(bytes);
                            break;
                        }
                        case "varimaa":
                        {
                            publicInterface.load_varimaa_data(bytes);
                            break;
                        }
                        case "rsed-project-zip":
                        {
                            receptacle(bytes);
                            break;
                        }
                        case "prop-textures":
                        {
                            publicInterface.load_prop_textures(bytes);
                            break;
                        }
                        case "track-header":
                        {
                            publicInterface.load_track_header(bytes);
                            break;
                        }
                        default: k_assert(0, "Unknown resource type."); reject();
                    }

                   // console.log("Finished loading binary resource", filename, "(type '" + resourceType +"')");
                    resolve();
                })
            };

            return make_file_request().then(()=>parse_file_data());
        }
    }
    return publicInterface;
})();
