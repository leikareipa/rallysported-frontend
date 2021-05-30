/*
 * Most recent known filename: js/scene/terrain-editor/camera.js
 *
 * 2018 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.scenes["terrain-editor"].camera = (function()
{
    const defaultPosition = {x:15.0, y:0.0, z:13.0};
    const position = {...defaultPosition};
    const rotation = {x:16, y:0, z:0};

    // Tilting combines vertical rotation and movement to shift the camera's
    // view down and toward the middle tile row on the screen.
    let tilt = 0;

    const publicInterface =
    {
        // How many track ground tiles, horizontally and vertically, should be
        // visible on screen when using this camera.
        viewportWidth: 28,
        viewportHeight: 34,

        get tilt()
        {
            return tilt;
        },

        reset_position: function()
        {
            position.x = defaultPosition.x;
            position.y = defaultPosition.y;
            position.z = defaultPosition.z;
        },

        move_to: function(x, y, z)
        {
            position.x = 0;
            position.y = 0;
            position.z = 0;

            this.move_by(x, y, z);
        },

        move_by: function(deltaX, deltaY, deltaZ, enforceBounds = true)
        {
            const prevPos = this.position_floored();

            position.x += deltaX;
            position.y += deltaY;
            position.z += deltaZ;

            // Prevent the camera from moving past the track boundaries.
            if (enforceBounds)
            {
                const marginX = 8;
                const marginY = 14;
                
                const maxX = (Rsed.$currentProject.maasto.width - this.viewportWidth);
                const maxY = (Rsed.$currentProject.maasto.width - this.viewportHeight + 1);

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
                Rsed.core.forceUpdateMouseHoverOnTickEnd = true;

                // If the user is grabbing onto a prop while the camera moves, move the prop as well.
                if (Rsed.ui.inputState.left_mouse_button_down())
                {
                    const grab = Rsed.ui.inputState.current_mouse_grab();

                    if (grab && (grab.type == "prop"))
                    {
                        // Note: the starting line (always prop #0) is not user-editable.
                        if (grab.propTrackIdx !== 0)
                        {
                            Rsed.$currentProject.props.move(Rsed.$currentProject.track_id(),
                                                            grab.propTrackIdx, {
                                x: (posDelta.x * Rsed.constants.groundTileSize),
                                z: (posDelta.z * Rsed.constants.groundTileSize),
                            });
                        }
                    }
                }
            }

            return;
        },

        rotate_by: function(xDelta, yDelta, zDelta)
        {
            Rsed.throw_if_not_type("number", xDelta, yDelta, zDelta);

            rotation.x += xDelta;
            rotation.y += yDelta;
            rotation.z += zDelta;

            return;
        },

        tilt_by: function(delta)
        {
            Rsed.throw_if_not_type("number", delta);

            tilt = Math.max(0, Math.min(296, (tilt + delta)));

            position.y = (-tilt * 7);
            rotation.x = (16 + (tilt / 10));

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
    };

    return publicInterface;
})();
