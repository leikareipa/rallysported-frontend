/*
 * Most recent known filename: js/ui/html.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

// Provides functionality to manage RallySportED-js's HTML UI.
//
// Note: This will likely be rewritten in the near future.
//
Rsed.ui.htmlUI = (function()
{
    const uiContainer = new Vue(
    {
        el: "#html-ui",
        data:
        {
            // The display name of the track that's currently open in the editor.
            trackName: "",

            propList: [],

            // Whether the UI should be displayed or kept invisible at this time.
            uiVisible: false,
        },
        methods:
        {
            // Called when the user selects a prop from the prop dropdown menu.
            /// TODO: Needs to be somewhere more suitable, and named something more descriptive.
            activate_prop: function(name = "")
            {
                if (!Rsed.ui.inputState.current_mouse_hover() ||
                        Rsed.ui.inputState.current_mouse_hover().type !== "prop")
                {
                    return;
                }

                Rsed.core.current_project().props.change_prop_type(Rsed.core.current_project().track_id(),
                                                                    Rsed.ui.inputState.current_mouse_hover().propTrackIdx,
                                                                    Rsed.core.current_project().props.id_for_name(name));
                window.close_dropdowns();

                return;
            },
            
            refresh: function()
            {
                this.trackName = Rsed.core.current_project().name;
                this.propList = Rsed.core.current_project().props.names()
                                            .filter(propName=>(!propName.startsWith("finish"))) /// Temp hack. Finish lines are not to be user-editable.
                                            .map(propName=>({propName}));

                return;
            }
        }
    });

    const publicInterface = {};
    {
        publicInterface.refresh = function()
        {
            uiContainer.refresh();

            return;
        };

        publicInterface.set_visible = function(isVisible)
        {
            uiContainer.uiVisible = isVisible;

            return;
        };
    }
    return publicInterface;
})();
