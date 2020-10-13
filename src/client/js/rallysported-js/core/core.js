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
    // Set to true while the core is running (e.g. as a result of calling start()).
    let coreIsRunning = false;

    // Set to true when core.panic() is called.
    let corePanicked = false;

    // The number of frames per second being generated.
    let programFPS = 0;

    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = Rsed.project.placeholder;

    // The scene we're currently displaying to the user.
    let currentScene = Rsed.scenes["3d"];

    // Rudimentary (and not necessarily accurate) information about the browser in which
    // the app is running.
    const browserInfo = (()=>
    {
        return {
            isMobile: Boolean(/android|mobi/i.test(navigator.userAgent)),
            browserName: (/Chrome/i.test(navigator.userAgent)? "Chrome" :
                          /CriOS/i.test(navigator.userAgent)? "Chrome" :
                          /Opera/i.test(navigator.userAgent)? "Opera" :
                          /Firefox/i.test(navigator.userAgent)? "Firefox" :
                          /Safari/i.test(navigator.userAgent)? "Safari" :
                          null),
        };
    })();

    // Whether to display an FPS counter to the user.
    const fpsCounterEnabled = (()=>
    {
        const params = new URLSearchParams(window.location.search);
        return (params.has("showFramerate") && (Number(params.get("showFramerate")) === 1));
    })();

    const publicInterface =
    {
        is_running: ()=>coreIsRunning,
        renderer_fps: ()=>programFPS,
        fps_counter_enabled: ()=>fpsCounterEnabled,
        browser_info: ()=>browserInfo,

        appName: "RallySportED",

        // A convenience function that appends the given object's properties to the
        // default RallySportED-js startup arguments, and returns that amalgamation.
        startup_args: function(customArgs = {})
        {
            const defaultArgs = publicInterface.default_startup_args();

            return {
                ...defaultArgs,
                ...customArgs,
            };
        },

        default_startup_args: function()
        {
            return {
                project:
                {
                    // Whether the project's data files will be loaded from RallySportED-js's server
                    // ("server-rsed"), from Rally-Sport Content's server ("server-rsc"), or provided
                    // by the client (e.g. via file drag onto the browser).
                    dataLocality: "server-rsed", // | "server-rsc" | "client"
        
                    // An identifier for this project's data. For server-side projects, this will be
                    // e.g. a Rally-Sport Content track resource ID, and for client-side data a file
                    // reference.
                    contentId: "demod",
                },
        
                // If the user is viewing a stream, its id will be set here.
                stream: null,
            }
        },

        // Renders a spinner until the core starts up.
        render_loading_animation: function()
        {
            const targetScale = 2000;
            let currentScale = 25;

            (function render_loop(frameCount = 170)
            {
                if (coreIsRunning ||
                    corePanicked)
                {
                    return;
                }

                if (frameCount >= 180)
                {
                    const shade = Math.max(0, (168 - ((frameCount - 180) / 1)));

                    currentScale = Rsed.lerp(currentScale, targetScale, 0.0001);

                    const meshes = new Array(100).fill().map((p, idx)=>
                    {
                        const point = Rngon.ngon([Rngon.vertex((idx / 5000), 0, 0)],
                        {
                            color: Rngon.color_rgba(shade, shade, shade),
                        });

                        const mesh = Rngon.mesh([point],
                        {
                            rotation: Rngon.rotation_vector(70, 0, ((500 + frameCount * idx) / 30)),
                            scaling: Rngon.scaling_vector(currentScale, currentScale, currentScale)
                        });

                        return mesh;
                    });
                    
                    Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), meshes,
                    {
                        cameraPosition: Rngon.translation_vector(0, 0, -14),
                        scale: 0.25,
                    });
                }

                window.requestAnimationFrame(()=>render_loop(frameCount + 1));
            })();
        },

        // Starts up RallySportED with the given project to edit.
        start: async function(args = {})
        {
            Rsed.throw_if_not_type("object", args);
            Rsed.throw_if_undefined(args.project);

            coreIsRunning = false;

            // Hide the UI while we load up the project's data etc.
            Rsed.ui.htmlUI.set_visible(false);

            verify_browser_compatibility();

            await load_project(args.project);

            Rsed.ui.htmlUI.refresh();
            Rsed.ui.htmlUI.set_visible(true);

            coreIsRunning = true;
            tick();
        },

        // Something went fatally wrong and the app can't recover from it. All that's
        // left to do is to shut everything down and ask the user to reload.
        panic: function(errorMessage)
        {
            Rsed.ui.htmlUI.display_blue_screen(errorMessage);

            coreIsRunning = false;
            corePanicked = true;

            publicInterface.start = ()=>{}; // Prevent restarting from code.
        },

        current_project: function()
        {
            Rsed.assert && (project !== null)
                        || Rsed.throw("Attempting to access an uninitialized project.");

            return project;
        },

        current_scene: function()
        {
            Rsed.assert && (currentScene !== null)
                        || Rsed.throw("Attempting to access an uninitialized scene.");

            return currentScene;
        },

        set_scene: function(sceneName)
        {
            Rsed.assert && (Rsed.scenes[sceneName])
                        || Rsed.throw("Attempting to set an unknown scene.");

            currentScene = Rsed.scenes[sceneName];

            // If we've switched to the tilemap scene, make sure it's reflecting
            // any changes we may have made to the track's tilemap in other scenes.
            if (currentScene == Rsed.scenes["tilemap"])
            {
                currentScene.refresh_tilemap_view();
            }

            return;
        },
    }

    publicInterface.render_loading_animation();

    return publicInterface;

    // Called once per frame to orchestrate program flow.
    function tick(timestamp = 0, frameDeltaMs = 0)
    {
        if (!coreIsRunning) return;

        programFPS = Math.round(1000 / (frameDeltaMs || 1));

        currentScene.handle_user_interaction();

        // Render the next frame.
        Rsed.visual.canvas.mousePickingBuffer.fill(null);
        currentScene.draw_mesh();
        currentScene.draw_ui();

        window.requestAnimationFrame((time)=>tick(time, (time - timestamp)));
    }

    // Test various browser compatibility factors, and give the user messages of warning where appropriate.
    function verify_browser_compatibility()
    {
        // RallySportED-js projects are exported (saved) via JSZip using Blobs.
        if (!JSZip.support.blob)
        {
            Rsed.ui.popup_notification("This browser doesn't support saving projects to disk!",
            {
                notificationType: "warning",
            });
        }

        // A crude test for whether the user's device might not have mouse/keyboard available.
        if (browserInfo.isMobile)
        {
            Rsed.ui.popup_notification("For best results, this app requires a mouse, keyboard, and a non-small screen!",
            {
                timeoutMs: 7000,
            });
        }
    }

    async function load_project(projectMeta)
    {
        project = Rsed.project.placeholder;

        /// TODO: Disable undo/redo while the project loads.

        Rsed.world.camera.reset_camera_position();

        project = await Rsed.project(projectMeta);

        Rsed.ui.undoStack.reset();
    }
})();
