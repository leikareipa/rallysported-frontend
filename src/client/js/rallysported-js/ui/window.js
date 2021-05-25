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

window.onblur = function()
{
    Rsed.ui.inputState.reset_keys();

    return;
}

window.onunload = function()
{
    Rsed.stream.stop();

    return;
};

window.onbeforeunload = function(event)
{
    if (!Rsed.core.current_project().areAllChangesSaved)
    {
        event.preventDefault();

        // Note: We just need to return a string, any string - modern browsers won't display it
        // regardless.
        return "Leave and discard unsaved changes?";
    }
}

// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
    // The app doesn't need to be run if we're just testing its units.
    if (Rsed.unitTestRun) return;

    // We'll modify RallySportED-js's default startup arguments with parameters
    // the user provided via the address bar.
    const rsedStartupArgs = Rsed.core.default_startup_args();
    
    // Parse the user-supplied URL parameters.
    {
        if (window.location.hash == "#play")
        {
            history.replaceState(null, null, " "); // Remove the hash.
            Rsed.core.playOnStartup = true;
        }

        const params = new URLSearchParams(window.location.search);

        // If the user requests to view a stream, we just need to start the stream.
        // Once the user joins the stream as a viewer, they'll receive the track's
        // data and RallySportED-js will be started at that point.
        if (params.has("transientServer"))
        {
            Rsed.stream.start("viewer", params.get("transientServer"));
            
            return;
        }

        // The "track" and "content" parameters specify which track the user wants to load.
        // Generally, the "track" parameter is used to load the game's original demo tracks,
        // while the "content" parameter is used to load tracks (and, in the future, other
        // content, like cars) from the Rally-Sport Content server.
        const contentId = ((params.get("fromContent") || params.get("content")) || // <- 'fromContent' replaces 'content' since post-1.1 RallySportED-js.
                           params.get("track") ||
                           null);

        // If no content identifier was provided, we'll append a default one.
        if (!contentId)
        {
            params.append("track", "demod");
            window.location.search = params.toString();

            return;
        }
        else
        {
            // Give the input a sanity check.
            if ((contentId.length > 20) ||
                !(/^[0-9a-zA-Z-.]+$/.test(contentId)))
            {
                Rsed.throw("Invalid track identifier.");

                return;
            }

            // The RallySportED-js server hosts the original Rally-Sport demo tracks.
            if (["demoa", "demob", "democ", "demod", "demoe", "demof", "demog", "demoh"].includes(contentId))
            {
                rsedStartupArgs.project.dataLocality = "server-rsed";
            }
            // The Rally-Sport Content server hosts custom Rally-Sport content.
            else
            {
                rsedStartupArgs.project.dataLocality = "server-rsc";
            }

            rsedStartupArgs.project.contentId = contentId;
        }
    }

    Rsed.core.start(rsedStartupArgs);

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
        Rsed.ui.inputState.reset_mouse_grab();
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
        window.close_dropdowns(false);
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
    if (event.target.id !== Rsed.visual.canvas.domElementID)
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

    // Display a right-click menu for changing the type of the prop under the cursor.
    if ( Rsed.ui.inputState.current_mouse_hover() &&
        (Rsed.ui.inputState.current_mouse_hover().type === "prop")) 
    {
        const isFinishLine = Rsed.core.current_project().props.name(Rsed.ui.inputState.current_mouse_hover().propId).toLowerCase().startsWith("finish");

        Rsed.ui.htmlUI.refresh_prop_list(isFinishLine);

        const mousePos = Rsed.ui.inputState.mouse_pos();
        const propDropdown = document.getElementById("prop-dropdown");
        const upperMargin = -38;

        propDropdown.style.left = `${mousePos.x + 25}px`;
        propDropdown.style.top = `${mousePos.y + upperMargin}px`;
        propDropdown.style.maxHeight = `${window.innerHeight - mousePos.y - upperMargin}px`;
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
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }


    Rsed.ui.inputState.append_wheel_scroll(Math.sign(event.deltaY) * 60);

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
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }

    if (RSED_DROPDOWN_ACTIVATED)
    {
        window.close_dropdowns(false);
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
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }
    
    switch (event.button)
    {
        case 0: Rsed.ui.inputState.set_mouse_button_down("left", true); break;
        case 1: Rsed.ui.inputState.set_mouse_button_down("middle", true); break;
        case 2: Rsed.ui.inputState.set_mouse_button_down("right", true); break;
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
    if (event.target.id !== Rsed.visual.canvas.domElementID)
    {
        return;
    }

    switch (event.button)
    {
        case 0: Rsed.ui.inputState.set_mouse_button_down("left", false); break;
        case 1: Rsed.ui.inputState.set_mouse_button_down("middle", false); break;
        case 2: Rsed.ui.inputState.set_mouse_button_down("right", false); break;
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

    if (event.target.id !== Rsed.visual.canvas.domElementID)
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

    // Launch RallySportED-js with the dropped-in project's data.
    Rsed.core.start({
        project: {
            dataLocality: "client",
            contentId: zipFile,
        },
    });

    if ((Rsed.stream.role !== "server") && /// TODO: Instead of checking these roles individually, we could have a flag
        (Rsed.stream.role !== "streamer")) /// in Rsed.stream that indicates whether this stream is a receiver or sender.
    {
        // Clear the address bar's parameters to reflect the fact that the user has loaded a local
        // track resource instead of specifying a server-side resource via the address bar.
        const basePath = (window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1));
        window.history.replaceState({}, document.title, basePath);
    }

    return;
}
