/*
 * Most recent known filename: js/misc/window.js
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

/// Temp hack. Gets updated with onmousemove, and stores the mouse's position relative to the
/// canvas.
const RSED_MOUSE_POS = {x:0, y:0};

// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
    // The default start-up parameters to provide to RallySportED when we launch it. These may
    // be modified by the user via address parameters, which we parse for in the code below.
    const rsedStartupArgs =
    {
        editMode: "local",
        projectLocality: "server",
        projectName: "demod",
    };
    
    // Parse any parameters the user supplied on the address line. Generally speaking, these
    // will direct which track's assets RallySportED should load up when it starts.
    {
        const params = new URLSearchParams(window.location.search);

        if (params.has("shared"))
        {
            // Give the input a sanity check.
            if (!(/^[a-z]+$/.test(params.get("shared"))))
            {
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            rsedStartupArgs.editMode = "shared";
            rsedStartupArgs.projectLocality = "server";
            rsedStartupArgs.projectName = params.get("shared");

            // Sanitize input.
            /// TODO.
        }
        // Server-side custom tracks. These have an id string that identifies the track.
        else if (params.has("track"))
        {
            // Give the input a sanity check.
            if (!(/^[a-k2-9]+$/.test(params.get("track"))))
            {
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            rsedStartupArgs.editMode = "local";
            rsedStartupArgs.projectLocality = "server";
            rsedStartupArgs.projectName = params.get("track");
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
            rsedStartupArgs.projectLocality = "server";
            rsedStartupArgs.projectName = ("demo" + String.fromCharCode("a".charCodeAt(0) + trackId - 1));
        }
    }

    Rsed.core.run(rsedStartupArgs);
}

window.close_dropdowns = function()
{
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
    if (RSED_DROPDOWN_ACTIVATED)
    {
        window.close_dropdowns();
        return false;
    }

    if (event.target.id !== Rsed.core.render_surface_id()) return;

    // Display a right-click menu for changing the type of the prop under the cursor.
    if (!Rsed.shared_mode_n.enabled() &&
        (Rsed.ui_input_n.mouse_hover_type() === Rsed.ui_input_n.mousePickingType.prop) &&
        !Rsed.core.project().props.name(Rsed.ui_input_n.mouse_hover_args().idx).toLowerCase().startsWith("finish")) /// Temp hack. Disallow changing any prop's type to a finish line, which is a special item.
    {
        const propDropdown = document.getElementById("prop-dropdown");
        propDropdown.style.transform = "translate(" + (RSED_MOUSE_POS.x - 40) + "px, " + (RSED_MOUSE_POS.y - 0) + "px)";
        propDropdown.classList.toggle("show");

        RSED_DROPDOWN_ACTIVATED = true;
    }

    return false;
}

// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
    if (RSED_DROPDOWN_ACTIVATED &&
        (event.target.id === Rsed.core.render_surface_id()))
    {
        window.close_dropdowns();
        return false;
    }
}

window.onmousedown = function(event)
{
    switch (event.button)
    {
        case 0: Rsed.ui_input_n.set_left_click(true); break;
        case 1: Rsed.ui_input_n.set_middle_click(true); break;
        case 2: Rsed.ui_input_n.set_right_click(true); break;
        default: break;
    }
}

window.onmouseup = function(event)
{
    switch (event.button)
    {
        case 0: Rsed.ui_input_n.set_left_click(false); break;
        case 1: Rsed.ui_input_n.set_middle_click(false); break;
        case 2: Rsed.ui_input_n.set_right_click(false); break;
        default: break;
    }
}

window.onmousemove = function(event)
{
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
        RSED_MOUSE_POS.x = (event.clientX - event.target.getBoundingClientRect().left);
        RSED_MOUSE_POS.y = (event.clientY - event.target.getBoundingClientRect().top);

        Rsed.ui_input_n.set_mouse_pos(Math.floor(RSED_MOUSE_POS.x * Rsed.core.scaling_multiplier()),
                                      Math.floor(RSED_MOUSE_POS.y * Rsed.core.scaling_multiplier()));
    }
}

window.onkeydown = function(event)
{
    Rsed.ui_input_n.update_key_status(event, true);

    /// Temp hack. Process some of the key presses here, for convenience.
    {
        if (event.repeat) return;

        switch (event.keyCode)
        {
            case "q": case 81: Rsed.ui_view_n.toggle_view("2d-topdown", "3d"); break;
            case "w": case 87: Rsed.ui_view_n.show3dWireframe = !Rsed.ui_view_n.show3dWireframe; break;
            case "a": case 65: Rsed.ui_view_n.showPalatPane = !Rsed.ui_view_n.showPalatPane; break;
            case "r": case 82: Rsed.ui_view_n.toggle_view("3d", "3d-topdown"); break;
            case "l": case 76: Rsed.core.project().maasto.bulldoze(window.prompt("Level the terrain to a height of...")); break;
            case "b": case 66: Rsed.ui_view_n.hideProps = !Rsed.ui_view_n.hideProps; break;
            case "spacebar": case 32: Rsed.ui_brush_n.brushSmoothens = !Rsed.ui_brush_n.brushSmoothens; event.preventDefault(); break;
            case "1": case 49: Rsed.ui_brush_n.set_brush_size(0); break;
            case "2": case 50: Rsed.ui_brush_n.set_brush_size(1); break;
            case "3": case 51: Rsed.ui_brush_n.set_brush_size(2); break;
            case "4": case 52: Rsed.ui_brush_n.set_brush_size(3); break;
            case "5": case 53: Rsed.ui_brush_n.set_brush_size(8); break;
            case "tab": case 9: event.preventDefault(); break;
            default: break;
        }
    }
}

window.onkeyup = function(event)
{
    Rsed.ui_input_n.update_key_status(event, false);
}
