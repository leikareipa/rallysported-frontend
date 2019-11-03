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
        // Whether edits to the project happen locally on the client or are broadcast onto the
        // server for other participants to see. Server-side editing is only available for
        // projects that have been created on the server specifically for shared editing.
        editMode: "local", // | "shared"

        project:
        {
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
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            rsedStartupArgs.editMode = "shared";
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
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            rsedStartupArgs.editMode = "local";
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
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            const trackId = parseInt(params.get("original"), 10);
            Rsed.assert && ((trackId >= 1) &&
                            (trackId <= 8))
                        || Rsed.throw("The given track id is out of bounds.");

            rsedStartupArgs.editMode = "local";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = ("demo" + String.fromCharCode("a".charCodeAt(0) + trackId - 1));
        }
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

window.close_dropdowns = function()
{
    if (!Rsed || !Rsed.core) return;

    const dropdowns = document.getElementsByClassName("dropdown_list");
    for (let i = 0; i < dropdowns.length; i++)
    {
        if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.toggle("show");
    }

    RSED_DROPDOWN_ACTIVATED = false;
    Rsed.ui_input_n.reset_mouse_hover_info();
}

// Disable the right-click browser menu, since we want to use the right mouse button for other things.
window.oncontextmenu = function(event)
{
    if (!Rsed || !Rsed.core) return;

    if (RSED_DROPDOWN_ACTIVATED)
    {
        window.close_dropdowns();
        return false;
    }

    if (!Rsed || !Rsed.core || (event.target.id !== Rsed.core.render_surface_id()))
    {
        return;
    }

    // Display a right-click menu for changing the type of the prop under the cursor.
    if (!Rsed.shared_mode_n.enabled() &&
        (Rsed.ui_input_n.mouse_hover_type() === Rsed.ui_input_n.mousePickingType.prop) &&
        !Rsed.core.current_project().props.name(Rsed.ui_input_n.mouse_hover_args().idx).toLowerCase().startsWith("finish")) /// Temp hack. Disallow changing any prop's type to a finish line, which is a special item.
    {
        const mousePos = Rsed.ui.inputState.mouse_pos();
        const propDropdown = document.getElementById("prop-dropdown");

        propDropdown.style.transform = "translate(" + (mousePos.x - 40) + "px, " + (mousePos.y - 0) + "px)";
        propDropdown.classList.toggle("show");

        RSED_DROPDOWN_ACTIVATED = true;
    }

    return false;
}

// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
    if (!Rsed || !Rsed.core) return;

    if (RSED_DROPDOWN_ACTIVATED &&
        (event.target.id === Rsed.core.render_surface_id()))
    {
        window.close_dropdowns();
        return false;
    }
}

window.onmousedown = function(event)
{
    if (!Rsed || !Rsed.core) return;
    
    switch (event.button)
    {
        case 0: Rsed.ui.inputState.set_mouse_button_down({left:true}); Rsed.ui_input_n.set_left_click(true); break;
        case 1: Rsed.ui.inputState.set_mouse_button_down({mid:true});Rsed.ui_input_n.set_middle_click(true); break;
        case 2: Rsed.ui.inputState.set_mouse_button_down({right:true});Rsed.ui_input_n.set_right_click(true); break;
        default: break;
    }
}

window.onmouseup = function(event)
{
    if (!Rsed || !Rsed.core) return;

    switch (event.button)
    {
        case 0: Rsed.ui.inputState.set_mouse_button_down({left:false}); Rsed.ui_input_n.set_left_click(false); break;
        case 1: Rsed.ui.inputState.set_mouse_button_down({mid:false}); Rsed.ui_input_n.set_middle_click(false); break;
        case 2: Rsed.ui.inputState.set_mouse_button_down({right:false}); Rsed.ui_input_n.set_right_click(false); break;
        default: break;
    }
}

window.onmousemove = function(event)
{
    if (!Rsed || !Rsed.core) return;

    if (event.target.id !== Rsed.core.render_surface_id())
    {
        /// Temp hack. Prevent mouse clicks over prop dropdown dialogs from falling through and
        /// inadvertently editing the terrain.
        if (Rsed.ui_input_n.mouse_hover_type() !== Rsed.ui_input_n.mousePickingType.prop)
        {
            Rsed.ui_input_n.reset_mouse_hover_info();
        }

        return;
    }

    if (!RSED_DROPDOWN_ACTIVATED)
    {
        const mouseX = (event.clientX - event.target.getBoundingClientRect().left);
        const mouseY = (event.clientY - event.target.getBoundingClientRect().top);

        Rsed.ui.inputState.set_mouse_pos(mouseX, mouseY);

        Rsed.ui_input_n.set_mouse_pos(Math.floor(mouseX * Rsed.core.scaling_multiplier()),
                                      Math.floor(mouseY * Rsed.core.scaling_multiplier()));
    }

    return;
}

window.onkeydown = function(event)
{
    if (!Rsed || !Rsed.core) return;

    // For keys used by RallySportED to which the browser also coincidentally responds,
    // prevent the browser from doing so.
    switch (event.keyCode)
    {
        case "tab": case 9:
        case "spacebar": case 32: event.preventDefault(); break;
        default: break;
    }

    if (!event.repeat) Rsed.ui.inputState.set_key_down(event.keyCode, true);

    return;
}

window.onkeyup = function(event)
{
    if (!Rsed || !Rsed.core) return;

    Rsed.ui.inputState.set_key_down(event.keyCode, false);
    Rsed.ui_input_n.update_key_status(event, false);

    return;
}

// Gets called when something is dropped onto RallySportED's render canvas. We expect
// the drop to be a zip file containing the files of a RallySportED project for us to
// load up. If it's not, we'll ignore the drop.
window.drop_handler = function(event)
{
    if (!Rsed || !Rsed.core) return;

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
        editMode: "local",
        project:
        {
            dataLocality: "client",
            dataIdentifier: zipFile,
        }
    });

    // Clear the address bar's parameters to reflect the fact that the user has loaded a local
    // track resource instead of specifying a server-side resource via the address bar.
    const basePath = (window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1));
    window.history.replaceState({}, document.title, basePath);
}
