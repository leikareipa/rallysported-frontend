"use strict";

const unitTestResults = unit_tests("RallySportED (JS)", ()=>
{
    unit("Camera", ()=>
    {
        // Movement.
        {
            Rsed.camera_n.reset_camera_position();
            const camPos = new geometry_n.vector3_o(Rsed.camera_n.pos_x(), Rsed.camera_n.pos_y(), Rsed.camera_n.pos_z());

            Rsed.camera_n.move_camera(11, 12, 13, false);
            expect_true([()=>((camPos.x + 11 * Rsed.camera_n.movement_speed()) === Rsed.camera_n.pos_x()),
                         ()=>((camPos.y + 12 * Rsed.camera_n.movement_speed()) === Rsed.camera_n.pos_y()),
                         ()=>((camPos.z + 13 * Rsed.camera_n.movement_speed()) === Rsed.camera_n.pos_z())]);

            Rsed.camera_n.reset_camera_position();
            expect_true([()=>(Rsed.camera_n.pos_x() === camPos.x),
                         ()=>(Rsed.camera_n.pos_y() === camPos.y),
                         ()=>(Rsed.camera_n.pos_z() === camPos.z)]);
        }
    });

    unit("Line draw", ()=>
    {
        // Diagonal line into array.
        {
            const vert1 = new geometry_n.vertex_o(0, 0, 0);
            const vert2 = new geometry_n.vertex_o(2, 2, 0);
            const array = [];

            draw_line_n.line_into_array(vert1, vert2, array, 0);
            expect_true([()=>(array.length === 3),
                         ()=>(array[0] === 0),
                         ()=>(array[1] === 1),
                         ()=>(array[2] === 2)]);
        }

        // Horizontal line into array.
        {
            const vert1 = new geometry_n.vertex_o(0, 0, 0);
            const vert2 = new geometry_n.vertex_o(2, 0, 0);
            const array = [];

            draw_line_n.line_into_array(vert1, vert2, array, 0);
            expect_true([()=>(array.length === 1),
                         ()=>(array[0] === 0)]);
        }

        // Vertical line into array.
        {
            const vert1 = new geometry_n.vertex_o(15, 0, 0);
            const vert2 = new geometry_n.vertex_o(15, 2, 0);
            const array = [];

            draw_line_n.line_into_array(vert1, vert2, array, 0);
            expect_true([()=>(array.length === 3),
                         ()=>(array[0] === 15),
                         ()=>(array[1] === 15),
                         ()=>(array[2] === 15)]);
        }
    });

    unit("Render surface", ()=>
    {
        // Creation of a render surface.
        {
            const surfaceName = "render_surface";
            const surfaceType = "svg";
            const containerName = "render_surface_test_container";

            // Make sure the element into which we'll create the render surface doesn't exist yet.
            expect_true([()=>(document.getElementById(containerName) === null)]);

            // Insert the surface's container element into the HTML.
            const containerElement = document.createElement("div");
            containerElement.setAttribute("id", containerName);
            document.body.appendChild(containerElement)

            const surface = new render_surface_n.render_surface_o(surfaceName, surfaceType, containerName, function(){});
            expect_true([()=>(surface instanceof render_surface_n.render_surface_o)]);

            // Shouldn't be able to create a render surface with a null polyfill function.
            expect_fail([()=>{new render_surface_n.render_surface_o(surfaceName, surfaceType, containerName, null);}]);

            // See that the HTML id tags are correct.
            expect_true([()=>(surface.containerId === containerName),
                         ()=>(surface.elementId === surfaceName),
                         ()=>(surface.elementName === surfaceType)]);
            
            // See that the surface container element was assigned correctly.
            expect_true([()=>(surface.containerElement === containerElement)]);

            // See that the render surface element was created successfully.
            expect_true([()=>(surface.element === document.getElementById(surfaceName))]);

            /// TODO. Test rendering into the surface.
            
            containerElement.remove();
        }
    });

    unit("Geometry", ()=>
    {
        // Creation.
        {
            expect_fail([()=>{new geometry_n.polygon_o(-54852);}, // Too few vertices.
                         ()=>{new geometry_n.polygon_o(-1);}, // Too few vertices.
                         ()=>{new geometry_n.polygon_o(0);}, // Too few vertices.
                         ()=>{new geometry_n.polygon_o(1);}, // Too few vertices.
                         ()=>{new geometry_n.polygon_o(2);}, // Too few vertices.
                         ()=>{new geometry_n.polygon_o(12);}, // Too many vertices.
                         ()=>{new geometry_n.polygon_o(988853);}]); // Too many vertices.
        }

        // Cloning.
        {
            const tri1 = new geometry_n.polygon_o(3);
            const tri2 = new geometry_n.polygon_o(3);
            const quad = new geometry_n.polygon_o(4);

            tri1.v[0] = new geometry_n.vertex_o(123, 456, 789);
            tri2.v[0] = new geometry_n.vertex_o(987, 654, 321);
            tri1.clone_from(tri2);
            expect_true([()=>(tri1.v[0].x === tri2.v[0].x),
                         ()=>(tri1.v[0].y === tri2.v[0].y),
                         ()=>(tri1.v[0].z === tri2.v[0].z)]);

            // See that the cloning is by value, not by reference.
            tri1.v[0] = new geometry_n.vertex_o(111, 222, 333);
            expect_true([()=>(tri2.v[0].x === 987),
                         ()=>(tri2.v[0].y === 654),
                         ()=>(tri2.v[0].z === 321),
                         ()=>(tri1.v[0].x === 111),
                         ()=>(tri1.v[0].y === 222),
                         ()=>(tri1.v[0].z === 333)]);

            // Reject cloning from a quad into a triangle.
            expect_fail([()=>{tri1.clone_from(quad);}]);
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

                // See that all polys and vertices were imported.
                expect_true([()=>(mesh.polygons.length === polyList.length),
                             ()=>(mesh.polygons[0].v.length === polyList[0].v.length),
                             ()=>(mesh.polygons[1].v.length === polyList[1].v.length)]);

                // See that vertices were copied by value, not by reference.
                mesh.polygons[0].v[0].x = 456;
                expect_true([()=>(mesh.polygons[0].v[0].x !== poly1.v[0].x)]);

                // Reject creating a null polygon mesh.
                expect_fail([()=>{new geometry_n.polygon_mesh_o();}])
            }
        }
    });

    unit("Matrix (4x4)", ()=>
    {
        {
            const m = matrix44_n.identity_matrix();
            expect_true([()=>m.length === 16 && (m[0]===1 && m[4]===0 && m[ 8]===0 && m[12]===0 &&
                                                 m[1]===0 && m[5]===1 && m[ 9]===0 && m[13]===0 &&
                                                 m[2]===0 && m[6]===0 && m[10]===1 && m[14]===0 &&
                                                 m[3]===0 && m[7]===0 && m[11]===0 && m[15]===1)]);
        }
        
        {
            const m = matrix44_n.rotation_matrix(1.6572, 0.3457, 874665.5247);
            expect_true([()=>m.length === 16 && (trunc4(m[0])===-0.5131 && trunc4(m[4])===-0.7886 && trunc4(m[ 8])===-0.3389 && trunc4(m[12])===0.0000 && 
                                                 trunc4(m[1])===0.1118  && trunc4(m[5])===0.3300  && trunc4(m[ 9])===-0.9373 && trunc4(m[13])===0.0000 && 
                                                 trunc4(m[2])===0.8510  && trunc4(m[6])===-0.5188 && trunc4(m[10])===-0.0812 && trunc4(m[14])===0.0000 && 
                                                 trunc4(m[3])===0.0000  && trunc4(m[7])===0.0000  && trunc4(m[11])===0.0000  && trunc4(m[15])===1.0000)]);
        }

        {
            const m = matrix44_n.translation_matrix(452.8541, 2.5412, 8745.1645);
            expect_true([()=>m.length === 16 && (trunc4(m[0])===1.0000 && trunc4(m[4])===0.0000 && trunc4(m[ 8])===0.0000 && trunc4(m[12])===452.8541  && 
                                                 trunc4(m[1])===0.0000 && trunc4(m[5])===1.0000 && trunc4(m[ 9])===0.0000 && trunc4(m[13])===2.5412    && 
                                                 trunc4(m[2])===0.0000 && trunc4(m[6])===0.0000 && trunc4(m[10])===1.0000 && trunc4(m[14])===8745.1645 && 
                                                 trunc4(m[3])===0.0000 && trunc4(m[7])===0.0000 && trunc4(m[11])===0.0000 && trunc4(m[15])===1.0000)]);
        }

        {
            const m = matrix44_n.perspective_matrix(0.7545, 1.7155, 0.9138, 97852.8647);
            expect_true([()=>m.length === 16 && (trunc4(m[0])===1.4712 && trunc4(m[4])===0.0000 && trunc4(m[ 8])===0.0000 && trunc4(m[12])===0.0000  && 
                                                 trunc4(m[1])===0.0000 && trunc4(m[5])===2.5238 && trunc4(m[ 9])===0.0000 && trunc4(m[13])===0.0000  && 
                                                 trunc4(m[2])===0.0000 && trunc4(m[6])===0.0000 && trunc4(m[10])===1.0000 && trunc4(m[14])===-1.8276 && 
                                                 trunc4(m[3])===0.0000 && trunc4(m[7])===0.0000 && trunc4(m[11])===1.0000 && trunc4(m[15])===0.0000)]);
        }

        {
            const m = matrix44_n.screen_space_matrix(4567.2434, 3.1284);
            expect_true([()=>m.length === 16 && (trunc4(m[0])===2283.6217 && trunc4(m[4])===0.0000  && trunc4(m[ 8])===0.0000 && trunc4(m[12])===2283.1217 && 
                                                 trunc4(m[1])===0.0000    && trunc4(m[5])===-1.5642 && trunc4(m[ 9])===0.0000 && trunc4(m[13])===1.0642    && 
                                                 trunc4(m[2])===0.0000    && trunc4(m[6])===0.0000  && trunc4(m[10])===1.0000 && trunc4(m[14])===0.0000    && 
                                                 trunc4(m[3])===0.0000    && trunc4(m[7])===0.0000  && trunc4(m[11])===0.0000 && trunc4(m[15])===1.0000)]);
        }

        {
            const m = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(452.8541, 2.5412, 8745.1645),
                                                   matrix44_n.perspective_matrix(0.7545, 1.7155, 0.9138, 97852.8647));
            expect_true([()=>m.length === 16 && (trunc4(m[0])===1.4712 && trunc4(m[4])===0.0000 && trunc4(m[ 8])===452.8541  && trunc4(m[12])===0.0000  && 
                                                 trunc4(m[1])===0.0000 && trunc4(m[5])===2.5238 && trunc4(m[ 9])===2.5412    && trunc4(m[13])===0.0000  && 
                                                 trunc4(m[2])===0.0000 && trunc4(m[6])===0.0000 && trunc4(m[10])===8746.1645 && trunc4(m[14])===-1.8276 && 
                                                 trunc4(m[3])===0.0000 && trunc4(m[7])===0.0000 && trunc4(m[11])===1.0000    && trunc4(m[15])===0.0000)]);
        }
    });

    unit("Color", ()=>
    {
        {
            const c = new color_n.rgba_o(1, 2, 3);
            expect_true([()=>(c.a == 255)]); // Alpha channel should default to 255.
        }

        // Color conversion from RGB to hex.
        expect_true([()=>((new color_n.rgba_o(132, 7, 99)).to_hex() === "#840763")]);

        expect_fail([()=>{new color_n.rgba_o(-132, 7, 99);}, // Invalid arguments: blue underflow.
                     ()=>{new color_n.rgba_o(132, 256, 0);}, // Invalid arguments: green overflow.
                     ()=>{new color_n.rgba_o(132, 989965312314, 0);}, // Invalid arguments: gren overflow.
                     ()=>{new color_n.rgba_o(0, 0, 0, 256);}]); // Invalid arguments: alpha overflow.
    });

    unit("Texture", ()=>
    {
        // Creating a texture.
        {
            const w = 1;
            const h = 2;
            const pixels = [new color_n.rgba_o(1, 2, 3), new color_n.rgba_o(4, 5, 6)];
            const texture = new texture_n.texture_o(w, h, pixels);

            // Resolution.
            expect_true([()=>(texture.width === w),
                         ()=>(texture.height === h),
                         ()=>(texture.pixels.length === (w * h)) ]);

            // Pixel data.
            expect_true([()=>(texture.pixels[0].r === pixels[0].r),
                         ()=>(texture.pixels[0].g === pixels[0].g),
                         ()=>(texture.pixels[0].b === pixels[0].b),
                         ()=>(texture.pixels[1].r === pixels[1].r),
                         ()=>(texture.pixels[1].g === pixels[1].g),
                         ()=>(texture.pixels[1].b === pixels[1].b)]);

            // See that pixel data is copied by value, not by reference.
            pixels[0].r = Number(!pixels[0].r);
            expect_true([()=>(texture.pixels[0].r !== pixels[0].r)]);
        }
    });
});

// Output the test results as HTML.
{
    const resultsTableElement = document.createElement("table");

    unitTestResults.forEach((r, idx)=>
    {
        if (idx === 0)
        {
            const header = document.createElement("th");
            header.setAttribute("colspan", "2");
            header.appendChild(document.createTextNode(r));
            header.style.backgroundColor = "lightgray";

            resultsTableElement.appendChild(header);
        }
        else
        {
            const newRow = document.createElement("tr");
            newRow.className = (r.passed? "pass" : "fail");
            
            const unitName = document.createElement("td");
            unitName.appendChild(document.createTextNode(r.unitName));

            const testResult = document.createElement("td");
            testResult.appendChild(document.createTextNode(r.passed? "Passed" : "Failed"));

            newRow.appendChild(unitName);
            newRow.appendChild(testResult)
            resultsTableElement.appendChild(newRow);

            if (!r.passed) console.log(r.unitName, "fail:", r.error)
        }
    });

    document.body.appendChild(resultsTableElement);
    document.body.appendChild(document.createTextNode(Date()));
}
