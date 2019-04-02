/*
 * Most recent known filename: js/rsed.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict"

const rsed_n = (function()
{
    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = null;

    // Which of Rally-Sport's eight tracks the current project is based on.
    let underlyingTrackId = 1;

    // Strings with which to build URLs to track assets.
    const tracksFileExtension = ".zip";
    const tracksDirectory = "track-list/files/";

    const renderScalingMultiplier = 0.25;

    // Test various browser compatibility factors, and give the user messages of warning where appropriate.
    function check_browser_compatibility()
    {
        // We expect to export projects with JSZip using blobs.
        if (!JSZip.support.blob)
        {
            alert("NOTE: This browser doesn't support saving RallySportED projects. Any changes you make to a track in this session will be lost.");
        }
    }

    // Initialize the renderer.
    const renderer = new rsed_renderer_n.rsed_renderer_o("render_container", renderScalingMultiplier);
    {
        // This function will run before each frame is painted.
        renderer.set_prerefresh_callback(function()
        {
            // Create the scene mesh to be rendered.
            {
                renderer.meshes = [];

                if (ui_view_n.current_view() !== "2d-topdown")
                {
                    renderer.register_mesh(maasto_n.maasto_mesh(Math.floor(camera_n.pos_x()), Math.floor(camera_n.pos_z())));
                }
            }

            ui_input_n.enact_inputs();
        });

        // This function will be called whenever the size of the render surface changes.
        renderer.set_resize_callback(function()
        {
            ui_draw_n.prebake_palat_pane();
        });
    }

    const htmlUI = (function()
    {
        const uiContainer = new Vue(
        {
            el:"#html-ui",
            data:
            {
                // The display name of the track that's currently open in the editor.
                trackName:"",

                // Whether the UI should be displayed or kept invisible at this time.
                uiVisible:false,
            },
            methods:
            {
                refresh:function()
                {
                    this.trackName = project.displayName;
                }
            }
        });

        const publicInterface = {};
        {
            publicInterface.refresh = function()
            {
                uiContainer.refresh();
            };
    
            publicInterface.set_visible = function(isVisible)
            {
                uiContainer.uiVisible = isVisible;
            };
        }
        return publicInterface;
    })();

    const publicInterface = {};
    {
        // Set to false if you want to incapacitate the program, e.g. as a result of an error throwing.
        // If not operational, the program won't respond to user input and won't display anything to
        // the user.
        publicInterface.isOperational = true;

        publicInterface.scaling_multiplier = function() { return renderScalingMultiplier; }
    
        publicInterface.load_project = function(args = {})
        {
            htmlUI.set_visible(false);

            if (args.fromZip)
            {
                k_assert((args.locality != null && args.zipFile != null), "Received invalid arguments for loading a project from a zip file.");

                project = rsed_project_n.make_project_from_zip(args.locality, args.zipFile,
                                                               (newProject)=>
                                                               {
                                                                   project = newProject;
                                                                   rsed_project_n.verify_project_validity(project);
                                                                   htmlUI.refresh();
                                                                   htmlUI.set_visible(true);
                                                               });
            }
            else
            {
                htmlUI.set_visible(true);

                k_assert(0, "Was given no project no load. There should've been one.");
            }
        }

        // Starts the program. The renderer will keep requesting a new animation frame, and will call the
        // callback functions we've set at that rate.
        publicInterface.launch_rallysported = function(args = {})
        {
            check_browser_compatibility();
            renderer.run_renderer();
            this.load_project(args);
        }

        // Exports the project's data into a zip file the user can download.
        publicInterface.save_project_to_disk = function()
        {
            if (project == null)
            {
                k_message("Was asked to save the project while it was null. Ignoring this.");
                return;
            }

            rsed_project_n.generate_download_of_project(project);
        }

        // Loads all relevant base assets for the given track, clearing away any such previously-loaded
        // assets. You might call this, for instance, at the start of parsing a manifesto file, so there's
        // a clean slate to work on. Note that, with the exception of prop textures, this won't load any
        // data that's available in RallySportED project files (like MAASTO, VARIMAA, and PALAT), but
        // will clear away any existing entries of then from memory.
        publicInterface.initialize_track_data = function(trackId)
        {
            k_assert(((trackId >= 1) && (trackId <= 8)), "The given track id is out of bounds.");

            underlyingTrackId = trackId;

            return new Promise((resolve, reject) =>
            {
                const exeAssetDir = "distributable/assets/rallye-exe/";

                // Reset/empty all data buffers.
                props_n.clear_prop_data();
                maasto_n.clear_maasto_data(true);
                palat_n.clear_palat_data();
                camera_n.reset_camera_position();
                palette_n.reset_palettes();
                palette_n.set_palette_for_track(underlyingTrackId);

                resource_loader_n.fetch_binary_resource(exeAssetDir + "prop-textures.dta", "prop-textures")
                .then(()=>resource_loader_n.fetch_json_resource(exeAssetDir + "prop-meshes.json", "prop-meshes"))
                .then(()=>resource_loader_n.fetch_json_resource(exeAssetDir + "prop-locations.json", "prop-locations"))
                .then(()=>resource_loader_n.fetch_binary_resource(exeAssetDir + "track-header.dta", "track-header"))
                .then(()=>{resolve();});
            });
        }

        publicInterface.incapacitate_rallysported = function(message)
        {
            renderer.indicate_error(message);
            publicInterface.isOperational = false;
        }

        publicInterface.render_width = function() { return renderer.render_width(); }
        publicInterface.render_height = function() { return renderer.render_height(); }

        publicInterface.render_latency = function() { return renderer.previousFrameLatencyMs; }

        publicInterface.mouse_pick_buffer_value_at = function(x, y) { return renderer.mouse_pick_buffer_value_at(x, y); }

        publicInterface.underlying_track_id = function() { return underlyingTrackId; }

        publicInterface.tracks_file_extension = function() { return tracksFileExtension; }
        publicInterface.tracks_directory = function() { return tracksDirectory; }

        publicInterface.render_surface_id = function() { return renderer.renderSurfaceId; }
    }
    return publicInterface;
})();
