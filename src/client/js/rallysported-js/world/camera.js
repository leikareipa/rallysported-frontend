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
    // The camera's starting position, in tile units.
    const defaultPosition = {x:15.0, y:0.0, z:13.0};

    // The camera's current position, in tile units.
    const position = {...defaultPosition};

    // The camera's rotation, in degrees.
    const rotation = {x:16, y:0, z:0};

    let verticalZoom = 0;

    const moveSpeed = 0.4;

    const publicInterface =
    {
        // Restore the camera's default position.
        reset_camera_position: function()
        {
            position.x = defaultPosition.x;
            position.y = defaultPosition.y;
            position.z = defaultPosition.z;
        },

        set_camera_position: function(x, y, z)
        {
            position.x = 0;
            position.y = 0;
            position.z = 0;

            this.move_camera((x / moveSpeed),
                             (y / moveSpeed),
                             (z / moveSpeed));
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
                const marginX = 8;
                const marginY = 9;
                
                const maxX = (Rsed.core.current_project().maasto.width - this.view_width);
                const maxY = (Rsed.core.current_project().maasto.width - this.view_height + 1);

                position.x = Math.max(-marginX, Math.min(position.x, (maxX + marginX)));
                position.z = Math.max(-marginY, Math.min(position.z, (maxY + marginY)));
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

            verticalZoom = Math.max(0, Math.min(296, (verticalZoom + delta)));

            position.y = (-verticalZoom * 7);
            rotation.x = (16 + (verticalZoom / 4));

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
            };
        },

        position: function()
        {
            return {...position};
        },

        world_position: function()
        {
            return {
                x: (position.x * Rsed.constants.groundTileSize),
                y: (position.y * Rsed.constants.groundTileSize),
                z: (position.z * Rsed.constants.groundTileSize),
            };
        },

        movement_speed: moveSpeed,

        // How many track ground tiles, horizontally and vertically, should be
        // visible on screen when using this camera.
        view_width: 24,
        view_height: 22,
    };

    publicInterface.reset_camera_position();

    return publicInterface;
})();
