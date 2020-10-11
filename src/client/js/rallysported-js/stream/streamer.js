/*
 * Most recent known filename: js/stream/streamer.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Streamer is an Rsed.stream() role in a one-to-many network. Clients who are streamers
// accept connections from viewers and send (stream) data to them. Data doesn't flow from
// viewers to streamers, however.
Rsed.stream.streamer = function(streamId, signalFns)
{
    const viewers = [];

    // Maximum number of simultaneous viewers.
    const maxNumViewers = 1000;

    // PeerJS's Peer() object.
    let peer = null;

    const publicInterface = {
        role: "streamer",

        num_connections: function()
        {
            // Cull away viewers whose connection is not currently open.
            /// TODO: Put this in a separate function, since it's weird that a
            /// a call to num_connections() would have this side effect.
            const openViewers = viewers.filter(viewer=>
            {
                if (!viewer.open)
                {
                    viewer.close();
                    return false;
                }

                return true;
            }, []);

            viewers.splice(0, Infinity, ...openViewers);

            return viewers.length;
        },

        // Sends the given data packet to the current viewers.
        send: function(packet, dstViewer = null)
        {
            if (dstViewer)
            {
                dstViewer.send(packet);
            }
            else
            {
                for (const viewer of viewers)
                {
                    viewer.send(packet);
                }
            }

            return;
        },

        // Streamers don't receive data, they just ignore requests to do so.
        receive: function(){},

        // Start streaming.
        start: function()
        {
            if (status.active)
            {
                Rsed.log("Attempted to start a new stream while an existing stream was still active. Ignoring this.");
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
                    Rsed.alert("Stream: Received an invalid ID from the peer server.");

                    signalFns.stop_stream();
    
                    return;
                }

                peer.on("connection", handle_new_viewer);
    
                signalFns.signal_stream_open(publicInterface.role, id);
            });
        },

        // End the stream. All viewers will be kicked off.
        stop: function()
        {
            for (const viewer of viewers)
            {
                viewer.close();
            }

            viewers.length = 0;

            peer.destroy();
        },

        get id()
        {
            return (peer? peer.id : undefined);
        },
    };

    return publicInterface;

    // Gets called when a new viewer connects to this stream.
    function handle_new_viewer(newViewer)
    {
        if (viewers.length > maxNumViewers)
        {
            /// TODO: Send the viewer an error message.

            newViewer.close();

            return;
        }

        // Wait until the connection is fully open for streaming, then send
        // the new viewer a copy of the current project's full data.
        let startTime = Date.now();
        const waitTimeoutMs = 5000; // Number of milliseconds to wait, at most.
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

                viewers.push(newViewer);
            }
            else if ((Date.now() - startTime) > waitTimeoutMs)
            {
                newViewer.close();
                clearInterval(timer);
            }
        }, timeBetweenAttemptsMs);

        return;
    }
};
