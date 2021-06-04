/*
 * Most recent known filename: js/misc/browser-metadata.js
 *
 * 2020-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Rudimentary (and not necessarily accurate) information about the browser in which
// the app is running.
Rsed.browserMetadata = (function()
{
    // The most recent URL hash parsed with parse_url_hash(); used as a cache
    // to avoid re-parsing the hash when it hasn't changed between calls.
    const latestUrlHash = {
        string: "",
        params: [],
    };

    const publicInterface = {
        isMobile: Boolean(/android|mobi|(crios\/)/i.test(navigator.userAgent)),
        
        browserName: (/Chrome/i.test(navigator.userAgent)? "Chrome" :
                      /CriOS/i.test(navigator.userAgent)? "Chrome" :
                      /Opera/i.test(navigator.userAgent)? "Opera" :
                      /Firefox/i.test(navigator.userAgent)? "Firefox" :
                      /Safari/i.test(navigator.userAgent)? "Safari" :
                      null),

        has_url_param: function(paramName = "")
        {
            const params = new URLSearchParams(window.location.search);
            return params.has(paramName);
        },

        has_hash_param: function(paramName = "")
        {
            const params = parse_url_hash();
            return (params[paramName] !== undefined);
        },

        hash_param: function(paramName = "")
        {
            const params = parse_url_hash();
            const param = params[paramName];

            return {
                isDefined: (param !== undefined),
                value: function()
                {
                    if (!Array.isArray(param))
                    {
                        return false;
                    }

                    return this.value_at(0);
                },
                value_at: function(idx = 0)
                {
                    if (!Array.isArray(param))
                    {
                        return false;
                    }

                    return param[idx];
                },
                has: function(value = "")
                {
                    if (!Array.isArray(param))
                    {
                        return false;
                    }

                    return param.includes(value);
                },
            }
        },

        warn_of_incompatibilities: function()
        {
            // RallySportED-js projects are exported (saved) via JSZip using Blobs.
            if (!JSZip.support.blob)
            {
                Rsed.ui.popup_notification("This browser doesn't support saving projects to disk!",
                {
                    notificationType: "warning",
                });
            }

            // A crude test for whether the user's device might not have the required input
            // devices available.
            if (Rsed.browserMetadata.isMobile)
            {
                Rsed.ui.popup_notification("This app has limited support for mobile devices.",
                {
                    timeoutMs: 7000,
                });
            }

            return;
        }
    };

    return publicInterface;

    function parse_url_hash()
    {
        // We expect a hash to be something like "#gui:-menubar/play:true/scene:texture-editor".
        const hashString = window.location.hash.substring(1);

        // Don't re-parse if the params don't seem to have changed.
        if (latestUrlHash.string == hashString)
        {
            return latestUrlHash.params;
        }

        const keyValuePairs = hashString.split("/").filter(s=>s.length);
        const params = {};

        for (const pair of keyValuePairs)
        {
            let key, values;

            // We support key/value pairs of type "xxxx:yyyy" and "xxxx" (the latter
            // behaves as if it were "xxxx:true"). The first-from-left ":" character
            // marks the boundary between the key and value; subsequent ":" characters
            // are part of the value. "|" characters mark the boundaries between
            // multiple values, e.g. "key:value1|value2|value3".
            [key, ...values] = pair.split(":");
            values = values.join(":").split("|").filter(s=>s.length);

            if (!values.length)
            {
                values = [true];
            }
            else
            {
                // The value is always given as a string by the browser, but for
                // proper boolean logic we want to convert certain strings into
                // their logical representations; so e.g. "false" == true but we
                // instead want ("false" <- false) != true.
                for (let i = 0; i < values.length; i++)
                {
                    if (!values[i].length) values[i] = true;
                    else if (values[i] == "false") values[i] = false;
                    else if (values[i] == "true") values[i] = true;
                    else if (!isNaN(values[i])) values[i] = Number(values[i]);
                }
            }

            params[key] = values;
        }

        latestUrlHash.string = hashString;
        latestUrlHash.params = params;

        return params;
    }
})();
