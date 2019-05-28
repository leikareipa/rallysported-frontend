/*
 * Most recent known filename: js/misc/common.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Various functions that may (or might not) be used across the program.
 *
 */

"use strict";

function k_assert(condition = false, explanation = "(no reason given)")
{
    if (!condition)
    {
        Rsed.main_n.incapacitate_rallysported(explanation);
        alert("RallySportED assertion failure. " + explanation);
        throw Error("RallySportED assertion failure: " + explanation);
    }
}

// Send out a user-facing message.
function k_message(message = "")
{
    console.log(message);
}

// Displays a popup notification to the user. Doesn't take user input. Not guaranteed to be modal.
function k_popup(message = "")
{
    /// Temp hack. A modifier's status will stick if the key is releasd while a modal popup is open,
    /// so just clear them all in advance.
    Rsed.ui_input_n.reset_modifier_key_statuses();

    window.alert(message);
}

// Linear interpolation.
function k_lerp(x = 0, y = 0, interval = 0)
{
    return (x + (interval * (y - x)));
}

function k_clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}