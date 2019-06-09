/*
 * Most recent known filename: js/misc/project.js
 *
 * 2018-2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.texture = function(args = {})
{
    args =
    {
        ...
        {
            pixels: [],
            indices: [],
            width: 0,
            height: 0,
            alpha: false,
            flipped: "no", // | "vertical"
        },
        ...args
    };

    Rsed.assert && ((args.width > 0) &&
                    (args.height > 0))
                || Rsed.throw("Expected texture width and height to be positive and non-zero.");

    switch (args.flipped)
    {
        case "no": break;
        case "vertical":
        {
            for (let y = 0; y < args.height/2; y++)
            {
                // Swap horizontal rows vertically.
                for (let x = 0; x < args.width; x++)
                {
                    const idxTop = (x + y * args.width);
                    const idxBottom = (x + (args.height - y - 1) * args.width);

                    [args.pixels[idxTop], args.pixels[idxBottom]] = [args.pixels[idxBottom], args.pixels[idxTop]];
                    [args.indices[idxTop], args.indices[idxBottom]] = [args.indices[idxBottom], args.indices[idxTop]];
                }
            }

            break;
        }
        default: Rsed.throw("Unknown texture-flipping mode."); break;
    }

    const publicInterface =
    {
        ...args
    };

    return publicInterface;
}

Rsed.project = async function(projectName = "")
{
    Rsed.assert && is_valid_project_name(projectName)
                || Rsed.throw("Invalid project name.");

    // Which of Rally-Sport's eight tracks (in the demo version) this project is for.
    let trackId = null;

    const projectData = await fetch_project_data_from_server(projectName);

    Rsed.assert && ((projectData.trackWidth > 0) &&
                    (projectData.trackHeight > 0) &&
                    (projectData.trackWidth === projectData.trackHeight))
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

            const maasto = 4;
            const varimaa = (byteSize.maasto + 8);
            const palat = (byteSize.maasto + byteSize.varimaa + 12);
            const anims = (byteSize.maasto + byteSize.varimaa + byteSize.palat + 16);
            const text = (byteSize.maasto + byteSize.varimaa + byteSize.palat + byteSize.anims + 20);

            return Object.freeze({maasto, varimaa, palat, anims, text});
        },
    });

    const maasto = Rsed.track.maasto(projectData.trackWidth, projectData.trackHeight,
                                     new Uint8Array(projectDataContainer.dataBuffer,
                                                    projectDataContainer.byteOffset().maasto,
                                                    projectDataContainer.byteSize().maasto));

    const varimaa = Rsed.track.varimaa(projectData.trackWidth, projectData.trackHeight,
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
        name: projectName,
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
    
    return publicInterface;

    function is_valid_project_name()
    {
        /// TODO.
        return true;
    }

    function save_to_disk()
    {
        /// TODO.
        return false;
    }

    async function fetch_project_data_from_server(projectName = "")
    {
        return fetch("server/get-project-data.php?projectName=" + projectName)
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

Rsed.project.manifesto = (function()
{
    const publicInterface =
    {
        apply_manifesto_to_project(project)
        {


            return;
        }
    };

    return publicInterface;
});

Rsed.project_n = (function()
{
    // Maximum number of characters allowed in the project file name.
    const maxProjectNameLen = 8;

    // The range of characters allowed in the project name; successively from the first character to
    // the last one.
    const projectNameCharset = Object.freeze(["a", "z"]);

    // Returns true if the given project name is valid; false is returned otherwise.
    function is_valid_project_name(name = "")
    {
        if (name.length <= 1)
        {
            alert("The RallySportED project name is too short");
            return false;
        }
        else if (name.length > maxProjectNameLen)
        {
            alert("The RallySportED project name '" + name + "' is too long. The maximum number of characters allowed is " + maxProjectNameLen + ".");
            return false;
        }

        for (let i = 0; i < name.length; i++)
        {
            if ((name[i] < projectNameCharset[0]) ||
                (name[i] > projectNameCharset[1]))
            {
                alert("The RallySportED project name '" + name + "' containts invalid characters. Only the characters " +
                      projectNameCharset[0] + "-" + projectNameCharset[1] + " are allowed.");
                return false;
            }
        }

        return true;
    }

    const publicInterface = {};
    {
        // Will return true if the given project is valid. Otherwise, will throw an error.
        publicInterface.verify_project_validity = function(projectToVerify)
        {
            Rsed.assert && (projectToVerify instanceof Rsed.project_n.project_o)
                        || Rsed.throw("Was asked to test the validity of a non-RallySportED project.");

            Rsed.assert && ((projectToVerify != null) && (projectToVerify.isValidProject))
                        || Rsed.throw("Failed to load the given RallySportED project file.");
            
            Rsed.assert && (projectToVerify.name != null && projectToVerify.displayName != null)
                        || Rsed.throw("Failed to load the given RallySportED project file.");

            console.log("'" + projectToVerify.displayName + "' is a valid RallySportED project.");

            return true;
        }

        publicInterface.generate_download_of_project = function(project = Rsed.project_n.project_o)
        {
            Rsed.assert && (project instanceof Rsed.project_n.project_o)
                        || Rsed.throw("Expected a RallySportED project object.");

            const saveName = project.name.toUpperCase();

            k_message("Saving project '" + project.displayName + "'.");

            if (project.projectFileContents == null)
            {
                k_message("The given project has empty contents. Skipping saving it.");
                return;
            }

            // Replace the existing project bytes with the current data.
            {
                const maastoBytes = Rsed.maasto_n.get_saveable_maasto();
                const varimaaBytes = Rsed.maasto_n.get_saveable_varimaa();
                const palatBytes = Rsed.palat_n.get_saveable_palat();

                project.projectFileContents.set(maastoBytes, 4);
                project.projectFileContents.set(varimaaBytes, (maastoBytes.byteLength + 4*2));
                project.projectFileContents.set(palatBytes, (maastoBytes.byteLength + varimaaBytes.byteLength + 4*3));
            }

            // Zip up the project file, and have the browser initiate a download of it.
            const zip = new JSZip();

           //zip.file(saveName + ".TXT", lut_readme_txt.replace(/%TRACK/g, project.name.toUpperCase()));
            zip.file(saveName + "/" + saveName + ".DTA", project.projectFileContents);
            zip.file(saveName + "/" + saveName + ".$FT", Rsed.manifesto_n.get_saveable_manifesto(project.manifestoFileContents));
            zip.file(saveName + "/" + "HITABLE.TXT", lut_hitable_txt);

            zip.generateAsync({type:"blob", compression:"DEFLATE", compressionOptions:{level: 1}})
            .then(function(blob)
            {
                saveAs(blob, saveName + ".ZIP");
            })
            .catch((error)=>{Rsed.throw(error);});
        }
    }
    return publicInterface;
})();
