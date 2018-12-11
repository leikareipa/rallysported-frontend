const test_geometry = function()
{
    unit_tester_n.test_unit("Geometry", function()
    {
        // Creation.
        {
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(-54852); }, "Reject a polygon with too few vertices.");
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(-1); }, "Reject a polygon with too few vertices.");
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(0); }, "Reject a polygon with too few vertices.");
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(1); }, "Reject a polygon with too few vertices.");
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(2); }, "Reject a polygon with too few vertices.");
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(12); }, "Reject a polygon with too many vertices.");
            unit_tester_n.reject(function(){ new geometry_n.polygon_o(988853); }, "Reject a polygon with too many vertices.");
        }

        // Cloning.
        {
            const tri1 = new geometry_n.polygon_o(3);
            const tri2 = new geometry_n.polygon_o(3);
            const quad = new geometry_n.polygon_o(4);

            tri1.v[0] = new geometry_n.vertex_o(123, 456, 789);
            tri2.v[0] = new geometry_n.vertex_o(987, 654, 321);
            tri1.clone_from(tri2);
            unit_tester_n.require(((tri1.v[0].x === tri2.v[0].x) &&
                                (tri1.v[0].y === tri2.v[0].y) &&
                                (tri1.v[0].z === tri2.v[0].z)), "Clone a triangle.");

            tri1.v[0] = new geometry_n.vertex_o(111, 222, 333);
            unit_tester_n.require(((tri2.v[0].x === 987) && (tri2.v[0].y === 654) && (tri2.v[0].z === 321)) &&
                                ((tri1.v[0].x === 111) && (tri1.v[0].y === 222) && (tri1.v[0].z === 333)),
                                "Clone by value, not by reference.");

            unit_tester_n.reject(function(){ tri1.clone_from(quad); }, "Reject cloning from a quad into a triangle.");
        }

        // Polygon meshes.
        {
            // Creating polygon meshes.
            {
                const poly1 = new geometry_n.polygon_o(3);
                const poly2 = new geometry_n.polygon_o(6);
                poly1.v[0].x = 321;
                
                const polyList = [poly1, poly2];
                const mesh = new geometry_n.polygon_mesh_o(polyList);

                unit_tester_n.require((mesh.polygons.length === polyList.length), "Import all polygons into the mesh.");
                unit_tester_n.require((mesh.polygons[0].v.length === polyList[0].v.length &&
                                      mesh.polygons[1].v.length === polyList[1].v.length), "Import all polygon vertices into the mesh.");

                mesh.polygons[0].v[0].x = 456;
                unit_tester_n.require((mesh.polygons[0].v[0].x !== poly1.v[0].x), "Decouple mesh polygons from source polygons.");

                unit_tester_n.reject(function(){ new geometry_n.polygon_mesh_o(); }, "Reject creating a null polygon mesh.");
            }
        }
    });
}
