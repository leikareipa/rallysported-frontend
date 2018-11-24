/*
 * Most recent known filename: js/common.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Various functions that may (or might not) be used across the program.
 *
 */

"use strict"

function k_assert(condition = false, explanation = "(no reason given)")
{
    if (!condition)
    {
        rsed_n.incapacitate_rallysported(explanation);
        alert("RallySportED assertion failure. " + explanation);
        throw Error("RallySportED assertion failure: " + explanation);
    }
}

// Send out a user-facing message.
function k_message(message = "")
{
    console.log(message);
}

// Linear interpolation.
function k_lerp(x = 0, y = 0, interval = 0)
{
    return (x + (interval * (y - x)));
}
