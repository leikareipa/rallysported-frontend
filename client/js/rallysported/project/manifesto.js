/*
 * Most recent known filename: js/project/manifesto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

// Applies the given project's manifesto to the project's data.
// The manifesto is a set of commands that control certain parameters in RallySportED projects;
// like the positioning of certain track-side objects.
Rsed.apply_manifesto = function(targetProject)
{
    Rsed.assert && (!targetProject.isPlaceholder)
                || Rsed.throw("Can't apply manifestos to placeholder projects.");

    const commands = targetProject.manifesto.split("\n").filter(line=>line.trim().length);

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

        // Command: REQUIRE. Specifies which of the eight tracks in Rally-Sport's demo the project
        // is forked from.
        function apply_0(args = [])
        {
            Rsed.assert && (args.length === 3)
                        || Rsed.throw("Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");

            const trackId = Math.floor(Number(args[0]) - 1);
            const palatId = Math.floor(Number(args[1]));
            const minRSEDLoaderVersion = Number(args[2]);

            targetProject.set_track_id(trackId);

            Rsed.palette.set_palette(trackId === 4? 1 :
                                     trackId === 7? 3 : 0);
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

            targetProject.props.set_count(targetProject.track_id(), numObjs);
        }

        // Command: ADD_OBJ. Adds a new prop to the track.
        function apply_3(args = [])
        {
            Rsed.assert && (args.length === 5)
                        || Rsed.throw("Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");

            const propId = Math.floor(Number(args[0]) - 1);
            const posX = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
            const posZ = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

            targetProject.props.add_location(targetProject.track_id(),
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

            targetProject.props.change_prop_type(targetProject.track_id(), targetPropIdx, newPropId);
        }

        // Command: MOVE_OBJ. Moves the position of the given prop.
        function apply_5(args = [])
        {
            Rsed.assert && (args.length === 5)
                        || Rsed.throw("Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");

            const targetPropIdx = Math.floor(Number(args[0]) - 1);
            const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
            const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

            targetProject.props.set_prop_location(targetProject.track_id(), targetPropIdx, {x, z});
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
            const red = Math.floor(Number(args[1] * 4));
            const green = Math.floor(Number(args[2] * 4));
            const blue = Math.floor(Number(args[3] * 4));
            
            Rsed.palette.set_color(targetPaletteIdx, {red, green, blue});
        }

        // Command: STOP. Stops parsing the manifesto file.
        function apply_99(args = [])
        {
            Rsed.assert && (args.length === 0)
                        || Rsed.throw("Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
        }
    }
};
