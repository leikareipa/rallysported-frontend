const test_camera = function()
{
    unit_tester_n.test_unit("Camera", function()
    {
        // Movement.
        {
            const campos = new geometry_n.vector3_o(camera_n.pos_x(), camera_n.pos_y(), camera_n.pos_z());

            camera_n.move_camera(11, 12, 13, false);
            unit_tester_n.require(((campos.x + 11 * camera_n.movement_speed()) === camera_n.pos_x() &&
                                   (campos.y + 12 * camera_n.movement_speed()) === camera_n.pos_y() &&
                                   (campos.z + 13 * camera_n.movement_speed()) === camera_n.pos_z()), "Move the camera.");

            camera_n.reset_camera_position();
            unit_tester_n.require((camera_n.pos_x() === campos.x && camera_n.pos_y() === campos.y && camera_n.pos_z() === campos.z),
                                  "Reset the camera's position.");
        }
    });
}
