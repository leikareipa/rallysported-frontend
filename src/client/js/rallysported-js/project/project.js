/*
 * Most recent known filename: js/project/project.js
 *
 * 2018-2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// A RallySportED project is a collection of assets for a particular Rally-Sport track that
// the user can modify using RallySportED. Namely, the project consists of two files: the
// .DTA file (also called the "container"), and the .$FT file (also called the "manifesto").
// The .DTA file is a binary file containing the track's individual assets; like heightmap,
// tilemap, textures, etc. The .$FT file consists of an ASCII string providing commands
// to RallySportED on how to modify certain hard-coded track parameters in Rally-Sport for
// that particular track (e.g. the positioning of certain track-side objects, etc.).
Rsed.project = async function(projectArgs = {})
{
    // Which of the eight tracks in Rally-Sport's demo version this project is for.
    let trackId = null;

    // Which of Rally-Sport's two PALAT files this track uses.
    let palatId = null;

    // Which RallySportED loader is required to load this track.
    let loaderVersion = null;

    const isPlaceholder = false;

    // Rally-Sport uses checkpoints - invisible markers at given x,y tile positions on the
    // track - to keep track of whether the player's car has raced a valid lap. In other
    // words, the car must pass through all of the track's checkpoints in order for the lap
    // to count. The demo version of Rally-Sport - which is what RallySportED targets - makes
    // use of only one checkpoint per track (in addition to the finish line).
    const trackCheckpoints = [];

    // Load the project's data. After this, projectData.container is expected to hold the
    // contents of the .DTA file as a Base64-encoded string; and projectData.manifesto the
    // contents of the .$FT file as a plain string.
    const projectData = await fetch_project_data();

    Rsed.assert && ((typeof projectData.container !== "undefined") &&
                    (typeof projectData.manifesto !== "undefined") &&
                    (typeof projectData.meta !== "undefined") &&
                    (typeof projectData.meta.internalName !== "undefined") &&
                    (typeof projectData.meta.displayName !== "undefined"))
                || Rsed.throw("Missing required project data.");

    Rsed.assert && is_valid_project_base_name()
                || Rsed.throw(`Invalid project base name "${projectData.meta.internalName}".`);

    Rsed.assert && ((projectData.meta.width > 0) &&
                    (projectData.meta.height > 0) &&
                    (projectData.meta.width === projectData.meta.height))
                || Rsed.throw("Invalid track dimensions for a project.");

    // Provides the (Base64-decoded) data of the container file; and metadata about the file,
    // like the sizes and byte offsets of the individual asset data segments inside the file.
    // Note: The variable names here reflect the names of Rally-Sport's data files. For more
    // information, check out RallySportED's documentation on Rally-Sport's data formats at
    // https://github.com/leikareipa/rallysported/tree/master/docs.
    //
    // In brief,
    //
    //     maasto: track heightmap
    //     varimaa: track tilemap
    //     palat: track tile textures
    //     anims: animation frame textures
    //     text: track prop textures
    //
    const projectDataContainer = Object.freeze(
    {
        dataBuffer: (()=>
        {
            const containerDecoded = atob(projectData.container);
            const buffer = new ArrayBuffer(containerDecoded.length);
            const view = new Uint8Array(buffer);
    
            for (let i = 0; i < containerDecoded.length; i++)
            {
                view[i] = containerDecoded.charCodeAt(i);
            };
    
            return buffer;
        })(),

        byteSize: function()
        {
            const maasto  = (new DataView(this.dataBuffer, 0, 4)).getUint32(0, true);
            const varimaa = (new DataView(this.dataBuffer, (maasto + 4), 4)).getUint32(0, true);
            const palat   = (new DataView(this.dataBuffer, (maasto + varimaa + 8), 4)).getUint32(0, true);
            const anims   = (new DataView(this.dataBuffer, (maasto + varimaa + palat + 12), 4)).getUint32(0, true);
            const text    = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + 16), 4)).getUint32(0, true);
            const kierros = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + text + 20), 4)).getUint32(0, true);
            
            return Object.freeze({maasto, varimaa, palat, anims, text, kierros});
        },

        byteOffset: function()
        {
            const byteSize = this.byteSize();

            // The variable names here reflect the names of Rally-Sport's data files.
            const maasto  = 4;
            const varimaa = (maasto  + byteSize.maasto  + 4);
            const palat   = (varimaa + byteSize.varimaa + 4);
            const anims   = (palat   + byteSize.palat   + 4);
            const text    = (anims   + byteSize.anims   + 4);
            const kierros = (text    + byteSize.text    + 4);

            return Object.freeze({maasto, varimaa, palat, anims, text, kierros});
        },
    });

    // Pass relevant segments of the container's data into objects responsible for managing
    // the corresponding individual assets. Note that the data are passed by reference, so
    // modifications made by the objects to the data will be reflected in the container.
    const maasto = Rsed.track.maasto(projectData.meta.width, projectData.meta.height,
                                     new Uint8Array(projectDataContainer.dataBuffer,
                                                    projectDataContainer.byteOffset().maasto,
                                                    projectDataContainer.byteSize().maasto));

    const varimaa = Rsed.track.varimaa(projectData.meta.width, projectData.meta.height,
                                       new Uint8Array(projectDataContainer.dataBuffer,
                                                      projectDataContainer.byteOffset().varimaa,
                                                      projectDataContainer.byteSize().varimaa));

    const palat = Rsed.track.palat(Rsed.constants.palaWidth, Rsed.constants.palaHeight,
                                   new Uint8Array(projectDataContainer.dataBuffer,
                                                  projectDataContainer.byteOffset().palat,
                                                  projectDataContainer.byteSize().palat));

    const props = await Rsed.track.props(new Uint8Array(projectDataContainer.dataBuffer,
                                                        projectDataContainer.byteOffset().text,
                                                        projectDataContainer.byteSize().text));

    const manifesto = projectData.manifesto;

    apply_manifesto();

    Rsed.log("\"" + projectData.meta.displayName + "\" is a valid RallySportED project. " +
             "Its internal name is \"" + projectData.meta.internalName + "\".");

    const publicInterface = Object.freeze(
    {
        isPlaceholder: false,
        name: projectData.meta.displayName,
        internalName: projectData.meta.internalName,
        track_checkpoint: ()=>(trackCheckpoints[0] || {x:0,y:0}),
        maasto,
        varimaa,
        palat,
        props,
        manifesto,
        trackId,
        palatId,
        loaderVersion,

        track_id: ()=>
        {
            Rsed.assert && (trackId !== null)
                        || Rsed.throw("Attempting to access a project's track id before it has been set.");

            return trackId;
        },

        // Bundles the project's data files into a .zip, and has the browser initiate a 'download' of it.
        save_to_disk: async()=>
        {
            const dstFilename = projectData.meta.internalName.toUpperCase();

            Rsed.log(`Saving project "${projectData.meta.displayName}" into ${dstFilename}.ZIP.`);

            // In case something goes wrong and an error gets thrown in some function while saving,
            // we want to catch it here rather than letting the entire app go down, so as to give
            // the user a chance to re-try.
            try
            {
                // The default HITABLE.TXT file (which holds Rally-Sport's top lap times) is stored
                // locally in a zip file. We'll need to deflate its data into an array.
                const hitable = await (async()=>
                {
                    const zipFile = await (new JSZip()).loadAsync(Rsed.project.hitableZip);
                    const hitableFile = zipFile.files["HITABLE.TXT"];

                    return (hitableFile? hitableFile.async("arraybuffer") : null);
                })();

                if (!hitable)
                {
                    throw "Cannot access HITABLE.TXT";
                }

                const dstZip = new JSZip();

                dstZip.file(`${dstFilename}/${dstFilename}.DTA`, projectDataContainer.dataBuffer);
                dstZip.file(`${dstFilename}/${dstFilename}.$FT`, updated_manifesto_string());
                dstZip.file(`${dstFilename}/HITABLE.TXT`, hitable);

                dstZip.generateAsync({type:"blob", compression:"DEFLATE", compressionOptions:{level:1}})
                      .then((blob)=>saveAs(blob, (`${dstFilename}.ZIP`)))
                      .catch((error)=>Rsed.throw(`Error while saving: ${error}.`));
            }
            catch (error)
            {
                Rsed.alert(`Failed to save the project: ${error}`);
            }

            return;
        }
    });
    
    return publicInterface;

    // Returns an updated version of the project's manifesto string, reflecting the project's
    // current status - e.g. positions of track props, which may have been moved by the user
    // since the project was loaded in. The original manifesto string is not changed.
    function updated_manifesto_string()
    {
        const requiredLoaderVersion = 5;
        const manifesto = projectData.manifesto.split("\n").filter(line=>line.trim().length);
        
        // We'll append the new manifesto string here.
        let updatedManifesto = `0 ${trackId + 1} ${palatId + 1} ${requiredLoaderVersion}\n`;

        // Any manifesto commands we won't update will be copied verbatim into the updated
        // version.
        for (let i = 0; i < (manifesto.length - 1); i++)
        {
            const command = Number(manifesto[i].split(" ").shift());

            switch (command)
            {
                // These are the commands we want to update, so we don't copy them.
                case 0:
                case 2:
                case 3:
                case 4:
                case 5: break;

                // These are the commands we won't update, so we just copy then.
                default: updatedManifesto += (manifesto[i] + "\n");
            }
        }

        // Update the various commands according to the current values of their related data.
        { 
            const trackProps = props.locations_of_props_on_track(trackId);

            // Command #2 for the number of props.
            {
                updatedManifesto += ("2 " + trackProps.length + "\n");
            }

            // Command #3 to create and position the track's props.
            {
                for (let i = 0; i < trackProps.length; i++)
                {
                    const globalX = Math.floor((trackProps[i].x / Rsed.constants.groundTileSize) / 2);
                    const globalZ = Math.floor((trackProps[i].z / Rsed.constants.groundTileSize) / 2);

                    const localX = Math.floor((((trackProps[i].x / Rsed.constants.groundTileSize) / 2) - globalX) * 256);
                    const localZ = Math.floor((((trackProps[i].z / Rsed.constants.groundTileSize) / 2) - globalZ) * 256);

                    updatedManifesto += `3 ${trackProps[i].propId + 1} ${globalX} ${globalZ} ${localX} ${localZ}\n`;
                }
            }
        }

        updatedManifesto += "99\n";

        return updatedManifesto;
    }

    // Returns true if the project's base name is valid; false otherwise. The base name is the name
    // with which the project's files will be saved to disk; e.g. if the base name is "test", the
    // project's files will be "test.dta" and "test.$ft".
    function is_valid_project_base_name()
    {
        // The base filename must be between 1 and 8 characters long, and the string must consist
        // of ASCII A-Z characters only.
        return ((typeof projectData.meta !== "undefined") &&
                (typeof projectData.meta.internalName !== "undefined") &&
                (projectData.meta.internalName.length >= 1) &&
                (projectData.meta.internalName.length <= 8) &&
                /^[a-zA-Z]+$/.test(projectData.meta.internalName));
    }

    // Returns the data (container file, manifesto file, and certain metadata) of the
    // given project as an object formatted like so:
    //
    //    {
    //        container: "the contents of the project's binary container file as a Base64-encoded string",
    //        manifesto: "the contents of the prjoect's textual manifesto file as a string",
    //        meta: 
    //        {
    //            // Metadata about the project; like its name, and the dimensions of its track.
    //        }
    //    }
    //
    async function fetch_project_data()
    {
        Rsed.assert && ((typeof projectArgs.dataLocality !== "undefined") &&
                        (typeof projectArgs.contentId !== "undefined"))
                    || Rsed.throw("Missing required parameters for loading a project.");

        const projectData = (projectArgs.dataLocality === "server-rsc")?  (await fetch_project_data_from_rsc_server())[0] :
                            (projectArgs.dataLocality === "server-rsed")? (await fetch_project_data_from_rsed_server())[0] :
                            (projectArgs.dataLocality === "client")?       await load_project_data_from_zip_file() :
                            Rsed.throw("Unknown locality for project data.");

        return projectData;

        async function load_project_data_from_zip_file()
        {
            Rsed.assert && (typeof projectArgs.contentId !== "undefined")
                        || Rsed.throw("Missing required parameters for loading a client-side project.");

            const zip = await (new JSZip()).loadAsync(projectArgs.contentId);

            // The zip file is expected to contain a project's .DTA and .$FT (manifesto) files.
            let manifestoFile = null;
            let dtaFile = null;

            let projectDirName = "undefined";

            // Parse the zip file's contents and extract the project's data.
            {
                const files = Object.values(zip.files).reduce((files, e)=>(e.dir? files : files.concat(e)), []);

                Rsed.assert && (files.length === 3)
                            || Rsed.throw("The given project zip file is malformed. Please re-export it and try again.");

                // File names are expected in the form "XXXX/YYYY.ZZZ", where XXXX is the project
                // name.
                projectDirName = files[0].name.slice(0, files[0].name.indexOf("/")).toLowerCase();

                // Find the project's $FT and DTA files inside the zip file.
                {
                    files.forEach(file=>
                    {
                        if (manifestoFile && dtaFile)
                        {
                            return;
                        }

                        const fileSuffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
                        const fileBasePath = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
                        const fileBaseName = fileBasePath.slice(fileBasePath.lastIndexOf("/") + 1);

                        // Each resource file is expected to hold the same name as the project itself.
                        if (fileBaseName !== projectDirName)
                        {
                            return;
                        }

                        switch (fileSuffix)
                        {
                            case "$ft": manifestoFile = file; break;
                            case "dta": dtaFile = file; break;
                            default: break;
                        }
                    });

                    Rsed.assert && (manifestoFile && dtaFile)
                                || Rsed.throw("The given project zip file is malformed. Please re-export it and try again.")
                }
            }
            
            // Create an object containing the project's data.
            const projectData = {};
            {
                projectData.manifesto = await manifestoFile.async("string");
                projectData.container = await dtaFile.async("arraybuffer");

                // Derive the track's dimensions from the size of the heightmap. (All tracks are assumed
                // square).
                const trackSideLen = Math.sqrt(new Uint32Array(projectData.container, 0, 1)[0] / 2);

                // All tracks in the demo version of Rally-Sport are expected to have either 64 or 128
                // tiles per side.
                Rsed.assert && ([64, 128].includes(trackSideLen))
                            || Rsed.throw("Invalid track dimensions in project file.");

                projectData.meta =
                {
                    displayName: projectDirName,
                    internalName: projectDirName,
                    width: trackSideLen,
                    height: trackSideLen,
                };

                // Encode the .DTA data as Base64.
                const view = new Uint8Array(projectData.container);
                const string = view.reduce((data, byte)=>(data + String.fromCharCode(byte)), "");
                projectData.container = btoa(string);
            }

            return projectData;
        }

        // Loads the project's data from the RallySportED-js server. This server
        // hosts the original tracks from the Rally-Sport demo.
        async function fetch_project_data_from_rsed_server()
        {
            Rsed.assert && (typeof projectArgs.contentId !== "undefined")
                        || Rsed.throw("Missing required parameters for loading project data.");

            const trackName = (()=>
            {
                switch (projectArgs.contentId)
                {
                    case "demoa": return "demo-1";
                    case "demob": return "demo-2";
                    case "democ": return "demo-3";
                    case "demod": return "demo-4";
                    case "demoe": return "demo-5";
                    case "demof": return "demo-6";
                    case "demog": return "demo-7";
                    case "demoh": return "demo-8";
                    default: Rsed.throw("Unknown track name.");
                }
            })();

            const serverResponse = await fetch(`./client/assets/tracks/${trackName}.json`);

            if (serverResponse.status !== 200)
            {
                Rngon.throw("Failed to fetch project data from the RallySportED-js server.");
            }

            return serverResponse.json();
        }

        // Loads the project's data from the Rally-Sport Content server. This
        // server hosts custom, user-made tracks.
        async function fetch_project_data_from_rsc_server()
        {
            Rsed.assert && (typeof projectArgs.contentId !== "undefined")
                        || Rsed.throw("Missing required parameters for loading a server-side project.");

            const serverResponse = await fetch(`${Rsed.constants.rallySportContentURL}/tracks/?id=${projectArgs.contentId}&json=true`);

            if (serverResponse.status !== 200)
            {
                Rngon.throw("Failed to fetch project data from the RallySportED-js server.");
            }

            return serverResponse.json();
        }
    }

    function apply_manifesto()
    {
        let numPropsAdded = 0;

        Rsed.assert && (!isPlaceholder)
                    || Rsed.throw("Can't apply manifestos to placeholder projects.");

        const commands = manifesto.split("\n").filter(line=>line.trim().length);

        Rsed.assert && (commands.length >= 2)
                    || Rsed.throw("Invalid number of lines in the manifesto.");

        Rsed.assert && (commands[0].startsWith("0 "))
                    || Rsed.throw("Expected the manifesto to begin with the command 0, but it doesn't.");

        Rsed.assert && (commands[commands.length-1].startsWith("99"))
                    || Rsed.throw("Expected the manifesto to end with the command 99, but it doesn't.");

        commands.forEach(command=>
        {
            apply_command(command);
        });

        return;

        function apply_command(commandLine)
        {
            const params = commandLine.split(" ");
            const command = Number(params.shift());

            eval("apply_" + command)(params);

            // Command: REQUIRE. Specifies which of the eight tracks in Rally-Sport's demo the project
            // is forked from.
            function apply_0(args = [])
            {
                Rsed.assert && (args.length === 3)
                            || Rsed.throw("Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");

                set_track_id(Math.floor(Number(args[0])) - 1);
                set_palat_id(Math.floor(Number(args[1])) - 1);
                set_required_loader_version(Number(args[2]));
            }

            // Command: ROAD. Sets up the game's driving physics for various kinds of road surfaces.
            function apply_1(args = [])
            {
                Rsed.assert && (args.length === 1)
                            || Rsed.throw("Invalid number of arguments to manifesto command 1. Expected 1 but received " + args.length + ".");
            }

            // Command: NUM_OBJS. Sets the number of props (in addition to the starting line) on the track.
            function apply_2(args = [])
            {
                Rsed.assert && (args.length === 1)
                            || Rsed.throw("Invalid number of arguments to manifesto command 2. Expected 1 but received " + args.length + ".");

                const numObjs = Math.floor(Number(args[0]));

                if (loaderVersion < 5)
                {
                    props.set_count(trackId, numObjs);
                }
                else
                {
                    props.set_count__loader_v5(trackId, numObjs);
                }
            }

            // Command: ADD_OBJ. Adds a new prop to the track.
            function apply_3(args = [])
            {
                Rsed.assert && (args.length === 5)
                            || Rsed.throw("Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");

                const propId = Math.floor(Number(args[0]) - 1);
                const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
                const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

                // Prior to loader version 5, command #3 would insert a new prop onto the
                // track. Since version 5, command #3 modifies an existing prop, after
                // you've first used commad #2 to set the total prop count (which creates
                // that many uninitialized props, which command #3 then initializes).
                if (loaderVersion < 5)
                {
                    props.add_location(trackId, propId, {x, z});
                }
                else
                {
                    props.change_prop_type(trackId, numPropsAdded, propId);
                    props.set_prop_location(trackId, numPropsAdded, {x, z});
                    numPropsAdded++;
                }
            }

            // Command: CHANGE_OBJ_TYPE. Changes the type of the given prop.
            function apply_4(args = [])
            {
                Rsed.assert && (args.length === 2)
                            || Rsed.throw("Invalid number of arguments to manifesto command 4. Expected 2 but received " + args.length + ".");

                const targetPropIdx = Math.floor(Number(args[0]) - 1);
                const newPropId = Math.floor(Number(args[1]) - 1);

                props.change_prop_type(trackId, targetPropIdx, newPropId);
            }

            // Command: MOVE_OBJ. Moves the position of the given prop.
            function apply_5(args = [])
            {
                Rsed.assert && (args.length === 5)
                            || Rsed.throw("Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");

                const targetPropIdx = Math.floor(Number(args[0]) - 1);
                const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
                const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

                props.set_prop_location(trackId, targetPropIdx, {x, z});
            }

            // Command: MOVE_STARTING_POS. Moves the starting line. Note that this doesn't move the
            // starting line prop, but the starting position of the player's car. So we can ignore
            // it in the editor.
            function apply_6(args = [])
            {
                Rsed.assert && (args.length === 4)
                            || Rsed.throw("Invalid number of arguments to manifesto command 6. Expected 4 but received " + args.length + ".");
            }

            // Command: CHANGE_PALETTE_ENTRY. Changes the given palette index to the given r,g,b values.
            function apply_10(args = [])
            {
                Rsed.assert && (args.length === 4)
                            || Rsed.throw("Invalid number of arguments to manifesto command 10. Expected 4 but received " + args.length + ".");

                const targetPaletteIdx = Math.floor(Number(args[0]));
                const red = Math.floor(Number(args[1] * 4));
                const green = Math.floor(Number(args[2] * 4));
                const blue = Math.floor(Number(args[3] * 4));
                
                Rsed.visual.palette.set_color(targetPaletteIdx, {red, green, blue});
            }

            // Command: STOP. Stops parsing the manifesto file.
            function apply_99(args = [])
            {
                Rsed.assert && (args.length === 0)
                            || Rsed.throw("Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
            }
        }
    }

    function set_track_id(id)
    {
        Rsed.assert && ((id >= 0) &&
                        (id <= 7))
                    || Rsed.throw("Track id out of bounds.");

        trackId = id;

        // Certain properties in Rally-Sport are hard-coded for each track, and which RallySportED
        // also doesn't let the user edit; so let's hard-code those properties for RallySportED,
        // as well.
        {
            switch (trackId)
            {
                case 0: trackCheckpoints.push({x:46,y:6}); break;
                case 1: trackCheckpoints.push({x:56,y:14}); break;
                case 2: trackCheckpoints.push({x:50,y:6}); break;
                case 3: trackCheckpoints.push({x:86,y:98}); break;
                case 4: trackCheckpoints.push({x:60,y:106}); break;
                case 5: trackCheckpoints.push({x:10,y:48}); break;
                case 6: trackCheckpoints.push({x:114,y:118}); break;
                case 7: trackCheckpoints.push({x:56,y:60}); break;
                default: Rsed.throw(`Unknown track id (${trackId}).`);
            }

            Rsed.visual.palette.set_palette((trackId === 4)? 1 :
                                            (trackId === 7)? 3 : 0);
        }

        return;
    }

    function set_palat_id(id)
    {
        Rsed.assert && ((id >= 0) &&
                        (id <= 1))
                    || Rsed.throw("PALAT id out of bounds.");

        palatId = id;
    }

    function set_required_loader_version(version)
    {
        loaderVersion = version;
    }
}

// An empty project that lets the renderer etc. spin even when there's no
// actual project data loaded.
Rsed.project.placeholder =
{
    isPlaceholder: true,
    name: "",
    manifesto: "",
    trackId: 0,
    set_track_id: ()=>{Rsed.throw("Can't set the track id of a null project.");},
    varimaa:
    {
        width: 0,
        height: 0,
        tile_at:()=>0,
        set_tile_value_at:()=>{},
    },
    maasto:
    {
        width: 0,
        height: 0,
        tile_at: ()=>0,
        set_tile_value_at: ()=>{},
    },
    palat:
    {
        texture:()=>{},
    },
    props:
    {
        name: ()=>("undefined"),
        mesh: ()=>{},
        texture: ()=>{},
    },
};
