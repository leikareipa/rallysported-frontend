/*
 * Most recent known filename: js/stream/viewer.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

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
                    signalFns.signal_stream_open(publicInterface.role, streamId);
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
