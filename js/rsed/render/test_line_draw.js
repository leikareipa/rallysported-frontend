const test_line_draw = function()
{
    unit_tester_n.test_unit("Line draw", function()
    {
        // Diagonal line into array.
        {
            const vert1 = new geometry_n.vertex_o(0, 0, 0);
            const vert2 = new geometry_n.vertex_o(2, 2, 0);
            const array = [];

            line_draw_n.line_into_array(vert1, vert2, array, 0);
            unit_tester_n.require(((array.length === 3) && (array[0] === 0 && array[1] === 1 && array[2] === 2)),
                                  "Draw a diagonal line into an array.");
        }

        // Horizontal line into array.
        {
            const vert1 = new geometry_n.vertex_o(0, 0, 0);
            const vert2 = new geometry_n.vertex_o(2, 0, 0);
            const array = [];

            line_draw_n.line_into_array(vert1, vert2, array, 0);
            unit_tester_n.require(((array.length === 1) && (array[0] === 0)), "Draw a horizontal line into an array.");
        }

        // Vertical line into array.
        {
            const vert1 = new geometry_n.vertex_o(15, 0, 0);
            const vert2 = new geometry_n.vertex_o(15, 2, 0);
            const array = [];

            line_draw_n.line_into_array(vert1, vert2, array, 0);
            unit_tester_n.require(((array.length === 3) && (array[0] === 15 && array[1] === 15 && array[2] === 15)), "Draw a vertical line into an array.");
        }
    });
}
