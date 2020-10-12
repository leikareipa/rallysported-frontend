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
            Rsed.ui.htmlUI.set_stream_viewer_count(stream.num_connections());
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
            if (stream.role !== "viewer")
            {
                const basePath = `//${location.host}${location.pathname}`;
                window.history.replaceState({}, document.title, basePath);
            }

            return;
        },

        // Call this to signal to RallySportED that the stream has started.
        signal_stream_open: function(role, streamId)
        {
            Rsed.throw_if(!stream, "stream.signal_stream_open() called on a closed stream.");

            signalsFns.signal_stream_status(role);

            Rsed.log(`Joined stream ${streamId}.`);

            // Replace the URL bar's contents to give the user a link they can
            // share to others to join the stream.
            /// TODO: A less brute force implementation.
            if (stream.role !== "viewer")
            {
                const basePath = `//${location.host}${location.pathname}?transientServer=${streamId}`;
                window.history.replaceState({}, document.title, basePath);
            }

            // Periodically refresh our list of open connections.
            connectionCheckInterval = setInterval(()=>
            {
                Rsed.ui.htmlUI.set_stream_viewer_count(stream.num_connections());
            }, 2000);
        },

        signal_stream_error: function(error)
        {
            Rsed.ui.popup_notification(`Stream ${error}`, {
                notificationType: "error",
            });

            return;
        },
    };

    const publicInterface = {
        // If 'role' is "streamer" or "server", 'proposedId' is the id with which viewers
        // can connect to the stream. If 'role' is "viewer", 'proposedId' is the id of 
        // the streamer that the viewer wants to connect to.
        start: function(role = null, proposedId = Rsed.stream.generate_random_stream_id())
        {
            Rsed.throw_if(!role, "A role must be specified for stream.start().");
            Rsed.throw_if(!Rsed.stream[role], `Unknown stream role "${role}".`);

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
        // entire data: container, manifesto, and metadata), and "user-edit" ('data' is
        // expected to contain the arguments for a call to Rsed.ui.assetMutator.user_edit()).
        //
        // 'headerExtra' allows the caller to insert additional parameters to the header,
        // or to overwrite the default parameters.
        send_packet: function(what = "",
                              data,
                              dstViewer = null,
                              headerExtra = {})
        {
            if (!stream)
            {
                return;
            }

            const packet = {
                header: {
                    what,
                    creatorId: stream.id,
                    createdOn: Date.now(),
                    keepAlive: true,
                    ...headerExtra,
                },
                data,
            };

            Rsed.throw_if(!publicInterface.is_validly_formed_packet(packet),
                          "stream.send_packet() has created a malformed stream packet.");

            stream.send(packet, dstViewer);

            return;
        },

        // Returns true if the given stream packet is validly formed (contains the
        // required parameters, etc.); false otherwise.
        is_validly_formed_packet: function(packet)
        {
            if ((typeof packet !== "object") ||
                (typeof packet.header !== "object") ||
                (typeof packet.header.what === "undefined") ||
                (typeof packet.header.creatorId === "undefined") ||
                (typeof packet.header.createdOn !== "number") ||
                (typeof packet.header.keepAlive !== "boolean") ||
                (typeof packet.data === "undefined"))
            {
                return false;
            }

            return true;
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
    const alphaSrc = ["a", "c", "d", "e", "h", "k", "n", "s", "u"];
    const numericSrc = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const alphanumeric = [..."000111000"].map(v=>
    {
        const src = ((v == "0")? alphaSrc : numericSrc);
        return src[Math.floor(Math.random() * src.length)];
    });

    return alphanumeric.join("");
};
