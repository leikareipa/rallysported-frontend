/*
 * Most recent known filename: js/track/manifesto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 * Parses RallySportED's manifesto files.
 *
 */

"use strict"

const manifesto_n = (function()
{
    const manifestoCommands = Object.freeze({"0": apply_0,
                                             "1": apply_1,
                                             "2": apply_2,
                                             "3": apply_3,
                                             "4": apply_4,
                                             "5": apply_5,
                                             "6": apply_6,
                                             "10": apply_10,
                                             "99": apply_99})

    // Command: require. Sets up the track with the correct MAASTO, VARIMAA, etc. files.
    // You'd generally wait until the promise this returns resolves before engaging any
    // other manifesto commands, since they might otherwise be modifying incomplete data.
    function apply_0(args = [])
    {
        return new Promise((resolve, reject) =>
        {
            k_assert((args.length === 3), "Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");

            const trackId = Math.floor(Number(args[0]));
            const palatId = Math.floor(Number(args[1]));
            const minRSEDLoaderVersion = Number(args[2]);

            rsed_n.initialize_track_data(trackId).then(()=>{resolve();});
        });
    }

    // Command: road. Sets up the game's driving physics for various kinds of road surfaces.
    function apply_1(args = [])
    {
        k_assert((args.length === 1), "Invalid number of arguments to manifesto command 1. Expected 1 but received " + args.length + ".");
    }

    // Command: num_objs. Sets the number of props (in addition to the starting line) on the track.
    function apply_2(args = [])
    {
        k_assert((args.length === 1), "Invalid number of arguments to manifesto command 2. Expected 1 but received " + args.length + ".");

        const numObjs = Math.floor(Number(args[0]));

        maasto_n.set_prop_count(numObjs);
    }

    // Command: add_obj. Adds a new prop to the track.
    function apply_3(args = [])
    {
        k_assert((args.length === 5), "Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");

        const propTypeIdx = Math.floor(Number(args[0]) - 1);
        const posX = Math.floor(((Number(args[1]) * 2) * maasto_n.tile_size()) + Number(args[3]));
        const posZ = Math.floor(((Number(args[2]) * 2) * maasto_n.tile_size()) + Number(args[4]));

        maasto_n.add_prop_location(rsed_n.underlying_track_id(), props_n.prop_name_for_idx(propTypeIdx), posX, 0, posZ);
    }

    // Command: change_obj_type. Changes the type of the given prop.
    function apply_4(args = [])
    {
        k_assert((args.length === 2), "Invalid number of arguments to manifesto command 4. Expected 2 but received " + args.length + ".");

        const targetPropIdx = Math.floor(Number(args[0]) - 1);
        const newType = Math.floor(Number(args[1]) - 1);

        maasto_n.change_prop_type(targetPropIdx, newType);
    }

    // Command: move_obj. Moves the position of the given prop.
    function apply_5(args = [])
    {
        k_assert((args.length === 5), "Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");

        const targetPropIdx = Math.floor(Number(args[0]) - 1);
        const posX = Math.floor(((Number(args[1]) * 2) * maasto_n.tile_size()) + Number(args[3]));
        const posZ = Math.floor(((Number(args[2]) * 2) * maasto_n.tile_size()) + Number(args[4]));

        maasto_n.set_prop_position(targetPropIdx, posX, posZ);
    }

    // Command: move_starting_pos. Moves the starting line. Note that this doesn't move the
    // starting line prop, but the starting position of the player's car. So we can ignore
    // it in the editor.
    function apply_6(args = [])
    {
        k_assert((args.length === 4), "Invalid number of arguments to manifesto command 6. Expected 4 but received " + args.length + ".");
    }

    // Command: change_palette_entry. Changes the given palette index to the given r,g,b values.
    function apply_10(args = [])
    {
        k_assert((args.length === 4), "Invalid number of arguments to manifesto command 10. Expected 4 but received " + args.length + ".");

        const targetPaletteIdx = Math.floor(Number(args[0]));
        const r = Math.floor(Number(args[1] * 4));
        const g = Math.floor(Number(args[2] * 4));
        const b = Math.floor(Number(args[3] * 4));
        
        palette_n.modify_palette_entry(targetPaletteIdx, r, g, b);
    }

    // Command: stop. Stops parsing the manifesto file.
    function apply_99(args = [])
    {
        k_assert((args.length === 0), "Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
    }

    const publicInterface = {};
    {
        // Enacts the given manifesto string. Returns a promise which is resolved once the manifesto has been
        // fully applied.
        publicInterface.apply_manifesto = function(manifestoString)
        {
            return new Promise((resolve, reject) =>
            {
                const lines = manifestoString.split("\n").filter(Boolean);
                k_assert((lines.length >= 2), "Invalid number of lines in the manifesto file.");

                // Apply the first manifesto command, 0, which sets up the track by loading in all data, etc.
                const params = lines[0].split(" ");
                const commandId = Number(params.shift());
                const initialize_track = manifestoCommands[0];
                k_assert((commandId === 0), "Expected the first command in the manifesto to be 0.");

                // Once the first command has finished loading all data, we can continue with the other
                // manifesto commands, which manipulate those data.
                initialize_track(params)
                .then(()=>
                {
                    for (let i = 1; i < lines.length; i++)
                    {
                        const params = lines[i].split(" ");
                        const commandId = Number(params.shift());
                        const command = manifestoCommands[commandId];
                        k_assert((command != null), "Unsupported command (" + commandId + ") in the manifesto file.");

                        if ((commandId === 99) && (i !== (lines.length - 1)))
                        {
                            k_assert(0, "Expected the command 99 to be the manifesto's last one.");
                        }

                        command(params);
                    }
                })
                .then(()=>{resolve();});
            });
        }

        // Will take the given manifesto string (the full contents of a manifesto file) and process it for
        // saving. This processing will involve, for instance, updating track prop positions in instances
        // of command #5.
        publicInterface.get_saveable_manifesto = function(manifestoString)
        {
            const manifLines = manifestoString.split("\n").filter(Boolean);

            // The last manifesto command in the file should always be 99.
            if (manifLines[manifLines.length - 1] !== "99")
            {
                alert("RallySportED detected a possibly invalid manifesto file. Saving it anyway, but just a heads-up.");
                return manifestoString;
            }

            let newManifesto = "";

            // Copy verbatim any manifesto commands we won't update.
            for (let i = 0; i < (manifLines.length - 1); i++)
            {
                const params = manifLines[i].split(" ");
                k_assert(params.length > 0, "Did not expect an empty parameters list.");

                switch (params[0])
                {
                    case 2:
                    case 4:
                    case 5: break;
                    default: newManifesto += (manifLines[i] + "\n");
                }
            }

            // Add command 2 to set the number of props.
            newManifesto += ("2 " + maasto_n.num_props() + "\n");
            
            // Add command 5 for all props on the track, except for the starting line (first prop in the list), so they
            // get put in their correct places.
            {
                const propLocations = maasto_n.prop_locations();

                for (let i = 1; i < propLocations.length; i++)
                {
                    const globalX = Math.floor((propLocations[i].x / maasto_n.tile_size()) / 2);
                    const globalZ = Math.floor((propLocations[i].z / maasto_n.tile_size()) / 2);

                    const localX = Math.floor((((propLocations[i].x / maasto_n.tile_size()) / 2) - globalX) * 256);
                    const localZ = Math.floor((((propLocations[i].z / maasto_n.tile_size()) / 2) - globalZ) * 256);

                    newManifesto += ("5 " + (i + 1) + " " + globalX + " " + globalZ + " " + localX + " " + localZ + "\n");
                }
            }

            // Add command 4 for all props, except for the starting line, to make sure they're the right type.
            {
                const propNames = maasto_n.prop_names();
                
                for (let i = 1; i < propNames.length; i++)
                {
                    const typeId = props_n.prop_idx_for_name(propNames[i]);

                    newManifesto += ("4 " + (i + 1) + " " + (typeId + 1) + "\n");
                }
            }

            newManifesto += "99\n";

            return newManifesto;
        }
    }
    return publicInterface;
})();
