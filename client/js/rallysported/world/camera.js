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

        publicInterface.rotate_camera = function(rotX, rotY, rotZ)
        {
            Rsed.throw("This function has not yet been prepared for use.");
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
