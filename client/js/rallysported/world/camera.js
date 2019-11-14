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

    const moveSpeed = 0.4;

    const publicInterface = {};
    {
        // Restore the camera's default position.
        publicInterface.reset_camera_position = function()
        {
            position.x = 15;
            position.y = 0;
            position.z = 13;
        }

        publicInterface.move_camera = function(deltaX, deltaY, deltaZ, enforceBounds = true)
        {
            const prevPos = {...position};

            position.x += (deltaX * moveSpeed);
            position.y += (deltaY * moveSpeed);
            position.z += (deltaZ * moveSpeed);

            // Prevent the camera from moving past the track boundaries.
            if (enforceBounds)
            {
                position.x = Math.max(0, Math.min(position.x, Rsed.core.current_project().maasto.width - this.view_width()));
                position.z = Math.max(1, Math.min(position.z, (Rsed.core.current_project().maasto.width - this.view_height() + 1)));
            }

            // If the camera moved...
            if ((position.x !== prevPos.x) ||
                (position.y !== prevPos.y) ||
                (position.z !== prevPos.z))
            {
                window.close_dropdowns();
                
                // Force mouse hover to update, since there might now be a different tile under
                // the cursor than there was before the camera moved.
                Rsed.ui.inputState.set_mouse_pos(Rsed.ui.inputState.mouse_pos().x,
                                                 Rsed.ui.inputState.mouse_pos().y);

                // If the user is dragging a prop and the camera has moved, move the prop as well.
                {
                    const grab = Rsed.ui.inputState.current_mouse_grab();

                    if (grab && (grab.type === "prop") &&
                        Rsed.ui.inputState.left_mouse_button_down())
                    {
                        // For now, don't allow moving the starting line (always prop #0).
                        if (grab.propTrackIdx !== 0)
                        {
                            Rsed.core.current_project().props.move(Rsed.core.current_project().track_id(),
                                                                   grab.propTrackIdx,
                                                                   {
                                                                       x: (deltaX * moveSpeed * Rsed.constants.groundTileSize),
                                                                       z: (deltaZ * moveSpeed * Rsed.constants.groundTileSize),
                                                                   });
                        }
                    }
                }
            }

            return;
        }

        publicInterface.rotate_camera = function(xDelta, yDelta, zDelta)
        {
            Rsed.throw_if_not_type("number", xDelta, yDelta, zDelta);

            rotation.x = xDelta;
            rotation.y += yDelta;
            rotation.z += zDelta;

            return;
        }

        // Moves the camera up/down while tilting it up/down, so that at its highest
        // point, the camera is pointed directly down, and at its lowest point toward
        // the horizon.
        publicInterface.zoom_vertically = function(delta)
        {
            Rsed.throw_if_not_type("number", delta);

            verticalZoom = Math.max(0, Math.min(265, (verticalZoom + delta)));

            position.y = (-verticalZoom * 7);
            rotation.x = (21 + (verticalZoom / 4));

            return;
        },

        publicInterface.rotation = function()
        {
            return Rngon.rotation_vector(rotation.x, rotation.y, rotation.z);
        }

        publicInterface.pos_x = function() { return position.x; }
        publicInterface.pos_y = function() { return position.y; }
        publicInterface.pos_z = function() { return position.z; }

        publicInterface.movement_speed = function() { return moveSpeed; }

        // How many tiles horizontally and vertically should be visible on screen with this camera.
        publicInterface.view_width = function() { return 17; }
        publicInterface.view_height = function() { return 17; }
    }

    publicInterface.reset_camera_position();

    return publicInterface;
})();
