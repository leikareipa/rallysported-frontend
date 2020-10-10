/*
 * Most recent known filename: js/stream/streamer.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// A streamer accepts connections from viewers and sends data to them.
Rsed.stream.streamer = function(streamId, signalFns)
{
    const viewers = [];

    // Maximum number of simultaneous viewers of this streamer's stream.
    const maxNumViewers = 1000;

    // PeerJS's Peer() object.
    let peer = null;

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
        // the new viewer a copy of the current track's full data.
        let startTime = Date.now();
        const waitTimeoutMs = 5000; // Number of milliseconds to wait, at most.
        const timeBetweenAttemptsMs = 500;
        const timer = setInterval(()=>
        {
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

    const publicInterface = {
        role: "streamer",

        num_connections: function()
        {
            // Cull away viewers whose connection is not currently open.
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

        // Sends the given data to the streamer's viewers.
        send: function(data, dstViewer)
        {
            if (dstViewer)
            {
                dstViewer.send(data);
            }
            else
            {
                for (const viewer of viewers)
                {
                    viewer.send(data);
                }
            }

            return;
        },

        // Streamers don't receive data, they just ignore requests to do so.
        receive: function(){},

        start: function()
        {
            if (status.active)
            {
                Rsed.ui.popup_notification("The stream is already active.");
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
                    signalFns.stop_stream();
                
                    Rsed.ui.popup_notification(`Stream: Received an invalid ID from the peer server.`,
                    {
                        notificationType: "error",
                    });
    
                    return;
                }

                peer.on("connection", handle_new_viewer);
    
                signalFns.signal_stream_open(publicInterface.role, id);
            });
        },

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
};
