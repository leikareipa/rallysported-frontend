/*
 * Most recent known filename: js/misc/project.js
 *
 * 2018-2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.project = async function(projectArgs = {})
{
    // Which of Rally-Sport's eight tracks (in the demo version) this project is for.
    let trackId = null;

    const projectData = await fetch_project_data();

    Rsed.assert && ((typeof projectData.container !== "undefined") &&
                    (typeof projectData.manifesto !== "undefined") &&
                    (typeof projectData.meta !== "undefined") &&
                    (typeof projectData.meta.baseName !== "undefined") &&
                    (typeof projectData.meta.displayName !== "undefined"))
                || Rsed.throw("Missing required project data.");

    Rsed.assert && is_valid_project_base_name()
                || Rsed.throw("Invalid project base name \"" + projectData.meta.baseName + "\".");

    Rsed.assert && ((projectData.meta.width > 0) &&
                    (projectData.meta.height > 0) &&
                    (projectData.meta.width === projectData.meta.height))
                || Rsed.throw("Invalid track dimensions for a project.");

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
            // The variable names here reflect the names of Rally-Sport's data files. For more
            // information, see RallySportED's documentation on Rally-Sport's data formats at
            // https://github.com/leikareipa/rallysported/tree/master/docs.
            //
            // In short,
            //
            //     maasto: track heightmap
            //     varimaa: track tilemap
            //     palat: track tile textures
            //     anims: animation frame textures
            //     text: track prop textures
            //
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

    // The variable names here reflect the names of Rally-Sport's data files. For more
    // information, see RallySportED's documentation on Rally-Sport's data formats at
    // https://github.com/leikareipa/rallysported/tree/master/docs.
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
        maasto,
        varimaa,
        palat,
        props,
        manifesto,

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
        },
    });

    k_message("\"" + projectData.meta.displayName + "\" is a valid RallySportED project. " +
              "Its base name is \"" + projectData.meta.baseName + "\".");
    
    return publicInterface;

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
                (typeof projectData.meta.baseName !== "undefined") &&
                (projectData.meta.baseName.length >= 1) &&
                (projectData.meta.baseName.length <= 8) &&
                /^[a-z]+$/.test(projectData.meta.baseName));
    }

    function save_to_disk()
    {
        /// TODO.
        return false;
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
                    baseName: projectDirName,
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

            return fetch("server/get-project-data.php?projectId=" + projectArgs.dataIdentifier)
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
