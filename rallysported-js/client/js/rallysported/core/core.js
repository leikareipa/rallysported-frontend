/*
 * Most recent known filename: js/core/core.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.core = (function()
{
    // Set to true while the core is running (e.g. as a result of calling run()).
    let isRunning = false;

    // The number of frames per second being generated.
    let programFPS = 0;

    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = Rsed.project.placeholder;

    // The scene we're currently viewing.
    let scene = Rsed.scenes["3d"];

    // Whether to display an FPS counter to the user.
    const fpsCounterEnabled = (()=>
    {
        const params = new URLSearchParams(window.location.search);
        return (params.has("showFramerate") && (Number(params.get("showFramerate")) === 1));
    })();

    const htmlUI = (function()
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

    // The canvas we'll render into.
    const canvas =
    {
        width: 0,
        height: 0,
        scalingFactor: 0.25,
        domElement: document.getElementById("render-canvas"),
        
        // An array where each element corresponds to a rendered pixel on the canvas and contains
        // a 32-bit value identifying the source n-gon.
        mousePickingBuffer: [],
    };

    Rsed.assert && (canvas.domElement != null)
                || Rsed.throw("Failed to find a canvas element to render into.");

    canvas.domElement.onmouseleave = function(event)
    {
        // A bit of a kludge to prevent certain inputs from sticking if released while a non-
        // RallySportED element has focus.
        Rsed.ui.inputState.reset_mouse_buttons_state();
        Rsed.ui.inputState.reset_modifier_keys_state();

        return;
    }

    const publicInterface =
    {
        // Starts up RallySportED with the given project to edit.
        run: async function(startupArgs = {})
        {
            Rsed.assert && ((typeof startupArgs.project.dataLocality !== "undefined") &&
                            (typeof startupArgs.project.editMode !== "undefined"))
                        || Rsed.throw("Missing startup parameters for launching RallySportED.");

            isRunning = false;

            // Hide the UI while we load up the project's data etc.
            htmlUI.set_visible(false);

            verify_browser_compatibility();

            await load_project(startupArgs);

            Rsed.ui.draw.generate_palat_pane();

            htmlUI.refresh();
            htmlUI.set_visible(true);

            isRunning = true;
            tick();
        },

        // Terminate RallySporED with an error message.
        panic: function(errorMessage)
        {
            //renderer.indicate_error(errorMessage);
            //renderer.remove_callbacks();
            htmlUI.set_visible(false);
            isRunning = false;
            this.run = ()=>{};
        },

        current_project: function()
        {
            Rsed.assert && (project !== null)
                        || Rsed.throw("Attempting to access an uninitialized project.");

            return project;
        },

        current_scene: function()
        {
            Rsed.assert && (scene !== null)
                        || Rsed.throw("Attempting to access an uninitialized scene.");

            return scene;
        },

        set_scene: function(sceneName)
        {
            Rsed.assert && (Rsed.scenes[sceneName])
                        || Rsed.throw("Attempting to set an unknown scene.");

            scene = Rsed.scenes[sceneName];

            return;
        },
        
        is_running: ()=>isRunning,
        render_width: ()=>canvas.width,
        render_height: ()=>canvas.height,
        renderer_fps: ()=>programFPS,
        render_surface_id: ()=>canvas.domElement.getAttribute("id"),
        fps_counter_enabled: ()=>fpsCounterEnabled,
        scaling_multiplier: ()=>canvas.scalingFactor,
        mouse_pick_buffer_at: (x, y)=>canvas.mousePickingBuffer[x + y * canvas.width],
    }

    return publicInterface;

    // Called once per frame to orchestrate program flow.
    function tick(timestamp = 0, frameDeltaMs = 0)
    {
        if (!isRunning) return;

        programFPS = Math.round(1000 / (frameDeltaMs || 1));

        scene.handle_user_interaction();

        // Render the next frame.
        canvas.mousePickingBuffer.fill(null);
        scene.draw_mesh(canvas);
        scene.draw_ui(canvas);

        window.requestAnimationFrame((time)=>tick(time, (time - timestamp)));
    }

    // Test various browser compatibility factors, and give the user messages of warning where appropriate.
    function verify_browser_compatibility()
    {
        // RallySportED-js projects are exported (saved) via JSZip using Blobs.
        if (!JSZip.support.blob)
        {
            Rsed.ui.popup_notification("This browser does not support the \"Save to disk\" feature!",
            {
                notificationType: "error",
                timeoutMs: 10000,
            });
        }

        // A crude test for whether the user's device might not have mouse/keyboard available.
        if (/android|mobi/i.test(navigator.userAgent))
        {
            Rsed.ui.popup_notification("Mobile user? Note that this app requires a mouse and keyboard!",
            {
                timeoutMs: 7000,
            });
        }
    }

    async function load_project(args = {})
    {
        Rsed.assert && ((typeof args.project.editMode !== "undefined") &&
                        (typeof args.project.dataIdentifier !== "undefined"))
                    || Rsed.throw("Missing required arguments for loading a project.");
            
        if (args.project.editMode === "shared")
        {
            await Rsed.shared_mode.register_as_participant_in_project(args.project.dataIdentifier);
        }
        else
        {
            Rsed.shared_mode.unregister_current_registration();
        }

        Rsed.world.camera.reset_camera_position();

        project = await Rsed.project(args.project);

        Rsed.apply_manifesto(project);

        /// TODO. This needs to be implemented in a better way and/or somewhere
        /// else - ideally so you don't have to manually start the poll loop;
        /// so you don't risk starting it twice or whatever.
        if (Rsed.shared_mode.enabled())
        {
            Rsed.shared_mode.start_polling_server();
        }
    }
})();
