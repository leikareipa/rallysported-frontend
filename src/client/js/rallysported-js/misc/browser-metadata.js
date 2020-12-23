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
        isMobile: Boolean(/android|mobi/i.test(navigator.userAgent)),
        browserName: (/Chrome/i.test(navigator.userAgent)? "Chrome" :
                      /CriOS/i.test(navigator.userAgent)? "Chrome" :
                      /Opera/i.test(navigator.userAgent)? "Opera" :
                      /Firefox/i.test(navigator.userAgent)? "Firefox" :
                      /Safari/i.test(navigator.userAgent)? "Safari" :
                      null),
    };

    return publicInterface;
})();
