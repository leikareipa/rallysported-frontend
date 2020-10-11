/*
 * Most recent known filename: js/stream/viewer.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Viewer is an Rsed.stream() role in a one-to-many network. Clients who are viewers
// connect to a streamer and receive data from them. Data doesn't flow from viewers
// to streamers, however.
Rsed.stream.viewer = function(streamId, signalFns)
{
    // The stream we're viewing.
    let srcStream = null;

    // PeerJS's Peer() object.
    let peer = null;

    const publicInterface = {
        role: "viewer",

        // How many streamers this viewer is connected to.
        num_connections: function()
        {
            return Number(srcStream !== null);
        },

        // Viewers don't send data, they just ignore requests to do so.
        send: function(){},

        // Receive and process a packet of data from the streamer.
        receive: function(packet)
        {
            switch (packet.header.what)
            {
                // A streamer client has edited a track asset and wants us to replicate
                // those edits on our client. Expects packet.data to contain the data
                // for a call to Rsed.ui.assetMutator.user_edit().
                case "user-edit":
                {
                    Rsed.ui.assetMutator.user_edit(packet.data.assetType, packet.data.editAction);

                    break;
                }
                // Expects packet.data to be a string containing the stream project's data
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

                    break;
                }
                // We'll fully ignore any unknown packets.
                default: break;
            }

            return;
        },

        // Connects this viewer to a stream.
        start: function()
        {
            signalFns.signal_stream_status("initializing");

            peer = new Peer(Rsed.stream.generate_random_stream_id(), Rsed.stream.peerJsServerConfig);
            
            peer.on("error", (error)=>
            {
                publicInterface.stop();
                signalFns.signal_stream_error(error);
            });
            peer.on("close", ()=>
            {
                signalFns.signal_stream_closed(streamId);
            });
            peer.on("open", ()=>
            {
                // Attempt to connect to the given stream.
                srcStream = peer.connect(streamId, {reliable: true});

                srcStream.on("close", publicInterface.stop);
                srcStream.on("data", publicInterface.receive);
                srcStream.on("error", (error)=>
                {
                    publicInterface.stop();
                    signalFns.signal_stream_error(error);
                });
                srcStream.on("open", ()=>
                {
                    signalFns.signal_stream_open(publicInterface.role, streamId);
                });
            });
        },

        stop: function()
        {
            if (!srcStream)
            {
                Rsed.log("Attempted to close a connection to a stream that we weren't connected to. Ignoring this.");
                return;
            }

            srcStream.close();
            srcStream = null;

            peer.destroy();
        },

        get id()
        {
            return (peer? peer.id : undefined);
        },
    };

    return publicInterface;
};
