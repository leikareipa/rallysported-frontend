/*
 * Most recent known filename: js/rallysported.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

// Top-level namespace for RallySportED.
const Rsed = {};

// Various small utility functions and the like.
{
    Rsed.assert = (condition = false, explanation = "(no reason given)")=>
    {
        if (!condition)
        {
            Rsed.main_n.incapacitate_rallysported(explanation);

            alert("RallySportED assertion failure. " + explanation);
            throw Error("RallySportED assertion failure: " + explanation);
        }
    }
}
