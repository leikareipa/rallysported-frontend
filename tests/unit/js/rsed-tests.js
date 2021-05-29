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
    unit("Placeholder", ()=>
    {
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
