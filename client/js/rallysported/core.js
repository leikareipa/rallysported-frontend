/*
 * Most recent known filename: js/main.js
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
                    Rsed.core.current_project().props.change_prop_type(Rsed.core.current_project().track_id(),
                                                                       Rsed.ui_input_n.mouse_hover_args().trackId,
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
        element: document.getElementById("render-canvas"),
        
        // An array where each element corresponds to a rendered pixel on the canvas and contains
        // a 32-bit value identifying the source n-gon.
        mousePickingBuffer: [],
    };

    Rsed.assert && (canvas.element != null)
                || Rsed.throw("Failed to find a canvas element to render into.");

    const publicInterface =
    {
        // Starts up RallySportED with the given project to edit.
        run: async function(startupArgs = {})
        {
            Rsed.assert && ((typeof startupArgs.project.dataLocality !== "undefined") &&
                            (typeof startupArgs.editMode !== "undefined"))
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

        current_project: ()=>
        {
            Rsed.assert && (project !== null)
                        || Rsed.throw("Attempting to access an uninitialized project.");

            return project;
        },
        
        is_running: ()=>isRunning,
        render_width: ()=>canvas.width,
        render_height: ()=>canvas.height,
        renderer_fps: ()=>programFPS,
        render_surface_id: ()=>canvas.element.getAttribute("id"),
        fps_counter_enabled: ()=>fpsCounterEnabled,
        scaling_multiplier: ()=>canvas.scalingFactor,
        mouse_pick_buffer_value_at: (x, y)=>canvas.mousePickingBuffer[x + y * canvas.width],
    }

    return publicInterface;

    // Called once per frame to orchestrate program flow.
    function tick(timestamp = 0, frameDeltaMs = 0)
    {
        if (!isRunning) return;

        programFPS = Math.round(1000 / (frameDeltaMs || 1));

        // Poll and process user input.
        Rsed.ui_input_n.enact_inputs();

        // Render the next frame.
        {
            canvas.mousePickingBuffer.fill(null);

            const trackMesh = Rsed.worldBuilder().track_mesh({x: Math.floor(Rsed.camera_n.pos_x()),
                                                              y: 0,
                                                              z: Math.floor(Rsed.camera_n.pos_z())});

            const isTopdownView = (Rsed.ui_view_n.current_view() === "3d-topdown");

            const renderInfo = Rngon.render(canvas.element.getAttribute("id"), [trackMesh],
            {
                cameraPosition: Rngon.translation_vector(0, 0, 0),
                cameraDirection: Rngon.rotation_vector((isTopdownView? 90 : 21), 0, 0),
                scale: canvas.scalingFactor,
                fov: 45,
                nearPlane: 300,
                farPlane: 10000,
                clipToViewport: true,
                depthSort: "none",
                auxiliaryBuffers: [{buffer:canvas.mousePickingBuffer, property:"mousePickId"}],
            });

            // If the rendering was resized since the previous frame...
            if ((renderInfo.renderWidth !== canvas.width ||
                (renderInfo.renderHeight !== canvas.height)))
            {
                canvas.width = renderInfo.renderWidth;
                canvas.height = renderInfo.renderHeight;

                // The PALAT pane needs to adjust to the new size of the canvas.
                Rsed.ui.draw.generate_palat_pane();
            }

            Rsed.ui.draw.draw_ui(canvas.element, canvas.mousePickingBuffer);
        }

        window.requestAnimationFrame((time)=>tick(time, (time - timestamp)));
    }

    // Test various browser compatibility factors, and give the user messages of warning where appropriate.
    function verify_browser_compatibility()
    {
        // We expect to export projects with JSZip using blobs.
        /// TODO: Doesn't need to be checked in shared mode, since it doesn't use JSZip for saving.
        if (!JSZip.support.blob)
        {
            alert("NOTE: This browser doesn't support saving RallySportED projects. Any changes you make to a track in this session will be lost.");
        }
    }

    async function load_project(args = {})
    {
        Rsed.assert && ((typeof args.editMode !== "undefined") &&
                        (typeof args.project.dataIdentifier !== "undefined"))
                    || Rsed.throw("Missing required arguments for loading a project.");
            
        if (args.editMode === "shared")
        {
            await Rsed.shared_mode_n.register_as_participant_in_project(startupArgs.project.dataIdentifier);
        }
        else
        {
            Rsed.shared_mode_n.unregister_current_registration();
        }

        project = await Rsed.project(args.project);

        Rsed.apply_manifesto(project);
        
        Rsed.camera_n.reset_camera_position();

        Rsed.palette.set_palette(project.track_id() === 4? 1 :
                                 project.track_id() === 7? 3 : 0);

        /// TODO. This needs to be implemented in a better way and/or somewhere
        /// else - ideally so you don't have to manually start the poll loop;
        /// so you don't risk starting it twice or whatever.
        if (Rsed.shared_mode_n.enabled())
        {
            Rsed.shared_mode_n.start_polling_server();
        }
    }
})();
