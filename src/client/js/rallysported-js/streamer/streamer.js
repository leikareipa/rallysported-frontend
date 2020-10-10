/*
 * Most recent known filename: js/streamer/streamer.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software RallySportED-js
 *
 */

"use strict";

// Streams the user's edits to viewers via PeerJS/WebRTC.
Rsed.stream = (function()
{
    // Either Rsed.stream.streamer or Rsed.stream.viewer.
    let stream = null;

    let connectionCheckInterval = null;

    // Functions callable by the stream objects to inform RallySportED of
    // various events.
    const signalsFns = {
        signal_stream_status: function(status = "unknown")
        {
            Rsed.ui.htmlUI.set_stream_status(status);
        },

        // Call this to signal to RallySportED that the stream has ended.
        signal_stream_closed: function(streamId)
        {
            signalsFns.signal_stream_status("disabled");

            Rsed.log(`Left stream ${streamId}.`);

            clearInterval(connectionCheckInterval);
            connectionCheckInterval = null;

            // Remove the stream id from the address bar.
            /// TODO: A less brute force implementation.
            const basePath = `//${location.host}${location.pathname}`;
            window.history.replaceState({}, document.title, basePath);

            return;
        },

        // Call this to signal to RallySportED that the stream has started.
        signal_stream_open: function(streamId)
        {
            signalsFns.signal_stream_status("enabled");

            Rsed.log(`Joined stream ${streamId}.`);

            // Replace the URL bar's contents to give the user a link they can
            // share to others to join the stream.
            /// TODO: A less brute force implementation.
            const basePath = `//${location.host}${location.pathname}?transientServer=${streamId}`;
            window.history.replaceState({}, document.title, basePath);

            // Periodically refresh our list of open connections.
            connectionCheckInterval = setInterval(()=>
            {
                Rsed.ui.htmlUI.set_stream_viewer_count(stream.num_connections());
            }, 2000);
        },

        signal_stream_error: function(error)
        {
            Rsed.ui.popup_notification(`Stream: "${error}"`,
            {
                notificationType: "error",
            });

            return;
        },
    };

    const publicInterface = {
        start: function(role = "streamer", proposedId = Rsed.stream.generate_random_stream_id())
        {
            Rsed.throw_if(stream, "Attempting to start a new stream before closing the existing one.");

            stream = Rsed.stream[role](proposedId, signalsFns);
            stream.start();

            return;
        },

        stop: function()
        {
            if (!stream)
            {
                return;
            }

            stream.stop();
            stream = null;

            return;
        },

        // Encapsulates the given data into an object that is then streamed to the
        // current viewers (if 'dstViewer' is null) or to a specific viewer (as identified
        // by 'dstViewer').
        //
        // The 'what' argument is a string that identifies the type of data encapsulated
        // - valid values are "track-project-data" ('data' is expected to contain a track's
        // entire data: container, manifesto, and metadata).
        send_packet: function(what = "", data, dstViewer = null)
        {
            if (!stream)
            {
                return;
            }

            const packet =  {
                header: {
                    what,
                    creatorId: stream.id,
                    createdOn: Date.now(),
                },
                data,
            };

            stream.send(packet, dstViewer);

            return;
        },

        get role()
        {
            return stream.role;
        },
    };

    return publicInterface;
})();

Rsed.stream.localhostPeerJsServerConfig = {
    host: "localhost",
    port: 9000,
    path: "./",
};

Rsed.stream.herokuPeerJsServerConfig = {
    secure: true,
    host: "peerjs-tarpeeksihyvaesoft.herokuapp.com",
    port: 443,
};

// The configuration that will be used for PeerJS's Peer().
Rsed.stream.peerJsServerConfig = Rsed.stream.herokuPeerJsServerConfig;

// Returns a random id that can be used as the id for a stream (either
// a streamer or a viewer stream).
Rsed.stream.generate_random_stream_id = function()
{
    const id = generate_uuid_v4().replace(/-/g, "");

    return id.substring(0, 12);
};

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
    
                signalFns.signal_stream_open(id);
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

// A viewer connects to a streamer and receives data from it.
Rsed.stream.viewer = function(streamId, signalFns)
{
    // Our connection to the stream we're viewing.
    let streamer = null;

    // PeerJS's Peer() object.
    let peer = null;

    const publicInterface = {
        role: "viewer",

        num_connections: function()
        {
            // If we lost the connection to the streamer.
            if (streamer &&
                !streamer.open)
            {
                this.stop();
            }

            return Number(streamer !== null);
        },

        // Viewers don't send data, they just ignore requests to do so.
        send: function(){},

        // Receive and process a packet of data from the streamer.
        receive: function(packet)
        {
            switch (packet.header.what)
            {
                // We expect packet.data to be a string containing the stream project's data
                // in RallySportED-js's JSON format.
                case "project-data":
                {
                    try
                    {
                        const projectData = JSON.parse(packet.data);

                        Rsed.core.start(Rsed.core.startup_args({
                            stream: packet.header.creatorId, 
                            project: {
                                dataLocality: "inline",
                                data: projectData,
                            },
                        }));
                    }
                    catch (error)
                    {
                        Rsed.throw(`Failed to sync with the stream: ${error}`);
                    }
                }
                // We'll fully ignore any unknown packets.
                default: break;
            }

            return;
        },

        // Connects this viewer to a streamer.
        start: function()
        {
            signalFns.signal_stream_status("initializing");

            peer = new Peer(Rsed.stream.generate_random_stream_id(), Rsed.stream.peerJsServerConfig);
            peer.on("error", (error)=>
            {
                publicInterface.stop();
                signalFns.signal_stream_error(error);
            });
            peer.on("close", ()=>signalFns.signal_stream_closed(streamId));
            peer.on("open", ()=>
            {
                // Attempt to connect to the given stream.
                streamer = peer.connect(streamId, {reliable: true});
                streamer.on("disconnect", signalFns.signal_stream_closed);
                streamer.on("data", publicInterface.receive);
                streamer.on("error", (error)=>
                {
                    this.stop();
                    signalFns.signal_stream_error(error);
                });
                streamer.on("open", ()=>
                {
                    signalFns.signal_stream_open(streamId);
                });
            });
        },

        stop: function()
        {
            if (!streamer)
            {
                Rsed.log("Attempted to close a connection to a stream that we weren't connected to. Ignoring this.");
                return;
            }

            streamer.close();
            streamer = null;

            peer.destroy();
        },

        get id()
        {
            return (peer? peer.id : undefined);
        },
    };

    return publicInterface;
};
