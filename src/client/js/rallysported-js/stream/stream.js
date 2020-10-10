/*
 * Most recent known filename: js/stream/stream.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// A one-to-many network where viewers are connected to a streamer who sends them
// data. For a client to take part in this network, it will call Rsed.stream.start()
// with a role it wishes to take - either a "viewer" (Rsed.stream.viewer) or a
// "streamer" (Rsed.stream.streamer).
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
        signal_stream_open: function(role, streamId)
        {
            signalsFns.signal_stream_status(role);

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
            Rsed.alert(`Stream: ${error}`);

            return;
        },
    };

    const publicInterface = {
        // If 'role' is "streamer", 'proposedId' is the id with which viewers can
        // connect to the stream. If 'role' is "viewer", 'proposedId' is the id of 
        // the streamer that the viewer wants to connect to.
        start: function(role = "streamer", proposedId = Rsed.stream.generate_random_stream_id())
        {
            if (stream)
            {
                stream.stop();
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
            return (stream? stream.role : null);
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

// Returns a random id that can be used as the id of a peer in a stream.
Rsed.stream.generate_random_stream_id = function()
{
    const id = generate_uuid_v4().replace(/-/g, "");

    return id.substring(0, 12);
};
