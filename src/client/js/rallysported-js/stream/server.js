/*
 * Most recent known filename: js/stream/server.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Server is an Rsed.stream() role in a one-to-many network. Clients who are servers
// accept connections from viewers, sending them the server client's current project
// data and then closing the connection.
Rsed.stream.server = function(streamId, signalFns)
{
    let numViewersServed = 0;

    // PeerJS's Peer() object.
    let peer = null;

    const publicInterface = {
        role: "server",

        num_connections: function()
        {
            return numViewersServed;
        },

        // Sends the given data packet to the given viewer.
        send: function(packet, dstViewer = null)
        {
            Rsed.throw_if_not_type("object", packet,  packet.header);
            Rsed.throw_if(!dstViewer, "A destination is required for stream.server.send().");
            Rsed.throw_if((packet.header.what !== "project-data"), "A stream server can only send packets marked as \"project-data\".");

            dstViewer.send(packet);

            return;
        },

        // Servers don't receive data, they just ignore requests to do so.
        receive: function(){},

        // Start serving.
        start: function()
        {
            numViewersServed = 0;

            if (status.active)
            {
                Rsed.log("Attempted to start a new server stream while an existing stream was still active. Ignoring this.");
                return;
            }

            signalFns.signal_stream_status("initializing");
    
            peer = new Peer(streamId, Rsed.stream.peerJsServerConfig);
            peer.on("close", ()=>signalFns.signal_stream_closed(streamId));
            peer.on("error", (error)=>
            {
                publicInterface.stop();
                signalFns.signal_stream_error(error);
            });
            peer.on("open", (id)=>
            {
                if (id != streamId)
                {
                    Rsed.ui.popup_notification("Stream: Received an invalid ID from the peer server.", {
                        notificationType: "error",
                    });

                    signalFns.stop_stream();
    
                    return;
                }

                peer.on("connection", handle_new_viewer);
    
                signalFns.signal_stream_open(publicInterface.role, id);
            });
        },

        // End the serving.
        stop: function()
        {
            peer.destroy();
        },

        get id()
        {
            return (peer? peer.id : undefined);
        },
    };

    return publicInterface;

    // Gets called when a new viewer connects to this server.
    function handle_new_viewer(newViewer)
    {
        // Wait until the connection is fully open, then send the new viewer a copy
        // of the current project's full data.
        let startTime = Date.now();
        const connectionWaitTimeoutMs = 10000;
        const dataReceptionWaitTimeoutMs = 30000;
        const timeBetweenAttemptsMs = 500;
        const timer = setInterval(()=>
        {
            // If the stream has been closed.
            if (!peer)
            {
                clearInterval(timer);
                return;
            }

            if (newViewer.open)
            {
                clearInterval(timer);

                Rsed.stream.send_packet("project-data",
                                        Rsed.core.current_project().json(),
                                        newViewer);

                numViewersServed++;

                // Give the viewer a bit of time to receive the data, then close
                // their connection to us.
                /// TODO: Should we instead have bidirectional streaming, i.e. the
                /// viewer sending the server confirmation when they've received
                /// the data? Maybe.
                setTimeout(()=>
                {
                    if (newViewer)
                    {
                        newViewer.close();
                    }
                }, dataReceptionWaitTimeoutMs);
            }
            else if ((Date.now() - startTime) > connectionWaitTimeoutMs)
            {
                newViewer.close();
                clearInterval(timer);
            }
        }, timeBetweenAttemptsMs);

        return;
    }
};
