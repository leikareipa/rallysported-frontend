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
        signal_stream_closed: function()
        {
            signalsFns.signal_stream_status("disabled");

            clearInterval(connectionCheckInterval);
            connectionCheckInterval = null;

            // Remove the stream id from the address bar.
            /// TODO: A less brute force implementation.
            const basePath = `//${location.host}${location.pathname}`;
            window.history.replaceState({}, document.title, basePath);

            return;
        },

        // Call this to signal to RallySportED that the stream has started.
        signal_stream_open: function(id)
        {
            signalsFns.signal_stream_status("enabled");

            // Replace the URL bar's contents to give the user a link they can
            // share to others to join the stream.
            /// TODO: A less brute force implementation.
            const basePath = `//${location.host}${location.pathname}?stream=${id}`;
            window.history.replaceState({}, document.title, basePath);

            // Periodically refresh our list of open connections.
            connectionCheckInterval = setInterval(()=>{
                Rsed.ui.htmlUI.set_stream_viewer_count(stream.num_connections());
            }, 2000);
        },

        signal_stream_error: function(error)
        {
            Rsed.ui.popup_notification(`Broadcast: "${error}"`,
            {
                notificationType: "error",
            });

            return;
        },
    };

    const publicInterface = {
        start: function(role = "streamer", proposedId = Rsed.stream.generate_random_stream_id())
        {
            // Don't allow a stream to be started more than once.
            if (stream)
            {
                return;
            }

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

        // If this is a streamer, streams the given user edit action.
        user_edit: function(assetType = "", editAction = {})
        {
            if (!stream)
            {
                return;
            }

            stream.send_data({assetType, editAction});

            return;
        },

        get role()
        {
            return stream.role;
        },
    };

    return publicInterface;

    // A streamer id that will be used by viewers to connect to the stream.
    function make_streamer_id()
    {
        return generate_uuid_v4().replace(/-/g, "");
    }
})();

Rsed.stream.peerJsServerConfig = {
    host: "localhost",
    port: 9000,
    path: "./",
};

// Returns a random id that can be used as the id for a stream (either
// a streamer or a viewer stream).
Rsed.stream.generate_random_stream_id = function()
{
    return generate_uuid_v4().replace(/-/g, "");
}

// A streamer accepts connections from viewers and sends data to them.
Rsed.stream.streamer = function(streamId, signalFns)
{
    // The viewers viewing this stream.
    const connections = [];

    // PeerJS's Peer() object.
    let peer = null;

    // Gets called when a new viewer connects to this stream.
    function handle_new_viewer(newConnection)
    {
        connections.push(newConnection);

        return;
    }

    const publicInterface = {
        role: "streamer",

        num_connections: function()
        {
            const currentConnections = connections.filter(s=>s.open);

            connections.length = 0;
            for (const conn of currentConnections)
            {
                connections.push(conn);
            }

            return connections.length;
        },

        // Sends the given data to our viewers.
        send_data: function(data = {})
        {
            Rsed.throw_if_not_type("object", data);

            const packet = JSON.stringify(data);

            for (const connection of connections)
            {
                connection.send(packet);
            }

            return;
        },

        receive_data: function()
        {
            /// Streamers don't receive data.
            return;
        },

        start: function()
        {
            if (status.active)
            {
                Rsed.ui.popup_notification("The stream is already active.");
                return;
            }
    
            signalFns.signal_stream_status("initializing");
    
            peer = new Peer(streamId, Rsed.stream.peerJsServerConfig);
            peer.on("close", signalFns.signal_stream_closed);
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
                
                    Rsed.ui.popup_notification(`Broadcast: Received an invalid ID from the peer server.`,
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
            peer.destroy();
        }
    };

    return publicInterface;
};

// A viewer connects to a streamer and receives data from it.
Rsed.stream.viewer = function(streamId, signalFns)
{
    // Our connection to the stream we're viewing.
    let connection = null;

    // PeerJS's Peer() object.
    let peer = null;

    const publicInterface = {
        role: "viewer",

        num_connections: function()
        {
            if (!connection.open)
            {
                connection = null;
            }

            // If we lost the connection to the streamer.
            if (!connection)
            {
                this.stop();
            }

            return Number(connection !== null);
        },

        send_data: function(data)
        {
            /// Viewers don't send data.
            return;
        },

        // Receive and process data from the streamer.
        receive_data: function(data)
        {
            data = JSON.parse(data);

            Rsed.ui.assetMutator.user_edit(data.assetType, data.editAction);

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
            peer.on("close", signalFns.signal_stream_closed);
            peer.on("open", ()=>
            {
                // Attempt to connect to the given stream.
                connection = peer.connect(streamId);
                connection.on("disconnect", signalFns.signal_stream_closed);
                connection.on("data", publicInterface.receive_data);
                connection.on("error", (error)=>
                {
                    this.stop();
                    signalFns.signal_stream_error(error);
                });
                connection.on("open", ()=>
                {
                    signalFns.signal_stream_open(streamId);
                });
            });
        },

        stop: function()
        {
            peer.destroy();
        }
    };

    return publicInterface;
};
