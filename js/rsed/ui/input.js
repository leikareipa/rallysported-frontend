/*
 * Most recent known filename: js/ui/input.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * Handles user input.
 * 
 */

"use strict"

const ui_input_n = (function()
{
    const publicInterface = {};

    // The current x,y pixel position of the mouse on the screen.
    const mousePos = new geometry_n.vector2_o(0, 0);

    // The x,y coordinates of the ground tile the mouse is currently hovering over.
    const mouseTileHover = new geometry_n.vector2_o(-1, -1);

    // Mouse-picking information about what's under the cursor at present.
    /// TODO. Move mouse-picking stuff into its own unit.
    let hoverPickType = 0;
    let hoverArgs = {};

    // Bit sizes for the various arguments that can be stored in the mouse-picking id.
    /// TODO. Move mouse-picking stuff into its own unit.
    const numBitsForIndex = 5;
    const numBitsForTileCoords = 13;
    const numBitsForPropIdx = 10;
    const numBitsForPropTrackId = 10;
    const numBitsForUiElementId = 5;
    const numBitsForUiCoord = 11;

    // Mouse button statuses.
    let mouseLeftPressed = false;
    let mouseMiddlePressed = false;
    let mouseRightPressed = false;

    // Keyboard key statuses.
    const keyDown = [];

    function enact_key_presses()
    {
        const movement = new geometry_n.vector3_o(0, 0, 0);

        if (keyDown["s"]) movement.x += -1;
        if (keyDown["f"]) movement.x += 1;
        if (keyDown["e"]) movement.z += -1;
        if (keyDown["d"]) movement.z += 1;

        //movement.normalize(); /// TODO: Disabled for now, since diagonal movement is too jerky without the double movement speed.
        camera_n.move_camera(movement.x, movement.y, movement.z);
    }

    // Depending on which mouse button (if any) the user has pressed, make corresponding things happen.
    function enact_mouse_clicks()
    {
        if (!(mouseLeftPressed | mouseRightPressed | mouseMiddlePressed)) return;

        switch (hoverPickType)
        {
            case publicInterface.mousePickingType.ground:
            {
                if (mouseLeftPressed | mouseRightPressed)
                {
                    const delta = (mouseLeftPressed? 2 : (mouseRightPressed? -2 : 0));
                    ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changeHeight, delta,
                                                      hoverArgs.tileX, hoverArgs.tileZ);
                }
                else if (mouseMiddlePressed)
                {
                    ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changePala, ui_brush_n.brush_pala_idx(),
                                                      hoverArgs.tileX, hoverArgs.tileZ);
                }

                break;
            }
            case publicInterface.mousePickingType.ui:
            {
                switch (hoverArgs.elementId)
                {
                    case publicInterface.uiElement.palat_pane:
                    {
                        if (mouseLeftPressed | mouseRightPressed) ui_brush_n.set_brush_pala_idx(hoverArgs.x);

                        break;
                    }
                    case publicInterface.uiElement.large_minimap:
                    {
                        if (mouseMiddlePressed)
                        {
                            ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changePala, ui_brush_n.brush_pala_idx(),
                                                              hoverArgs.x, hoverArgs.y);
                        }

                        break;
                    }
                    default: k_assert(0, "Unhandled UI element click."); break;
                }

                break;
            }
            default: break;
        }
    }
    
    function reset_mouse_hover_info()
    {
        mouseTileHover.x = -1000;
        mouseTileHover.y = -1000;
    }

    // Public interface.
    {
        publicInterface.mousePickingType = Object.freeze({void:0, ground:1, prop:2, ui:3});

        // The different user-interactible elements in the UI. Their index values in this list will be
        // used for mouse-picking identification.
        publicInterface.uiElement = Object.freeze({void:0, palat_pane:1, minimap:2, large_minimap:3, active_pala:4});

        // Encodes the given arguments into a single 32-bit value, which can be e.g. written into a
        // mouse-picking buffer element for later extraction. The picking type string decides in which
        // pre-set order/manner the arguments should be packed.
        publicInterface.create_mouse_picking_id = function(pickType = 0, args = {})
        {
            k_assert(((pickType & ((1<<numBitsForIndex)-1)) === pickType), "Can't store the picking index in the given number of bytes.");

            let id = pickType;
            switch (pickType)
            {
                case this.mousePickingType.void:
                {
                    return id;
                }
                case this.mousePickingType.ui:
                {
                    const numBitsRequired = (numBitsForUiElementId + (numBitsForUiCoord * 2) + numBitsForIndex);

                    k_assert((numBitsRequired <= 32), "Not enough bits to store the mouse-picking args for a UI element.");
                    k_assert((args.elementId != null && args.uiX != null && args.uiY != null), "Missing arguments for a UI picking id.");

                    id |= (args.uiX << numBitsForIndex);
                    id |= (args.uiY << (numBitsForIndex + numBitsForUiCoord));
                    id |= (args.elementId << (numBitsForIndex + (numBitsForUiCoord * 2)));

                    return id;
                }
                case this.mousePickingType.prop:
                {
                    const numBitsRequired = (numBitsForPropIdx + numBitsForPropTrackId + numBitsForIndex);

                    k_assert((numBitsRequired <= 32), "Not enough bits to store the mouse-picking args for a prop.");
                    k_assert((args.propIdx != null && args.propTrackId != null), "Missing arguments for a prop picking id.");

                    id |= (args.propIdx << numBitsForIndex);
                    id |= (args.propTrackId << (numBitsForIndex + numBitsForPropIdx));

                    return id;
                }
                case this.mousePickingType.ground:
                {
                    const numBitsRequired = (numBitsForTileCoords * 2 + numBitsForIndex);

                    k_assert((numBitsRequired <= 32), "Not enough bits to store the mouse-picking args for a ground tile.");
                    k_assert((args.tileX != null && args.tileZ != null), "Missing arguments for a ground picking id.");

                    // The tile coordinates can be out of bounds when the camera is moved outside of the
                    // track's boundaries. In that case, simply ignore them, since there's no interactible
                    // ground elements outside of the track.
                    if ((args.tileX < 0) || (args.tileX >= maasto_n.track_side_length()) ||
                        (args.tileZ < 0) || (args.tileZ >= maasto_n.track_side_length()))
                    {
                        return null;
                    }

                    if ((args.tileX & ((1<<numBitsForTileCoords)-1)) !== args.tileX)
                    {
                        console.log(args.tileX, args.tileZ)
                    }

                    k_assert(((args.tileX & ((1<<numBitsForTileCoords)-1)) === args.tileX), "Can't store the MAASTO x coordinate in the picking id.");
                    k_assert(((args.tileZ & ((1<<numBitsForTileCoords)-1)) === args.tileZ), "Can't store the MAASTO z coordinate in the picking id.");

                    id |= (args.tileX << numBitsForIndex);
                    id |= (args.tileZ << (numBitsForIndex + numBitsForTileCoords));

                    return id;
                }
                default: k_assert(0, "Undefined mouse-picking case when packing."); return null;
            }

            k_assert(0, "Fell through (shouldn't have) when creating a mouse-picking id.");
        }

        publicInterface.get_mouse_picking_type = function(mousePickingValue)
        {
            return (mousePickingValue & ((1 << numBitsForIndex) - 1));
        }

        publicInterface.get_mouse_picking_args = function(mousePickingValue = 0, pickType = 0)
        {
            const args = {};
            switch (pickType)
            {
                case this.mousePickingType.ui:
                {
                    const coordMask = ((1 << numBitsForUiCoord) - 1);
                    const idMask = ((1 << numBitsForUiElementId) - 1);
                    args.x = ((mousePickingValue >>> numBitsForIndex) & coordMask);
                    args.y = ((mousePickingValue >>> (numBitsForIndex + numBitsForUiCoord)) & coordMask);
                    args.elementId = ((mousePickingValue >>> (numBitsForIndex + (numBitsForUiCoord * 2))) & idMask);

                    return args;
                }
                case this.mousePickingType.ground:
                {
                    const mask = ((1 << numBitsForTileCoords) - 1);
                    args.tileX = ((mousePickingValue >>> numBitsForIndex) & mask);
                    args.tileZ = ((mousePickingValue >>> (numBitsForIndex + numBitsForTileCoords)) & mask);

                    return args;
                }
                case this.mousePickingType.prop:
                {
                    const mask = ((1 << numBitsForPropIdx) - 1);
                    args.idx = ((mousePickingValue >>> numBitsForIndex) & mask);
                    args.trackId = ((mousePickingValue >>> (numBitsForIndex + numBitsForPropIdx)) & mask);

                    return args;
                }
                default: return null;
            }

            k_assert(0, "Fell through (shouldn't have) when extracting mouse-picking args.");
        }

        publicInterface.update_inputs = function()
        {
            enact_mouse_clicks();
            enact_key_presses();
        }

        publicInterface.set_mouse_pos = function(x = 0, y = 0)
        {
            // Don't set the mouse position out of bounds.
            if ((x < 0 || x >= rsed_n.render_width()) ||
                (y < 0 || y >= rsed_n.render_height()))
            {
                return;
            }

            mousePos.x = x;
            mousePos.y = y;

            // Update mouse-picking info, i.e. find out what the mouse cursor is hovering over.
            {
                reset_mouse_hover_info();

                const mousePickValue = rsed_n.mouse_pick_buffer_value_at(x, y);
                hoverPickType = this.get_mouse_picking_type(mousePickValue);
                hoverArgs = this.get_mouse_picking_args(mousePickValue, hoverPickType);

                switch(hoverPickType)
                {
                    case this.mousePickingType.ground:
                    {
                        mouseTileHover.x = hoverArgs.tileX;
                        mouseTileHover.y = hoverArgs.tileZ;

                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
        }

        publicInterface.mouse_pos_x = function() { return mousePos.x; }
        publicInterface.mouse_pos_y = function() { return mousePos.y; }

        publicInterface.mouse_tile_hover_x = function() { return mouseTileHover.x; }
        publicInterface.mouse_tile_hover_y = function() { return mouseTileHover.y; }

        publicInterface.mouse_hover_type = function() { return (hoverPickType || null); }
        publicInterface.mouse_hover_args = function() { return hoverArgs; }

        publicInterface.set_left_click = function(isDown) { mouseLeftPressed = isDown; }
        publicInterface.set_right_click = function(isDown) { mouseRightPressed = isDown; }
        publicInterface.set_middle_click = function(isDown) { mouseMiddlePressed = isDown; }

        publicInterface.set_key_status = function(key, isDown) { keyDown[key] = isDown; }
    }
    return publicInterface;
})();