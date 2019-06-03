/*
 * Most recent known filename: js/misc/shared-mode.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 * Implements client-side communication with RallySportED-js's shared-mode server.
 * 
 * The central function is server_io(), which orchestrates the communication.
 * But before communication can take place, register_as_participant() should be
 * called to establish ourselves as a participant on the server.
 *
 */

"use strict";

Rsed.shared_mode_n = (function()
{
    // A string that uniquely identifies us as a participant in the shared editing. We'll
    // need to provide this id any time we GET or POST data to the server.
    let participantId = null;

    // The number of milliseconds to wait between polling the server with/for data.
    const serverPollingInterval = 6000;

    // POSTs our most recent edits to the server for other participants to see. Will throw
    // on errors.
    function send_local_caches_to_server(localCaches = {})
    {
        localCaches =
        {
            ...{
                maasto:[],
                varimaa:[]
            },
            ...localCaches
        }

        function cacheToDataArray(cache)
        {
            return ((dataArray = [])=>{ cache.forEach((v, idx)=>{ if (v != null) dataArray.push(idx, v); }); return dataArray; })();
        };
        
        const postData =
        {
            participantId,
            maasto: cacheToDataArray(localCaches["maasto"]),
            varimaa: cacheToDataArray(localCaches["varimaa"]),
        };

        return fetch(("server/shared/post.php?projectName=" + Rsed.main_n.current_project_name() +
                                            "&participantId=" + participantId),
                {
                    method: "POST",
                    cache: "no-store",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData)
                })
                .then(response=>
                {
                    if (!response.ok)
                    {
                        throw "A POST request to the server failed.";
                    }
    
                    return response.json();
                })
                .then(ticket=>
                {
                    if (!ticket.valid ||
                        (typeof ticket.data === "undefined"))
                    {
                        throw ("The server sent a POST ticket marked invalid. It said: " + ticket.message);
                    }

                    return ticket.data;
                })
                .catch(error=>{ Rsed.throw(error); });
    }

    // Takes in an object holding edit data we've received from the server made by other
    // participants, and applies those data to our local data (like our MAASTO heightmap
    // and VARIMAA tilemap).
    function apply_server_data_to_local_data(serverData)
    {
        if (!serverData) return;

        const resources =
        {
            "maasto": Rsed.maasto_n.set_maasto_height_at,
            "varimaa": Rsed.maasto_n.set_varimaa_tile_at,
        };

        for (const [resourceName, dataCallback] of Object.entries(resources))
        {
            if (Array.isArray(serverData[resourceName]))
            {
                for (let i = 0; i < serverData[resourceName].length; i += 2)
                {
                    dataCallback(...idx_to_xy(serverData[resourceName][i]), serverData[resourceName][i+1]);
                }
            }
        }

        // Converts a 1d array index into a 2d x,y coordinate pair.
        function idx_to_xy(idx)
        {
            return [(idx % Rsed.maasto_n.track_side_length()),
                    Math.floor(idx / Rsed.maasto_n.track_side_length())];
        }
    }

    // Sends the server a POST request containing the local edits we've made since the last
    // time we contacted the server in this manner. Will receive back from the server any
    // edits made by the other participants in the shared editing.
    async function server_io(participantId = "")
    {
        if (!publicInterface.enabled()) return;

        if (Rsed.ui_input_n.are_editing_keys_pressed())
        {
            setTimeout(poll_server, 500);
            return;
        }

        const newServerData = await send_local_caches_to_server({
            maasto: Rsed.ui_brush_n.flush_brush_cache("maasto"),
            varimaa: Rsed.ui_brush_n.flush_brush_cache("varimaa")
        });

        apply_server_data_to_local_data(newServerData);

        // Loop.
        setTimeout(poll_server, serverPollingInterval);

        function poll_server() { server_io(participantId); };
    }

    const publicInterface = {};
    {
        // Returns null if shared mode is disabled; our participant id otherwise (which will be a
        // truthy value).
        publicInterface.enabled = function() { return participantId; };

        // Start two-way communication with the shared-mode server.
        publicInterface.start_polling_server = function()
        {
            Rsed.assert && (publicInterface.enabled())
                        || Rsed.throw("Was asked to start polling the shared-mode server before having registered as a participant in it.");

            server_io(participantId);

            return;
        }

        // Asks the server to register us as a participant in the shared editing. Being a participant
        // means we can have our edits broadcast to the server and to receive edits from the server made
        // by other participants. If an error occurs while registering, the client side will be terminated.
        publicInterface.register_as_participant_in_project = function(projectName = "")
        {
            // If we were already registered as a participant, unregister that previous registration, first.
            if (publicInterface.enabled()) publicInterface.unregister_current_registration();

            return fetch(("server/shared/register.php?projectName=" + projectName), {cache: "no-store"})
                    .then(response=>
                    {
                        if (!response.ok)
                        {
                            throw "A POST request to the server failed.";
                        }

                        return response.json();
                    })
                    .then(ticket=>
                    {
                        if (!ticket.valid || (typeof ticket.participantId === "undefined"))
                        {
                            throw "Failed to register as a new participant in the shared editing.";
                        }

                        participantId = ticket.participantId;
                    })
                    .catch(error=>{ Rsed.throw("Error while registering as a participant in shared editing: " + error); });
        };

        // Tell the server that we no longer want to participate in the shared editing. Our edits
        // will no longer be broadcast to the server, and we don't receive other participants'
        // edits from the server.
        publicInterface.unregister_current_registration = function()
        {
            participantId = null;

            /// TODO. Maybe flush the latest local changes to the server, etc.
        }
    };
    return publicInterface;
})();
