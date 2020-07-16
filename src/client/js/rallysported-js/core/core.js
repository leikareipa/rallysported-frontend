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

        // Starts up RallySportED with the given project to edit.
        start: async function(args = {})
        {
            Rsed.assert && ((typeof args.project !== "undefined") &&
                            (typeof args.project.dataLocality !== "undefined") &&
                            (typeof args.project.dataIdentifier !== "undefined"))
                        || Rsed.throw("Missing startup parameters for launching RallySportED.");

            coreIsRunning = false;

            // Hide the UI while we load up the project's data etc.
            Rsed.ui.htmlUI.set_visible(false);

            verify_browser_compatibility();

            await load_project(args);

            Rsed.ui.htmlUI.refresh();
            Rsed.ui.htmlUI.set_visible(true);

            coreIsRunning = true;
            tick();
        },

        // Terminate RallySporED with an error message.
        panic: function(errorMessage)
        {
            //renderer.indicate_error(errorMessage);
            //renderer.remove_callbacks();
            Rsed.ui.htmlUI.set_visible(false);
            coreIsRunning = false;
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
            Rsed.ui.popup_notification("This browser does not support saving projects to disk!",
            {
                notificationType: "error",
                timeoutMs: 10000,
            });
        }

        // A crude test for whether the user's device might not have mouse/keyboard available.
        if (browserInfo.isMobile)
        {
            Rsed.ui.popup_notification("Mobile user? Note that this app requires a mouse and keyboard!",
            {
                timeoutMs: 7000,
            });
        }
    }

    async function load_project(args = {})
    {
        Rsed.assert && ((typeof args.project !== "undefined") &&
                        (typeof args.project.dataLocality !== "undefined") &&
                        (typeof args.project.dataIdentifier !== "undefined"))
                    || Rsed.throw("Missing required arguments for loading a project.");
            
        Rsed.world.camera.reset_camera_position();

        project = await Rsed.project(args.project);
    }
})();
