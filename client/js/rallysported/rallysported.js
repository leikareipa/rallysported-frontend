/*
 * Most recent known filename: js/rallysported.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

// Top-level namespace for RallySportED.
const Rsed = {};

// Various small utility functions and the like.
{
    // Defined 'true' to allow for the conveniency of named in-place assertions,
    // e.g. Rsed.assert && (x === 1) || Rsed.throw("X wasn't 1.").
    // Note that setting this to 'false' won't disable assertions - for that,
    // you'll want to search/replace "Rsed.assert &&" with "Rsed.assert ||"
    // and keep this set to 'true'. The comparison against Rsed.assert may still
    // be done, though (I guess depending on the JS engine's ability to optimize).
    Object.defineProperty(Rsed, "assert", {value:true, writable:false});
    
    Rsed.throw = (errMessage = "")=>
    {
        if (Rsed && Rsed.core) Rsed.core.panic(errMessage);

        console.warn("RallySportED error: " + errMessage);
        throw new Error("RallySportED error: " + errMessage);
    }

    Rsed.alert = (message = "")=>
    {
        console.warn("RallySportED: " + message);
    }

    Rsed.log = (message = "")=>
    {
        console.log("RallySportED: " + message);
    }

    Rsed.throw_if_undefined = (...properties)=>
    {
        for (const property of properties)
        {
            if (typeof property === "undefined")
            {
                Rsed.throw("A required property is undefined.");
            }
        }

        return;
    }

    Rsed.throw_if_not_type = (typeName, ...properties)=>
    {
        for (const property of properties)
        {
            const isOfType = (()=>
            {
                switch (typeName)
                {
                    case "array": return Array.isArray(property);
                    default: return (typeof property === typeName);
                }
            })();

            if (!isOfType)
            {
                Rsed.throw(`A property is of the wrong type; expected "${typeName}".`);
            }
        }

        return;
    }

    Rsed.lerp = (x = 0, y = 0, interval = 0)=>(x + (interval * (y - x)));

    Rsed.clamp = (value = 0, min = 0, max = 1)=>Math.min(Math.max(value, min), max);
}
