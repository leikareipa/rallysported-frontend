/*
 * Most recent known filename: js/world/camera.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.world.camera = (function()
{
    // The camera's position, in tile units.
    const position = {x:0, y:0, z:0};

    // The camera's rotation, in degrees.
    const rotation = {x:21, y:0, z:0};

    let verticalZoom = 0;

    const moveSpeed = 0.5;

    const publicInterface =
    {
        // Restore the camera's default position.
        reset_camera_position: function()
        {
            position.x = 15;
            position.y = 0;
            position.z = 13;
        },

        move_camera: function(deltaX, deltaY, deltaZ, enforceBounds = true)
        {
            const prevPos = this.position_floored();

            position.x += (deltaX * moveSpeed);
            position.y += (deltaY * moveSpeed);
            position.z += (deltaZ * moveSpeed);

            // Prevent the camera from moving past the track boundaries.
            if (enforceBounds)
            {
                position.x = Math.max(0, Math.min(position.x, Rsed.core.current_project().maasto.width - this.view_width));
                position.z = Math.max(1, Math.min(position.z, (Rsed.core.current_project().maasto.width - this.view_height + 1)));
            }

            const newPos = this.position_floored();
            const posDelta =
            {
                x: (newPos.x - prevPos.x),
                y: (newPos.y - prevPos.y),
                z: (newPos.z - prevPos.z),
            }

            // If the camera moved...
            if (posDelta.x || posDelta.y || posDelta.z)
            {
                window.close_dropdowns(false);
                
                // Force mouse hover to update, since there might now be a different tile under
                // the cursor.
                Rsed.ui.inputState.update_mouse_hover();

                // If the user is grabbing onto a prop while the camera moves, move the prop as well.
                {
                    const grab = Rsed.ui.inputState.current_mouse_grab();

                    if (grab && (grab.type === "prop") &&
                        Rsed.ui.inputState.left_mouse_button_down())
                    {
                        // Note: the starting line (always prop #0) is not user-editable.
                        if (grab.propTrackIdx !== 0)
                        {
                            Rsed.core.current_project().props.move(Rsed.core.current_project().track_id(),
                                                                   grab.propTrackIdx,
                                                                   {
                                                                       x: (posDelta.x * Rsed.constants.groundTileSize),
                                                                       z: (posDelta.z * Rsed.constants.groundTileSize),
                                                                   });
                        }
                    }
                }
            }

            return;
        },

        rotate_camera: function(xDelta, yDelta, zDelta)
        {
            Rsed.throw_if_not_type("number", xDelta, yDelta, zDelta);

            rotation.x += xDelta;
            rotation.y += yDelta;
            rotation.z += zDelta;

            return;
        },

        // Moves the camera up/down while tilting it up/down, so that at its highest
        // point, the camera is pointed directly down, and at its lowest point toward
        // the horizon.
        zoom_vertically: function(delta)
        {
            Rsed.throw_if_not_type("number", delta);

            verticalZoom = Math.max(0, Math.min(265, (verticalZoom + delta)));

            position.y = (-verticalZoom * 7);
            rotation.x = (21 + (verticalZoom / 4));

            return;
        },

        rotation: function()
        {
            return Rngon.rotation_vector(rotation.x, rotation.y, rotation.z);
        },

        position_floored: function()
        {
            return {
                x: Math.floor(position.x),
                y: Math.floor(position.y),
                z: Math.floor(position.z),
            }
        },

        position: function()
        {
            return {
                x: position.x,
                y: position.y,
                z: position.z,
            }
        },

        movement_speed: moveSpeed,

        // How many track ground tiles, horizontally and vertically, should be
        // visible on screen when using this camera.
        view_width: 17,
        view_height: 17,
    };

    publicInterface.reset_camera_position();

    return publicInterface;
})();
