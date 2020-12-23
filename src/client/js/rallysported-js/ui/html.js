/*
 * Most recent known filename: js/ui/html.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

// Provides functionality to manage RallySportED-js's HTML (Vue) UI.
//
// Note: This will likely be rewritten in the near future. Vue is a bit
// of a bolt-on in this project at the moment.
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

            // For Rsed.stream().
            streamStatus: "disabled",
            streamViewerCount: 0,
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

                Rsed.ui.assetMutator.user_edit("prop", {
                    command: "set-type",
                    target: Rsed.ui.inputState.current_mouse_hover().propTrackIdx,
                    data: Rsed.core.current_project().props.id_for_name(name),
                });

                window.close_dropdowns();

                return;
            },

            refresh_prop_list: function(forFinishLines = false)
            {
                this.propList = Rsed.core.current_project().props.names()
                                         .filter(propName=>(forFinishLines? propName.startsWith("finish") : !propName.startsWith("finish")))
                                         .map(propName=>({propName}));

                return;
            },
            
            refresh_track_name: function()
            {
                this.trackName = Rsed.core.current_project().name;

                return;
            },
        }
    });

    const publicInterface = {
        refresh_prop_list: function(forFinishLines = false)
        {
            uiContainer.refresh_prop_list(forFinishLines)
        },

        refresh: function()
        {
            uiContainer.refresh_track_name();

            if ((typeof Rsed.core.current_project().name == "string") &&
                Rsed.core.current_project().name.length)
            {
                document.title = `${Rsed.ui.assetMutator.isMutatedSinceProjectSaved? "* " : ""}
                                  ${Rsed.core.current_project().name} - 
                                  ${Rsed.core.appName}`;
            }
            else
            {
                document.title = Rsed.core.appName;
            }
        },

        set_visible: function(isVisible)
        {
            uiContainer.uiVisible = isVisible;
        },

        set_stream_status: function(status)
        {
            uiContainer.streamStatus = status;
        },

        set_stream_viewer_count: function(num)
        {
            uiContainer.streamViewerCount = num;
        },

        display_blue_screen: function(errorMessage = "")
        {
            if ((typeof errorMessage !== "string") ||
                !errorMessage.length)
            {
                errorMessage = "Unspecified error";
            }
            
            uiContainer.uiVisible = false;
            
            document.getElementById("blue-screen").style.display = "flex";
            document.querySelector("#blue-screen #error-description").innerHTML = errorMessage;
        },
    };

    return publicInterface;
})();
