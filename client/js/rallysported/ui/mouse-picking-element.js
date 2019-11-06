/*
 * Most recent known filename: js/ui/mouse-picking.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Returns an object that can be assigned to an element in the mouse-picking buffer.
//
// The 'type' parameter determines the type of mouse-picking; while the 'args' object
// will be appended as-is to the object returned - it will thus contain the custom
// values that you want to include in this element of the mouse-picking buffer.
//
// The returned object takes the following form:
//
//   {
//       type,
//       ...args,
//   }
//
// Although you could simply create this object in-place rather than by calling this
// function, the function will additionally perform checks on the validity of the
// object prior to returning it - like whether it contains at least the required
// arguments.
//
Rsed.ui.mouse_picking_element = function(type = "", args = {})
{
    Rsed.throw_if_not_type("string", type);
    Rsed.throw_if_not_type("object", args);

    // Verify that the arguments are correct.
    switch (type)
    {
        // An element displayed on the user interface (e.g. the track minimap).
        //
        // Requires the following properties:
        //
        //   uiElementId: A string identifying this UI element.
        //
        case "ui-element":
        {
            Rsed.throw_if_not_type("string", args.uiElementId);
            break;
        }
        
        // A track-side 3d object.
        //
        // Requires the following properties:
        //
        //   propId: A value identifying the prop's type (e.g. tree, rock, house).
        //   propTrackIdx: The prop's index among all props on the track.
        //
        case "prop":
        {
            Rsed.throw_if_not_type("number", args.propTrackIdx, args.propId);
            break;
        }

        // A ground tile on the 3d track heightmap.
        //
        // Requires the following properties:
        //
        //   groundTileX: Ground tile index on the X axis (so e.g. 127 is the last tile on a 128-tile-wide track).
        //   groundTileY: Ground tile index on the Y axis.
        //     
        case "ground":
        {
            Rsed.throw_if_not_type("number", args.groundTileX, args.groundTileY);
            break;
        }

        default: Rsed.throw("Unrecognized mouse-picking type."); break;
    }

    return {type, ...args};
}
