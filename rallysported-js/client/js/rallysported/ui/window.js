/*
 * Most recent known filename: js/ui/window.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 * Provides logic for dealing with the host HTML page.
 *
 */

"use strict";

/// Temp hack. Set to true when a dropdown list is visible. We do this to prevent the editor from
/// receiving mouse events in the meantime, so there won't be accidental terrain edits etc. that
/// might otherwise fall through the dropdown menu.
let RSED_DROPDOWN_ACTIVATED = false;

// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
    // The default start-up parameters to provide to RallySportED when we launch it. These may
    // be modified by the user via address parameters, which we parse for in the code below.
    const rsedStartupArgs =
    {
        project:
        {
            // Whether edits to the project happen locally on the client or are broadcast onto
            // the server for other participants to see. Server-side editing is only available
            // for projects that have been created on the server specifically for shared editing.
            editMode: "local", // | "shared"

            // Whether the project's initial data files will be found on the server or on
            // the client. If on the client, an additional property, .dataAsJSON, is expected
            // to provide these data as a JSON string.
            dataLocality: "server", // | "client"

            // A property uniquely identifying this project's data. For server-side projects,
            // this will be a string, and for client-side data a file reference.
            dataIdentifier: "demod",
        }
    };
    
    // Parse any parameters the user supplied on the address line. Generally speaking, these
    // will direct which track's assets RallySportED should load up when it starts.
    {
        const params = new URLSearchParams(window.location.search);

        if (params.has("shared"))
        {
            // Give the input a sanity check.
            if (!(/^[0-9a-z]+$/.test(params.get("shared"))))
            {
                Rsed.throw("Invalid track identifier.");
                return;
            }

            rsedStartupArgs.project.editMode = "shared";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = params.get("shared");

            // Sanitize input.
            /// TODO.
        }
        // Server-side custom tracks. These have an id string that identifies the track.
        else if (params.has("track"))
        {
            // Give the input a sanity check.
            if (!(/^[0-9a-z]+$/.test(params.get("track"))))
            {
                Rsed.throw("Invalid track identifier.");
                return;
            }

            rsedStartupArgs.project.editMode = "local";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = params.get("track");
        }
        // Server side original tracks from Rally-Sport's demo. These take a value in the range 1..8,
        // corresponding to the eight tracks in the demo.
        else if (params.has("original"))
        {
            // Give the input a sanity check.
            if (!(/^[1-8]+$/.test(params.get("original"))))
            {
                Rsed.throw("Invalid track identifier.");
                return;
            }

            const trackId = parseInt(params.get("original"), 10);
            Rsed.assert && ((trackId >= 1) &&
                            (trackId <= 8))
                        || Rsed.throw("The given track id is out of bounds.");

            rsedStartupArgs.project.editMode = "local";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = ("demo" + String.fromCharCode("a".charCodeAt(0) + trackId - 1));
        }
    }

    // The app doesn't need to be run if we're just testing its units.
    if (Rsed.unitTestRun)
    {
        return;
    }

    if (Rsed && Rsed.core)
    {
        Rsed.core.run(rsedStartupArgs);
    }
    else
    {
        Rsed.throw("Failed to launch RallySportED.");
    }

    return;
}

window.close_dropdowns = function(resetInputState = true)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    const dropdowns = document.getElementsByClassName("dropdown-menu");
    for (let i = 0; i < dropdowns.length; i++)
    {
        if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.toggle("show");
    }

    RSED_DROPDOWN_ACTIVATED = false;

    if (resetInputState)
    {
        Rsed.ui.inputState.reset_mouse_hover();
        Rsed.ui.inputState.reset_mouse_buttons_state();
    }

    return;
}

