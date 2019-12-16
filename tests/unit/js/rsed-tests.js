/*
 * Most recent known filename: rsed-tests.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.unitTestRun = true;

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
            const camPos = Rsed.world.camera.position();

            Rsed.world.camera.move_camera(11, 12, 13, false);
            expect_true([()=>((camPos.x + 11 * Rsed.world.camera.movement_speed()) === Rsed.world.camera.position().x),
                         ()=>((camPos.y + 12 * Rsed.world.camera.movement_speed()) === Rsed.world.camera.position().y),
                         ()=>((camPos.z + 13 * Rsed.world.camera.movement_speed()) === Rsed.world.camera.position().z)]);

            Rsed.world.camera.reset_camera_position();
            expect_true([()=>(Rsed.world.camera.position().x === camPos.x),
                         ()=>(Rsed.world.camera.position().y === camPos.y),
                         ()=>(Rsed.world.camera.position().z === camPos.z)]);
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

        // Pixel color values should be copied by reference, but indices by value.
        pixels[0].r = 777;
        expect_true([()=>(texture.pixels[0].r === 777)]);

        // Immutability.
        {
            expect_fail([()=>{texture.width = 0},
                         ()=>{texture.height = 0},
                         ()=>{texture.flipped = 0}]);
        }
    });
});

// Output the test results as HTML.
{
    let someTestsFail = false;

    unitTestResults.forEach((test, idx)=>
    {
        someTestsFail = (!test.passed || someTestsFail);

        // Add the result of this unit's test to the HTML.
        {
            const nameElement = document.createElement("span");
            nameElement.style.whiteSpace = "nowrap";

            if (test.passed)
            {
                nameElement.className = "pass";
            }
            else
            {
                nameElement.className = "fail";
                nameElement.title = `${test.unitName} fails - ${test.error}`;

                console.warn(`Unit "${test.unitName}" fails - ${test.error}`);
            }

            nameElement.appendChild(document.createTextNode(test.unitName));
            document.getElementById("individual-results").appendChild(nameElement);

            if (idx !== (unitTestResults.length - 1))
            {
                document.getElementById("individual-results").appendChild(document.createTextNode(", "));
            }
        }
    });

    if (someTestsFail)
    {
        document.getElementById("overall-result").classList.add("fail");
        document.getElementById("overall-result").title = "One or more tests fail";
    }
    else
    {
        document.getElementById("overall-result").classList.add("pass");
        document.getElementById("overall-result").title = "All tests pass";
    }

    document.getElementById("individual-results").style.visibility = "visible";

    document.getElementById("finish-date").appendChild(document.createTextNode(Date()));
}
