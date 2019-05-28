/*
 * Most recent known filename: js/ui/input.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * Handles user input.
 * 
 */

"use strict";

const ui_input_n = (function()
{
    const publicInterface = {};

    // The current x,y pixel position of the mouse on the screen.
    const mousePos = new Rsed.geometry_n.vector2_o(0, 0);

    // The number of pixels the mouse has moved since the last time set_mouse_pos() was called.
    const mousePosDelta = new Rsed.geometry_n.vector2_o(0, 0);

    // The x,y coordinates of the ground tile the mouse is currently hovering over.
    const mouseTileHover = new Rsed.geometry_n.vector2_o(-1, -1);

    // Whenever the user presses down a mouse button, this object gets filled with relevant information
    // about the click's target (e.g. track prop), so we can maintain that information across frames.
    // This helps us prevent, for instance, accidentally grabbing a prop when moving the mouse over it
    // while painting the ground.
    let mouseLock = null;

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

    // Modifier key statuses.
    let ctrlPressed = false;
    let shiftPressed = false;

    // Keyboard key statuses.
    const keyDown = [];

    function enact_key_presses()
    {
        const movement = new Rsed.geometry_n.vector3_o(0, 0, 0);

        if (keyDown["s"]) movement.x += -1;
        if (keyDown["f"]) movement.x += 1;
        if (keyDown["e"]) movement.z += -1;
        if (keyDown["d"]) movement.z += 1;

        //movement.normalize(); /// TODO: Disabled for now, since diagonal movement is too jerky without the double movement speed.
        Rsed.camera_n.move_camera(movement.x, movement.y, movement.z);
    }

    // Depending on which mouse button (if any) the user has pressed, make corresponding things happen.
    function enact_mouse_clicks()
    {
        if (!(mouseLeftPressed | mouseRightPressed | mouseMiddlePressed)) 
        {
            mouseLock = null;
            return;
        }

        // If we don't already have mouse lock, see which lock we should acquire, based on what the
        // user clicked on.
        if (mouseLock == null)
        {
            switch (hoverPickType)
            {
                case publicInterface.mousePickingType.prop:
                {
                    mouseLock = {grab:"prop",propTrackId:ui_input_n.mouse_hover_args().trackId};
                    break;
                }
                case publicInterface.mousePickingType.ground:
                {
                    mouseLock = {grab:"ground"};
                    break;
                }
                case publicInterface.mousePickingType.ui:
                {
                    mouseLock = {grab:"ui",
                                 elementId:hoverArgs.elementId,
                                 x:hoverArgs.x,
                                 y:hoverArgs.y};  
                    break;
                }
                case publicInterface.mousePickingType.void:
                {
                    return;
                }
                default: k_assert(0, "Unhandled mouse lock type."); break;
            }
        }
        else if (mouseLock.hibernating)
        {
            return;
        }

        // Commit an action depending on what the user clicked on.
        /// FIXME: The nested code gets a bit ugly/unclear here.
        switch (mouseLock.grab)
        {
            case "ground":
            {
                if (hoverPickType !== publicInterface.mousePickingType.ground) return;

                if (shiftPressed)
                {
                    // Add a new prop.
                    if (mouseLeftPressed)
                    {
                        const x = Rsed.maasto_n.clamped_to_track_prop_boundaries(hoverArgs.tileX * Rsed.maasto_n.tile_size());
                        const z = Rsed.maasto_n.clamped_to_track_prop_boundaries(hoverArgs.tileZ * Rsed.maasto_n.tile_size());

                        Rsed.maasto_n.add_prop_location(rsed_n.underlying_track_id(), "tree", x, 0, z);

                        mouseLock.hibernating = true;
                    }
                }
                // Edit/paint the terrain.
                else
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
                }

                break;
            }
            case "prop":
            {
                k_assert((mouseLock.propTrackId != null), "Expected the prop track id as a parameter to prop grabs.");

                if (mouseLeftPressed)
                {
                    // Remove the selected prop.
                    if (shiftPressed)
                    {
                        Rsed.maasto_n.remove_prop(mouseLock.propTrackId);
                        mouseLock.hibernating = true;
                    }
                    // Drag the prop.
                    else
                    {
                        // For now, don't allow moving the starting line (prop #0).
                        if (mouseLock.propTrackId !== 0)
                        {
                            Rsed.maasto_n.move_prop(mouseLock.propTrackId, ui_input_n.mouse_pos_delta_x()*6, ui_input_n.mouse_pos_delta_y()*12)
                        }
                    }
                }

                break;
            }
            case "ui":
            {
                k_assert((mouseLock.elementId != null), "Expected the element id as a parameter to ui grabs.");
                k_assert((mouseLock.x != null && mouseLock.y != null), "Expected x,y coordinates as parameters to ui grabs.");

                switch (mouseLock.elementId)
                {
                    case publicInterface.uiElement.palat_pane:
                    {
                        if (mouseLeftPressed | mouseRightPressed) ui_brush_n.set_brush_pala_idx(mouseLock.x);

                        break;
                    }
                    case publicInterface.uiElement.large_minimap:
                    {
                        if (mouseMiddlePressed)
                        {
                            ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changePala, ui_brush_n.brush_pala_idx(),
                                                              mouseLock.x, mouseLock.y);
                                               
                            // We want the user to be able to paint by dragging the cursor, so we release the mouse lock here
                            // and let it refresh itself next frame with a (potentially) new cursor position.
                            mouseLock = null;
                        }

                        break;
                    }
                    default: k_assert(0, "Unhandled UI element click."); break;
                }
                break;
            }
            default: k_assert(0, "Unknown mouse grab type."); break;
        }
    }
    
    function reset_mouse_hover_info()
    {
        hoverPickType = 0;
        hoverArgs = {};
        
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
                    if ((args.tileX < 0) || (args.tileX >= Rsed.maasto_n.track_side_length()) ||
                        (args.tileZ < 0) || (args.tileZ >= Rsed.maasto_n.track_side_length()))
                    {
                        return null;
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

        publicInterface.reset_mouse_hover_info = function()
        {
            hoverPickType = 0;
            hoverArgs = {};
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

        publicInterface.enact_inputs = function()
        {
            enact_mouse_clicks();
            enact_key_presses();

            // Mouse position deltas shouldn't carry across frames, so now that we've enacted all inputs,
            // we can reset them.
            mousePosDelta.x = 0;
            mousePosDelta.y = 0;
        }

        publicInterface.set_mouse_pos = function(x = 0, y = 0)
        {
            // Don't set the mouse position out of bounds.
            if ((x < 0 || x >= rsed_n.render_width()) ||
                (y < 0 || y >= rsed_n.render_height()))
            {
                return;
            }

            mousePosDelta.x = (x - mousePos.x);
            mousePosDelta.y = (y - mousePos.y);

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

        publicInterface.reset_modifier_key_statuses = function()
        {
            ctrlPressed = false;
            shiftPressed = false;
        }

        // Inform us of a key up/down event. Note: Takes in a HTML onkey* event.
        publicInterface.update_key_status = function(keyEvent, isDown)
        {
            if (keyEvent.ctrlKey ||
                keyEvent.key === "Control") /// TODO: With which browsers would (key === "control") fail to detect?
            {
                ctrlPressed = isDown;
            }
            if (keyEvent.shiftKey ||
                keyEvent.key === "Shift") /// TODO: With which browsers would (key === "shift") fail to detect?
            {
                shiftPressed = isDown;
            }
            else
            {
                /// FIXME: Depending on the browser, the correct code could be in .keyCode or .which.
                const key = String.fromCharCode(keyEvent.keyCode).toLowerCase();
                keyDown[key] = isDown;
            }
        }

        publicInterface.mouse_pos_x = function() { return mousePos.x; }
        publicInterface.mouse_pos_y = function() { return mousePos.y; }

        publicInterface.mouse_pos_delta_x = function() { return mousePosDelta.x; }
        publicInterface.mouse_pos_delta_y = function() { return mousePosDelta.y; }

        publicInterface.mouse_tile_hover_x = function() { return mouseTileHover.x; }
        publicInterface.mouse_tile_hover_y = function() { return mouseTileHover.y; }

        publicInterface.mouse_hover_type = function() { return (hoverPickType || null); }
        publicInterface.mouse_hover_args = function() { return hoverArgs; }

        publicInterface.set_left_click = function(isDown) { mouseLeftPressed = isDown; }
        publicInterface.set_right_click = function(isDown) { mouseRightPressed = isDown; }
        publicInterface.set_middle_click = function(isDown) { mouseMiddlePressed = isDown; }
    }
    return publicInterface;
})();
