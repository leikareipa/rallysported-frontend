/*
 * Most recent known filename: js/misc/browser-metadata.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// Rudimentary (and not necessarily accurate) information about the browser in which
// the app is running.
Rsed.browserMetadata = (function()
{
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

        parse_hash_url: function()
        {
            const hash = window.location.hash.substring(1);
            const pairs = hash.split("/");
            const params = {};

            for (const pair of pairs)
            {
                let key, value;

                if (pair.indexOf(":") >= 0)
                {
                    [key, value] = pair.split(":");
                }
                else
                {
                    [key, value] = [pair, true];
                }

                params[key] = value;
            }

            return params;
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
})();
