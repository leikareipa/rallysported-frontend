/*
 * Most recent known filename: js/utest/rsed_tests.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Unit tests for the browser version of RallySportED.
 *
 */

rsed_unit_tests = function()
{
    unit_tester_n.run_tests(function()
    {
        test_matrix44();
        test_geometry();
        test_camera();
        test_color();
        test_texture();
        test_render_surface();
        test_line_draw();
    }, "RallySportED in the browser")
}();
