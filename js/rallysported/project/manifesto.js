/*
 * Most recent known filename: js/misc/manifesto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.apply_manifesto = function(project)
{
    Rsed.assert && (!project.isPlaceholder)
                || Rsed.throw("Can't apply manifestos to placeholder projects.");

    const commands = project.manifesto.split("\n").filter(Boolean);

    console.log(commands[commands.length-1])

    Rsed.assert && (commands.length >= 2)
                || Rsed.throw("Invalid number of lines in the manifesto.");

    Rsed.assert && (commands[0].startsWith("0 "))
                || Rsed.throw("Expected the manifesto to begin with the command 0, but it doesn't.");

    Rsed.assert && (commands[commands.length-1].startsWith("99"))
                || Rsed.throw("Expected the manifesto to end with the command 99, but it doesn't.");

    commands.forEach(command=>
    {
        apply_command(command);
    });

    return;

    function apply_command(commandLine)
    {
        const params = commandLine.split(" ");
        const command = Number(params.shift());

        eval("apply_" + command)(params);

        // Command: REQUIRE. Specifies which of Rally-Sport's eight tracks (in the demo version) the project
        // is based on.
        function apply_0(args = [])
        {
            Rsed.assert && (args.length === 3)
                        || Rsed.throw("Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");

            const trackId = Math.floor(Number(args[0])); // Note: The track id starts from 1.
            const palatId = Math.floor(Number(args[1]));
            const minRSEDLoaderVersion = Number(args[2]);

            project.set_track_id(trackId - 1);
        }

        // Command: ROAD. Sets up the game's driving physics for various kinds of road surfaces.
        function apply_1(args = [])
        {
            Rsed.assert && (args.length === 1)
                        || Rsed.throw("Invalid number of arguments to manifesto command 1. Expected 1 but received " + args.length + ".");
        }

        // Command: NUM_OBJS. Sets the number of props (in addition to the starting line) on the track.
        function apply_2(args = [])
        {
            Rsed.assert && (args.length === 1)
                        || Rsed.throw("Invalid number of arguments to manifesto command 2. Expected 1 but received " + args.length + ".");

            const numObjs = Math.floor(Number(args[0]));

            project.props.set_count(project.track_id(), numObjs);
        }

        // Command: ADD_OBJ. Adds a new prop to the track.
        function apply_3(args = [])
        {
            Rsed.assert && (args.length === 5)
                        || Rsed.throw("Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");

            const propId = Math.floor(Number(args[0]) - 1);
            const posX = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
            const posZ = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

            project.props.add_location(project.track_id(),
                                                     propId,
                                                     {
                                                         x: posX,
                                                         z: posZ,
                                                     });
        }

        // Command: CHANGE_OBJ_TYPE. Changes the type of the given prop.
        function apply_4(args = [])
        {
            Rsed.assert && (args.length === 2)
                        || Rsed.throw("Invalid number of arguments to manifesto command 4. Expected 2 but received " + args.length + ".");

            const targetPropIdx = Math.floor(Number(args[0]) - 1);
            const newPropId = Math.floor(Number(args[1]) - 1);

            project.props.change_prop_type(project.trackId, targetPropIdx, newPropId);
        }

        // Command: MOVE_OBJ. Moves the position of the given prop.
        function apply_5(args = [])
        {
            Rsed.assert && (args.length === 5)
                        || Rsed.throw("Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");

            const targetPropIdx = Math.floor(Number(args[0]) - 1);
            const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
            const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

            project.props.set_prop_location(project.trackId, targetPropIdx, {x, z});
        }

        // Command: MOVE_STARTING_POS. Moves the starting line. Note that this doesn't move the
        // starting line prop, but the starting position of the player's car. So we can ignore
        // it in the editor.
        function apply_6(args = [])
        {
            Rsed.assert && (args.length === 4)
                        || Rsed.throw("Invalid number of arguments to manifesto command 6. Expected 4 but received " + args.length + ".");
        }

        // Command: CHANGE_PALETTE_ENTRY. Changes the given palette index to the given r,g,b values.
        function apply_10(args = [])
        {
            Rsed.assert && (args.length === 4)
                        || Rsed.throw("Invalid number of arguments to manifesto command 10. Expected 4 but received " + args.length + ".");

            const targetPaletteIdx = Math.floor(Number(args[0]));
            const r = Math.floor(Number(args[1] * 4));
            const g = Math.floor(Number(args[2] * 4));
            const b = Math.floor(Number(args[3] * 4));
            
            Rsed.palette_n.modify_palette_entry(targetPaletteIdx, r, g, b);
        }

        // Command: STOP. Stops parsing the manifesto file.
        function apply_99(args = [])
        {
            Rsed.assert && (args.length === 0)
                        || Rsed.throw("Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
        }
    }
};
