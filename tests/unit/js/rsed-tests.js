/*
 * Most recent known filename: rsed-tests.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

// The unit tester expects assertion failures to throw and only throw
// (not also pop up window.alert()s or the like).
Rsed.throw = (explanation = "(no reason given)")=>
{
    throw new Error(explanation);
}

const unitTestResults = unit_tests("RallySportED-js", ()=>
{
    unit("Camera", ()=>
    {
        // Movement.
        {
            Rsed.world.camera.reset_camera_position();
            const camPos = {x:Rsed.world.camera.pos_x(), y:Rsed.world.camera.pos_y(), z:Rsed.world.camera.pos_z()};

            Rsed.world.camera.move_camera(11, 12, 13, false);
            expect_true([()=>((camPos.x + 11 * Rsed.world.camera.movement_speed()) === Rsed.world.camera.pos_x()),
                         ()=>((camPos.y + 12 * Rsed.world.camera.movement_speed()) === Rsed.world.camera.pos_y()),
                         ()=>((camPos.z + 13 * Rsed.world.camera.movement_speed()) === Rsed.world.camera.pos_z())]);

            Rsed.world.camera.reset_camera_position();
            expect_true([()=>(Rsed.world.camera.pos_x() === camPos.x),
                         ()=>(Rsed.world.camera.pos_y() === camPos.y),
                         ()=>(Rsed.world.camera.pos_z() === camPos.z)]);
        }
    });

    unit("Texture", ()=>
    {
        const pixels = [{red:255, green:0, blue:123}, {red:0, green:111, blue:222}];
        const indices = [0, 4];
        const texture = Rsed.texture(
        {
            width: 2,
            height: 1,
            pixels,
            indices,
        });

        expect_true([()=>(texture.pixels.length === 2),
                     ()=>(texture.indices.length === 2),
                     ()=>(texture.width === 2),
                     ()=>(texture.height === 1)]);

        // Default values.
        expect_true([()=>(!texture.alpha),
                     ()=>(texture.flipped === "no")]);

        // Invalid/missing values.
        expect_fail([()=>{Rsed.texture(
                          {
                              width: 3, // Should be 2.
                              height: 1,
                              pixels,
                              indices,
                          })},
                     ()=>{Rsed.texture(
                          {
                              width: 2,
                              height: 1,
                              indices,
                              // No pixel array provided.
                          })},
                     ()=>{Rsed.texture(
                          {
                              width: 2,
                              // No width provided.
                              pixels,
                              indices,
                          })}]);

        // Immutability.
        {
            expect_fail([()=>{texture.pixels = 0},
                         ()=>{texture.pixels[0] = 0},
                         ()=>{texture.indices = 0},
                         ()=>{texture.indices[0] = 0},
                         ()=>{texture.width = 0},
                         ()=>{texture.height = 0},
                         ()=>{texture.alpha = 0},
                         ()=>{texture.flipped = 0}]);

            // Pixel color values should be copied by reference, but indices by value.
            pixels[0].r = 777;
            indices[0] = 777;
            expect_true([()=>(texture.pixels[0].r === 777),
                         ()=>(texture.indices[0] !== 777)]);
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
