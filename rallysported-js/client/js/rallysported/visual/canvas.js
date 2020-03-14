/*
 * Most recent known filename: js/visual/canvas.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

Rsed.visual = Rsed.visual || {};

// Provides a canvas for RallySportED-js to render into.
Rsed.visual.canvas =
{
    width: 0,
    height: 0,
    scalingFactor: 0.25,
    domElement: document.getElementById("render-canvas"), // May not be available during unit tests.
    domElementID: null, // The canvas DOM element may not be available during unit tests, so let's not initialize this here.

    // One element for each pixel on the canvas. Will be populated during rendering
    // with metainformation about the pixel - e.g. what kind of a polygon populates
    // it. For use in determining what the mouse cursor is hovering over on the
    // canvas.
    mousePickingBuffer: [],
};

// The canvas DOM element is not available during unit testing. Otherwise, we expect
// it to be present.
if (!Rsed.unitTestRun)
{
    Rsed.assert && (Rsed.visual.canvas.domElement != null)
                || Rsed.throw("Failed to find a canvas element to render into.");

    Rsed.visual.canvas.domElementID = Rsed.visual.canvas.domElement.getAttribute("id");

    // A bit of a kludge to prevent certain inputs from sticking if released while a non-
    // RallySportED element has focus.
    Rsed.visual.canvas.domElement.onmouseleave = function(event)
    {
        Rsed.ui.inputState.reset_mouse_buttons_state();
        Rsed.ui.inputState.reset_modifier_keys_state();

        return;
    };

    Rsed.visual.canvas.domElement.ontouchstart = function(event)
    {
        Rsed.ui.inputState.set_is_touching(true, {startX: event.touches[0].clientX, startY: event.touches[0].clientY});

        event.preventDefault();

        return;
    };

    Rsed.visual.canvas.domElement.ontouchend = function(event)
    {
        Rsed.ui.inputState.set_is_touching(false, {});

        event.preventDefault();

        return;
    };

    Rsed.visual.canvas.domElement.ontouchmove = function(event)
    {
        Rsed.ui.inputState.update_touch_position({x: event.touches[0].clientX, y: event.touches[0].clientY})

        event.preventDefault();

        return;
    };
}
