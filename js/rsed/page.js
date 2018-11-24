/*
 * Most recent known filename: js/page.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Provides logic for dealing with the host HTML page.
 *
 */

"use strict"

// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
    // Parse any parameters the user supplied on the address line. Generally speaking, these
    // will direct which track's assets RallySportED should load up when it starts.
    const args = {};
    {
        const params = new URLSearchParams(window.location.search);

        // Server-side custom tracks. These have an id string that identifies the track.
        if (params.has("track"))
        {
            args.fromZip = true;
            args.locality = "server";
            args.zipFile = params.get("track");

            // Sanitize input.
            if (!(typeof args.zipFile === "string") ||
                !(/^[a-k2-9]+$/.test(args.zipFile)))
            {
                k_assert(0, "Invalid track identifier detected. Can't continue.");
                return;
            }
        }
        // Server side original tracks from Rally-Sport's demo. These take a value in the range 1..8,
        // corresponding to the eight tracks in the demo.
        else if (params.has("original"))
        {
            args.fromOriginal = true;
            args.trackId = parseInt(params.get("original"), 10);

            const trackId = parseInt(params.get("original"), 10);
            k_assert((trackId >= 1 && trackId <= 8), "The given track id is out of bounds.");

            args.fromZip = true;
            args.locality = "server";
            args.zipFile = ("demo" + String.fromCharCode("a".charCodeAt(0) + trackId - 1));

            // Sanitize input.
            if (!(typeof args.zipFile === "string") ||
                !(/^[a-z1-8]+$/.test(args.zipFile)))
            {
                k_assert(0, "Invalid track identifier detected. Can't continue.");
                return;
            }
        }
        else // Default.
        {
            args.fromZip = true;
            args.locality = "server";
            args.zipFile = "demod";
        }
    }

    args.zipFile = (rsed_n.tracks_directory() + args.zipFile + rsed_n.tracks_file_extension());
    
    rsed_n.launch_rallysported(args);
}

// Disable the right-click browser menu, since we want to use the right mouse button for other things.
window.oncontextmenu = function(event)
{
    if (event.target.id !== rsed_n.render_surface_id()) return;

    return false;
    //event.preventDefault();
}

window.onmousedown = function(event)
{
    if (event.target.id !== rsed_n.render_surface_id()) return;

    switch (event.button)
    {
        case 0: ui_input_n.set_left_click(true); break;
        case 1: ui_input_n.set_middle_click(true); break;
        case 2: ui_input_n.set_right_click(true); break;
        default: break;
    }
}

window.onmouseup = function(event)
{
    if (event.target.id !== rsed_n.render_surface_id()) return;

    switch (event.button)
    {
        case 0: ui_input_n.set_left_click(false); break;
        case 1: ui_input_n.set_middle_click(false); break;
        case 2: ui_input_n.set_right_click(false); break;
        default: break;
    }
}

window.onmousemove = function(event)
{
    if (event.target.id !== rsed_n.render_surface_id()) return;

    ui_input_n.set_mouse_pos(Math.floor((event.clientX - event.target.getBoundingClientRect().left) * rsed_n.scaling_multiplier()),
                             Math.floor((event.clientY - event.target.getBoundingClientRect().top) * rsed_n.scaling_multiplier()));
}

window.onkeydown = function(event)
{
    /// FIXME: Depending on browser, could be .keyCode or .which.
    const key = String.fromCharCode(event.keyCode).toLowerCase();

    ui_input_n.set_key_status(key, true);

    if (event.repeat) return;

    switch (event.keyCode)
    {
        case "q": case 81: ui_view_n.showPalatPane = !ui_view_n.showPalatPane; break;
        case "w": case 87: ui_view_n.show3dWireframe = !ui_view_n.show3dWireframe; break;
        case "a": case 65: ui_view_n.toggle_view("2d-topdown", "3d"); break;
        case "r": case 82: ui_view_n.toggle_view("3d", "3d-topdown"); break;
        case "l": case 76: maasto_n.level_terrain(); break;
        case "spacebar": case 32: ui_brush_n.brushSmoothens = !ui_brush_n.brushSmoothens; event.preventDefault(); break;
        case "1": case 49: ui_brush_n.set_brush_size(0); break;
        case "2": case 50: ui_brush_n.set_brush_size(1); break;
        case "3": case 51: ui_brush_n.set_brush_size(2); break;
        case "4": case 52: ui_brush_n.set_brush_size(3); break;
        case "5": case 53: ui_brush_n.set_brush_size(8); break;
        case "tab": case 9: event.preventDefault(); break;
        default: break;
    }
}

window.onkeyup = function(event)
{
    const key = String.fromCharCode(event.keyCode).toLowerCase();

    ui_input_n.set_key_status(key, false);
}

const page_n = (function()
{
    // The id of the html element which displays information about the current RallySportED project.
    const trackInfoDisplayElement = "track_info_display";

    // The id of the html element which displays the current RallySportED project's name.
    const trackTitleElemendId = "track_title";

    const publicInterface = {};
    {
        // Gets called when something is dropped onto whichever container. We expect the drop to be a zip
        // file containing the files of a RallySportED project for us to load up. If it's not, we ignore
        // the drop.
        publicInterface.ondrop = function(event)
        {
            // Don't let the browser handle the drop.
            event.preventDefault();

            // See if we received a zip file that we could load.
            let zipFile = null;
            for (let i = 0; i < event.dataTransfer.items.length; i++)
            {
                const file = event.dataTransfer.items[i].getAsFile();
                if (file == null) continue;
                if (file.name.lastIndexOf(".") <= 0) continue;  // If no suffix or base name, ignore.

                const fileSuffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();

                if (fileSuffix === "zip")
                {
                    zipFile = file;
                    break;
                }
            }

            if (!zipFile)
            {
                k_message("The drag contained no RallySportED zip files. Ignoring it.");
                return;
            }

            // We now presumably have a zipped RallySportED project that we can load, so do that.
            rsed_n.load_project({fromZip:true,locality:"local",zipFile});
            /// TODO: .then(()=>{//cleanup.});

            // Clear the address bar's parameters to reflect the fact that the user has loaded a local
            // track resource instead of specifying a server-side resource via the address bar.
            window.history.replaceState({}, document.title, "/");
        }

        publicInterface.hide_project_info_display = function()
        {
            const titleElement = document.getElementById(trackInfoDisplayElement);
            k_assert((titleElement != null), "Couldn't find the project info element.");

            titleElement.style.visibility = "hidden";
        }

        publicInterface.unhide_project_info_display = function()
        {
            const titleElement = document.getElementById(trackInfoDisplayElement);
            k_assert((titleElement != null), "Couldn't find the project info element.");

            titleElement.style.visibility = "visible";
        }

        // Updates the page's project display with information from the given project.
        publicInterface.update_project_info_display = function(project)
        {
            // Clear out any previous project information.
            const titleElement = document.getElementById(trackTitleElemendId);
            k_assert((titleElement != null), "Couldn't find the track title element.");
            while(titleElement.firstChild)
            {
                titleElement.removeChild(titleElement.firstChild);
            }

            // Fill in the new project information.
            if (project != null)
            {
                titleElement.appendChild(document.createTextNode(project.displayName + "."));
            }
        }
    }
    return publicInterface;
})()
