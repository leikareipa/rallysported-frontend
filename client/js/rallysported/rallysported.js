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
    // e.g. Rsed.assert && (x === 1) ||Rsed.throw("X wasn't 1.").
    // Note that setting this to 'false' won't disable assertions - for that,
    // you'll want to search/replace "Rsed.assert &&" with "Rsed.assert ||"
    // and keep this set to 'true'. The comparison against Rsed.assert may still
    // be done, though (I guess depending on the JS engine's ability to optimize).
    Object.defineProperty(Rsed, "assert", {value:true, writable:false});
    
    Rsed.throw = (errMessage = "")=>
    {
        Rsed.core.panic(errMessage);

        alert("RallySportED error: " + errMessage);
        throw new Error("RallySportED error: " + errMessage);
    }

    Rsed.alert = (message = "")=>
    {
        alert("RallySportED: " + message);
    }

    Rsed.log = (message = "")=>
    {
        console.log("RallySportED: " + message);
    }

    // Linear interpolation.
    Rsed.lerp = (x = 0, y = 0, interval = 0)=>(x + (interval * (y - x)));

    Rsed.clamp = (value = 0, min = 0, max = 1)=>Math.min(Math.max(value, min), max);
}
