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
    // For inline assertions, e.g.:
    //
    //   Rsed.assert && (x === 1)
    //               || Rsed.throw("X wasn't 1.").
    //
    // Note that setting this to 'false' won't disable assertions - for that,
    // you'll want to search/replace "Rsed.assert &&" with "Rsed.assert ||"
    // and keep this set to 'true'.
    Object.defineProperty(Rsed, "assert", {value:true, writable:false});

    // Generates a version 4 UUID and returns it as a string. Adapted with
    // superficial modifications from https://stackoverflow.com/a/2117523,
    // which is based on https://gist.github.com/jed/982883.
    Rsed.generate_uuid4_string = ()=>
    {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }
    
    Rsed.throw = (fatalErrorMessage = "")=>
    {
        if (Rsed && Rsed.core)
        {
            Rsed.core.panic(fatalErrorMessage);
        }
        else
        {
            Rsed.ui.popup_notification(`${fatalErrorMessage}`, {
                notificationType: "fatal",
                timeoutMs: 0,
            });
        }

        throw new Error("RallySportED error: " + fatalErrorMessage);
    }

    Rsed.alert = (message = "")=>
    {
        console.warn("RallySportED: " + message);
        Rsed.ui.popup_notification(message);
    }

    Rsed.log = (message = "")=>
    {
        console.log("RallySportED: " + message);
    }

    Rsed.throw_if = (condition, messageIfTrue)=>
    {
        if (condition)
        {
            Rsed.throw(messageIfTrue)
        }
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
