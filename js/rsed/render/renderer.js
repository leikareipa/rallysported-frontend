/*
 * Most recent known filename: js/render/renderer.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * The (3d) renderer for RallySportED.
 *
 */

"use strict";

// Takes as an argument the id string of the container (e.g. <div>) inside which to
// create the render surface (<canvas>). The container must exist; the render surface
// will be created automatically, if need be. Note that the container should contain
// nothing beyond the render surface - its contents may get wiped by the renderer.
Rsed.renderer_o = function(containerElementId = "", scaleFactor = 1)
{
    this.renderSurfaceId = "render_surface_canvas";

    k_assert((document.getElementById(containerElementId) !== null), "Can't find this element.")
    this.renderSurface = new Rsed.render_surface_n.render_surface_o(this.renderSurfaceId,
                                                                    "canvas",
                                                                    containerElementId,
                                                                    Rsed.ngon_fill_n.fill_polygons);

    // The size of the render surface will match the size of its HTML container element, but
    // rasterization into the render surface will down/upscale by this scaling factor. For instance,
    // if the element's size is 400x400 and the scaling factor is 0.5, the image will be rastrized
    // as 200x200, and scaled back to 400x400 when displayed on the page.
    this.scalingFactor = scaleFactor;
    
    // An array of the meshes the renderer will draw to screen.
    this.meshes = [];

    // An array of textures that the renderer has access to.
    this.textures = [];

    this.cameraDirection = new Rsed.geometry_n.vector3_o(0, 0, 0);
    this.cameraPosition = new Rsed.geometry_n.vector3_o(0, 0, 260);

    // The function to call before rendering a frame. This might, for instance,
    // be a function that processes user input.
    this.preRefreshCallbackFn = null;

    // The function to call when the size of the render surface changes.
    this.resizeCallbackFn = null;

    // Will store the number of milliseconds that elapsed between the last
    // two frames.
    this.previousFrameLatencyMs = 0;
    this.previousRenderTimestamp = 0;

    this.set_prerefresh_callback = function(preRefreshFn)
    {
        k_assert((preRefreshFn instanceof Function), "Expected a function for the refresh callback.");
        this.preRefreshCallbackFn = preRefreshFn;
    }

    this.set_resize_callback = function(resizeFn)
    {
        k_assert((resizeFn instanceof Function), "Expected a function. for the resize callback.");
        this.resizeCallbackFn = resizeFn;
    }

    this.render_width = function() { return this.renderSurface.width; }
    this.render_height = function() { return this.renderSurface.height; }

    this.indicate_error = function(message)
    {
        this.renderSurface.update_size(this.scalingFactor);
        this.renderSurface.wipe_clean();

        ui_draw_n.draw_crash_message(this.renderSurface, message);
    }

    // The render loop. This will run continuously once called.
    this.run_renderer = function(timestamp = 0)
    {
        if (!rsed_n.isOperational) return;
        
        this.previousFrameLatencyMs = (timestamp - this.previousRenderTimestamp);
        this.previousRenderTimestamp = timestamp; 

        // Render the next frame.
        {
            this.preRefreshCallbackFn();

            if (this.renderSurface.update_size(this.scalingFactor))
            {
                this.resizeCallbackFn();
            }

            this.renderSurface.wipe_clean();

            // Transform and render any meshes that have been registered with this renderer.
            if (this.meshes.length > 0)
            {
                const viewMatrix = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(this.cameraPosition.x,
                                                                                                this.cameraPosition.y,
                                                                                                this.cameraPosition.z),
                                                                matrix44_n.rotation_matrix(this.cameraDirection.x,
                                                                                            this.cameraDirection.y,
                                                                                            this.cameraDirection.z));

                let polyList = [];
                const surface = this.renderSurface;
                for (let i = 0; i < this.meshes.length; i++)
                {
                    const mesh = this.meshes[i];

                    mesh.tick_function_f();

                    const transformedPolys = polygon_transform_n.transform_polygons(mesh.polygons, mesh.object_space_matrix(),
                                                                                    viewMatrix, surface.width, surface.height);

                    polyList.push(...transformedPolys);
                }

                // Sort polygons by depth, since we don't do depth testing.
                polyList.sort(function(a, b)
                {
                    let d1 = 0;
                    let d2 = 0;
                        
                    for (let i = 0; i < a.v.length; i++) d1 += a.v[i].z;
                    for (let i = 0; i < b.v.length; i++) d2 += b.v[i].z;
                    
                    d1 /= a.v.length;
                    d2 /= b.v.length;
                        
                    return ((d1 === d2)? 0 : ((d1 < d2)? 1 : -1));
                });
                            
                surface.draw_polygons(polyList);
            }

            ui_draw_n.draw_ui(this.renderSurface);
        }

        window.requestAnimationFrame(this.run_renderer.bind(this));
    }

    // Adds a mesh to be rendered. Meshes don't need to be added for each frame - add it
    // once and you're good.
    this.register_mesh = function(mesh = Rsed.geometry_n.polygon_mesh_o)
    {
        k_assert((mesh instanceof Rsed.geometry_n.polygon_mesh_o), "Expected a polygon mesh.");
        this.meshes.push(mesh);
    }

    this.move_camera = function(deltaX = 0, deltaY = 0, deltaZ = 0)
    {
        this.cameraPosition.x += deltaX;
        this.cameraPosition.y += deltaY;
        this.cameraPosition.z += deltaZ;
    }

    this.mouse_pick_buffer_value_at = function(x = 0, y = 0)
    {
        if ((x < 0 || x >= this.renderSurface.width) ||
            (y < 0 || y >= this.renderSurface.height))
        {
            return -1;
        }

        return this.renderSurface.mousePickBuffer[x + y * this.renderSurface.width];
    }
}
