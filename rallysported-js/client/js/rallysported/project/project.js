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
            const maasto = (new DataView(this.dataBuffer, 0, 4)).getUint32(0, true);
            const varimaa = (new DataView(this.dataBuffer, (maasto + 4), 4)).getUint32(0, true);
            const palat = (new DataView(this.dataBuffer, (maasto + varimaa + 8), 4)).getUint32(0, true);
            const anims = (new DataView(this.dataBuffer, (maasto + varimaa + palat + 12), 4)).getUint32(0, true);
            const text = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + 16), 4)).getUint32(0, true);
            
            return Object.freeze({maasto, varimaa, palat, anims, text});
        },

        byteOffset: function()
        {
            const byteSize = this.byteSize();

            // The variable names here reflect the names of Rally-Sport's data files.
            const maasto = 4;
            const varimaa = (byteSize.maasto + 8);
            const palat = (byteSize.maasto + byteSize.varimaa + 12);
            const anims = (byteSize.maasto + byteSize.varimaa + byteSize.palat + 16);
            const text = (byteSize.maasto + byteSize.varimaa + byteSize.palat + byteSize.anims + 20);

            return Object.freeze({maasto, varimaa, palat, anims, text});
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

    const publicInterface = Object.freeze(
    {
        name: projectData.meta.displayName,
        internalName: projectData.meta.internalName,
        checkpoint: ()=>(trackCheckpoints[0] || {x:0,y:0}),
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

        set_track_id: (id)=>
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
        },

        set_palat_id: (id)=>
        {
            Rsed.assert && ((id >= 0) &&
                            (id <= 1))
                        || Rsed.throw("PALAT id out of bounds.");

            palatId = id;
        },

        set_required_loader_version: (version)=>
        {
            loaderVersion = version;
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

    Rsed.log("\"" + projectData.meta.displayName + "\" is a valid RallySportED project. " +
              "Its internal name is \"" + projectData.meta.internalName + "\".");
    
    return publicInterface;

    // Returns an updated version of the project's manifesto string, reflecting the project's
    // current status - e.g. positions of track props, which may have been moved by the user
    // since the project was loaded in. The original manifesto string is not changed.
    function updated_manifesto_string()
    {
        const requiredLoaderVersion = 5;
        const manifesto = projectData.manifesto.split("\n").filter(line=>line.trim().length);
        
        // We'll append the new manifesto string here.
        let updatedManifesto = `0 ${trackId + 1} ${palatId} ${requiredLoaderVersion}\n`;

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
    // project's files will be "test.dta" and "test.$ft". Note that the base name is separate from
    // the project's display name, which is the name shown to the user in RallySportED's UI. The
    // display name may be different from the base name, and has no restrictions on its composition
    // like the base name does.
    function is_valid_project_base_name()
    {
        // The base filename must be between 1 and 8 characters long, and the string must consist
        // of ASCII A-Z characters only.
        return ((typeof projectData.meta !== "undefined") &&
                (typeof projectData.meta.internalName !== "undefined") &&
                (projectData.meta.internalName.length >= 1) &&
                (projectData.meta.internalName.length <= 8) &&
                /^[a-z]+$/.test(projectData.meta.internalName));
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
                        (typeof projectArgs.dataIdentifier !== "undefined"))
                    || Rsed.throw("Missing required parameters for loading a project.");

        const projectData = (projectArgs.dataLocality === "server")? await fetch_project_data_from_server() :
                            (projectArgs.dataLocality === "client")? await fetch_project_data_from_local_zip_file() :
                            Rsed.throw("Unknown locality for project data.");

        return projectData;

        async function fetch_project_data_from_local_zip_file()
        {
            Rsed.assert && (typeof projectArgs.dataIdentifier !== "undefined")
                        || Rsed.throw("Missing required parameters for loading a project from a zip file.");

            const zip = await (new JSZip()).loadAsync(projectArgs.dataIdentifier);

            // The zip file is expected to contain a project's .DTA and .$FT (manifesto) files.
            let manifestoFile = null;
            let dtaFile = null;

            let projectDirName = "undefined";

            // Parse the zip file's contents to extract the project's data. The data are expected as
            // .DTA and .$FT files inside a folder named according to the name of the project (the
            // folder name must be ASCII A-Z only and with a maximum of eight characters, to maintain
            // compatibility with the DOS version of RallySportED).
            {
                const files = [];
                const dirs = [];

                // Compile a list of files and directories in side the zip file.
                zip.forEach((path, entry)=>
                {
                    if (entry.dir)
                    {
                        dirs.push(entry);
                    }
                    else files.push(entry);
                });

                Rsed.assert && (dirs.length === 1)
                            || Rsed.throw("A project zip file must contain exactly one directory, under which the project's " +
                                          ".DTA and .$FT files are found.");

                projectDirName = dirs[0].name.slice(0, -1).toLowerCase();

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
                                || Rsed.throw("The given project zip file was missing the required .DTA and/or .$FT files.")
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

        async function fetch_project_data_from_server()
        {
            Rsed.assert && (typeof projectArgs.dataIdentifier !== "undefined")
                        || Rsed.throw("Missing required parameters for loading a project.");

            return fetch("server/get-project-data.php?projectId=" + projectArgs.dataIdentifier +
                                                    "&editMode=" + projectArgs.editMode)
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
}

// An empty project that lets the renderer etc. spin.
Rsed.project.placeholder =
{
    isPlaceholder: true,
    name: "",
    manifesto: "",
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