// Right-click menu for track props.
window.oncontextmenu = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // If the right-click menu was already open.
    if (RSED_DROPDOWN_ACTIVATED)
    {
        window.close_dropdowns();
        event.preventDefault();
        return;
    }

    // Ignore right clicks that occur over the dropdown menu.
    if (event.target === document.getElementById("prop-dropdown"))
    {
        event.preventDefault();
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.core.render_surface_id())
    {
        return;
    }

    // Only handle clicks that occur over props.
    if (!Rsed.ui.inputState.current_mouse_hover() ||
        Rsed.ui.inputState.current_mouse_hover().type !== "prop")
    {
        event.preventDefault();
        return;
    }

    event.preventDefault();

    // Props aren't allowed to be edited in any way in shared mode.
    if (Rsed.shared_mode.enabled())
    {
        return;
    }

    /// Temp hack. The finish line is an immutable prop, so disallow changing it.
    if (Rsed.core.current_project().props.name(Rsed.ui.inputState.current_mouse_hover().propId).toLowerCase().startsWith("finish"))
    {
        Rsed.ui.popup_notification("The finish line cannot be edited.");

        // Prevent the same input from registering again next frame, before
        // the user has had time to release the mouse button.
        Rsed.ui.inputState.reset_mouse_buttons_state();

        return;
    }

    // Display a right-click menu for changing the type of the prop under the cursor.
    if ( Rsed.ui.inputState.current_mouse_hover() &&
        (Rsed.ui.inputState.current_mouse_hover().type === "prop")) 
    {
        const mousePos = Rsed.ui.inputState.mouse_pos();
        const propDropdown = document.getElementById("prop-dropdown");

        propDropdown.style.transform = `translate(${mousePos.x}px, ${mousePos.y + 90}px)`;
        propDropdown.classList.toggle("show");

        RSED_DROPDOWN_ACTIVATED = true;
    }

    return;
}

window.onwheel = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // Only handle wheel events that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.core.render_surface_id())
    {
        return;
    }

    Rsed.ui.inputState.set_wheel_scroll(event.deltaY);

    return;
}

// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.core.render_surface_id())
    {
        return;
    }

    if (RSED_DROPDOWN_ACTIVATED)
    {
        window.close_dropdowns();
        return;
    }

    return;
}

window.onmousedown = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.core.render_surface_id())
    {
        return;
    }
    
    switch (event.button)
    {
        case 0: Rsed.ui.inputState.set_mouse_button_down({left:true}); break;
        case 1: Rsed.ui.inputState.set_mouse_button_down({mid:true}); break;
        case 2: Rsed.ui.inputState.set_mouse_button_down({right:true}); break;
        default: break;
    }

    return;
}

window.onmouseup = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // Only handle clicks that occur over RallySportED's canvas.
    if (event.target.id !== Rsed.core.render_surface_id())
    {
        return;
    }

    switch (event.button)
    {
        case 0: Rsed.ui.inputState.set_mouse_button_down({left:false}); break;
        case 1: Rsed.ui.inputState.set_mouse_button_down({mid:false}); break;
        case 2: Rsed.ui.inputState.set_mouse_button_down({right:false}); break;
        default: break;
    }

    return;
}

window.onmousemove = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    if (event.target.id !== Rsed.core.render_surface_id())
    {
        return;
    }

    if (!RSED_DROPDOWN_ACTIVATED)
    {
        const mouseX = (event.clientX - event.target.getBoundingClientRect().left);
        const mouseY = (event.clientY - event.target.getBoundingClientRect().top);

        Rsed.ui.inputState.set_mouse_pos(mouseX, mouseY);
    }

    return;
}

window.onkeydown = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // For keys used by RallySportED to which the browser also coincidentally responds,
    // prevent the browser from doing so.
    switch (event.key)
    {
        case "Tab":
        case " ": event.preventDefault(); break;
        default: break;
    }

    if (!event.repeat) Rsed.ui.inputState.set_key_down(event.key, true);

    return;
}

window.onkeyup = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    Rsed.ui.inputState.set_key_down(event.key, false);

    return;
}

// Gets called when something is dropped onto RallySportED's render canvas. We expect
// the drop to be a zip file containing the files of a RallySportED project for us to
// load up. If it's not, we'll ignore the drop.
window.drop_handler = function(event)
{
    if (!Rsed || !Rsed.core)
    {
        return;
    }

    // Don't let the browser handle the drop.
    event.preventDefault();

    // See if the drop delivers a zip file.
    const zipFile = Array.from(event.dataTransfer.items, (item)=>item.getAsFile())
                         .filter(file=>(file != null))
                         .filter(file=>(file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase() === "zip"))
                         [0] || null;

    if (!zipFile)
    {
        Rsed.log("The drop contained no RallySportED zip files. Ignoring it.");
        return;
    }

    // Launch RallySportED with project data from the given zip file.
    Rsed.core.run(
    {
        project:
        {
            editMode: "local",
            dataLocality: "client",
            dataIdentifier: zipFile,
        }
    });

    // Clear the address bar's parameters to reflect the fact that the user has loaded a local
    // track resource instead of specifying a server-side resource via the address bar.
    const basePath = (window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1));
    window.history.replaceState({}, document.title, basePath);

    return;
}
