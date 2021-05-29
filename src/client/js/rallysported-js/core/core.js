/*
 * Most recent known filename: js/core/core.js
 *
 * 2018-2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.core = (function()
{
    // Set to true while the core is running (e.g. as a result of calling start()).
    let coreIsRunning = false;

    // Set to true when core.panic() is called.
    let coreIsInPanic = false;

    let ticksPerSecond = 0;

    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = Rsed.project.placeholder;

    // The scene we're currently displaying to the user.
    let scene = Rsed.scenes["loading-spinner"];

    // The number of milliseconds elapsed between the most recent tick and the one
    // preceding it. E.g. at 60 FPS this would be about 16.
    let tickDeltaMs = 0;

    const publicInterface =
    {
        forceUpdateMouseHoverOnTickEnd: false,
        
        get ticksPerSecond()
        {
            return ticksPerSecond;
        },

        get tickDeltaMs()
        {
            return tickDeltaMs;
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

        // Starts up RallySportED with the given project to edit.
        start: async function(args = {})
        {
            Rsed.throw_if_not_type("object", args);
            
            args = {
                ...Rsed.core.default_startup_args(),
                ...args,
            };

            coreIsRunning = false;
            Rsed.$currentScene = "loading-spinner";

            // Hide the UI while we load up the project's data etc.
            Rsed.ui.htmlUI.set_visible(false);

            await load_project(args.project);

            Rsed.ui.htmlUI.refresh();
            Rsed.ui.htmlUI.set_visible(true);

            if (Rsed.player.runOnStartup)
            {
                Rsed.player.play(true);
            }

            coreIsRunning = true;
            Rsed.$currentScene = "terrain-editor";
            
            Rsed.browserMetadata.warn_of_incompatibilities();

            return;
        },

        // Something went fatally wrong and the app can't recover from it. All that's
        // left to do is to shut everything down and ask the user to reload.
        panic: function(errorMessage)
        {
            Rsed.ui.htmlUI.display_blue_screen(errorMessage);

            coreIsRunning = false;
            coreIsInPanic = true;

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
            Rsed.assert && (scene !== null)
                        || Rsed.throw("Attempting to access an uninitialized scene.");

            return scene;
        },

        set_scene: function(sceneName)
        {
            Rsed.assert && (Rsed.scenes[sceneName])
                        || Rsed.throw("Attempting to set an unknown scene.");

            scene = Rsed.scenes[sceneName];

            // If we've switched to the tilemap scene, make sure it's reflecting
            // any changes we may have made to the track in the previous scene.
            if (scene == Rsed.scenes["tilemap-editor"])
            {
                scene.regenerate_tilemap();
            }

            return;
        },
    }

    tick();

    return publicInterface;

    // Called once per frame to orchestrate program flow.
    function tick(timestamp = 0, timeDeltaMs = 0)
    {
        const realScreenWidth = document.getElementById("render-canvas-container").clientWidth;
        Rsed.visual.canvas.scalingFactor = Math.min(1, Math.max(0.05, ((1920 / realScreenWidth) * 0.25)));
        
        if (!Rsed.player.is_playing())
        {
            tickDeltaMs = timeDeltaMs;
            ticksPerSecond = Math.round(1000 / (timeDeltaMs || 1));

            scene.handle_user_interaction();
            scene.draw_mesh();
            scene.draw_ui();

            if (publicInterface.forceUpdateMouseHoverOnTickEnd)
            {
                Rsed.ui.inputState.update_mouse_hover();
                publicInterface.forceUpdateMouseHoverOnTickEnd = false;
            }
        }

        // Keep ticking.
        window.requestAnimationFrame((newTimestamp)=>tick(newTimestamp, (newTimestamp - timestamp)));
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
