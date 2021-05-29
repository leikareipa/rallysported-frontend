/*
 * Most recent known filename: js/rallysported.js
 *
 * 2018-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// RallySportED-js's top-level namespace.
//
// Note that this object will be extended by the other source files of
// RallySportED-js, as well.
const Rsed = {
    productName: "RallySportED",
    productVersion: "1.1",
    
    get $currentProject()
    {
        return Rsed.core.current_project();
    },

    get $currentScene()
    {
        return Rsed.core.current_scene();
    },

    set $currentScene(sceneName)
    {
        return Rsed.core.set_scene(sceneName);
    },

    // Generates a v4 UUID and returns it as a string. Adapted with superficial
    // modifications from https://stackoverflow.com/a/2117523, which in turn is
    // based on https://gist.github.com/jed/982883.
    generate_uuid4: function()
    {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    },

    throw: function(fatalErrorMessage = "")
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
    },

    alert: function(message = "")
    {
        console.warn("RallySportED: " + message);
        Rsed.ui.popup_notification(message);
    },

    log: function(message = "")
    {
        console.log("RallySportED: " + message);
    },

    throw_if: function(condition, messageIfTrue)
    {
        if (condition)
        {
            Rsed.throw(messageIfTrue)
        }
    },

    throw_if_undefined: function(...properties)
    {
        for (const property of properties)
        {
            if (typeof property === "undefined")
            {
                Rsed.throw("A required property is undefined.");
            }
        }

        return;
    },

    throw_if_not_type: function(typeName, ...properties)
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
    },

    lerp: function(x = 0, y = 0, interval = 0)
    {
        return (x + (interval * (y - x)));
    },

    clamp: function(value = 0, min = 0, max = 1)
    {
        return Math.min(Math.max(value, min), max);
    },
};

// For inline assertions, e.g.:
//
//   Rsed.assert && (x === 1)
//               || Rsed.throw("X wasn't 1.").
//
// Note that setting this to 'false' won't disable assertions - for that,
// you'll want to search/replace "Rsed.assert &&" with "Rsed.assert ||"
// and keep this set to 'true'.
Object.defineProperty(Rsed, "assert", {value:true, writable:false});
