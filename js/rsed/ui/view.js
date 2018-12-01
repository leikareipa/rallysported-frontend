/*
 * Most recent known filename: js/ui/view.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 */

"use strict"

const ui_view_n = (function()
{
    const availableViews = Object.freeze(["3d", "3d-topdown", "2d-topdown"]);

    let currentView = availableViews[0];

    const publicInterface = {};
    {
        // Set to true to display the PALAT pane, i.e. a side window with thumbnails of all the
        // available PALA textures.
        publicInterface.showPalatPane = false;

        // Set to true if the user wants 3d models (and the ground) to be displayed with a wireframe
        // around each polygon.
        publicInterface.show3dWireframe = true;

        // Set to true if the user wants props to not be visible in the 3d view.
        publicInterface.hideProps = false;

        publicInterface.set_view = function(view = "")
        {
            k_assert(availableViews.includes(view), "Can't find the given view to set.");
            currentView = view;
        }

        publicInterface.toggle_view = function(firstView = "", secondView = "")
        {
            k_assert(availableViews.includes(firstView), "Can't find the given view to set.");
            k_assert(availableViews.includes(secondView), "Can't find the given view to set.");

            currentView = ((currentView === firstView)? secondView : firstView);
        }

        publicInterface.current_view = function()
        {
            k_assert(availableViews.includes(currentView), "Holding an invalid view.");
            return currentView.slice(0);
        }
    }
    return publicInterface;
})();
