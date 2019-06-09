/*
 * Most recent known filename: js/misc/project.js
 *
 * 2018-2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

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
