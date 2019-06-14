/*
 * Most recent known filename: js/rallysported/render/render-surface.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 * Provides an abstracted surface for rendering graphics onto the webpage. The surface
 * might be, for instance, an <svg> element.
 *
 */

"use strict";

Rsed.render_surface_n = (function()
{
    const publicInterface = {};
    {
        // The render surface is a HTML element of some kind - <svg> or <canvas>, for instance - embedded
        // in a container like <div>.
        publicInterface.render_surface_o = function(surfaceElementId = "",
                                                    containerId = "",
                                                    polygonFillFn = Function)
        {
            Rsed.assert && (surfaceElementId.length > 0)
                        || Rsed.throw("Expected a non-null string.");

            Rsed.assert && (containerId.length > 0)
                        || Rsed.throw("Expected a non-null string.");

            Rsed.assert && (polygonFillFn != null)
                        || Rsed.throw("Expected a non-null polyfill function.");

            this.elementId = surfaceElementId;
            this.containerId = containerId;

            this.width = null;
            this.height = null;
            
            this.containerElement = document.getElementById(this.containerId);
            Rsed.assert && (this.containerElement != null)
                        || Rsed.throw("Couldn't find a render surface element with the given id.");

            this.element = document.getElementById(this.elementId);

            // If the element doesn't already exist, create it. NOTE: This will wipe the
            // container's contents.
            if (this.element == null)
            {
                this.containerElement.innerHTML = "";

                this.element = document.createElement("canvas");
                this.element.setAttribute("id", this.elementId);
                this.element.setAttribute("class", "canvas");
                this.containerElement.appendChild(this.element);
            }
            Rsed.assert && (this.element.parentNode === this.containerElement)
                        || Rsed.throw("The render surface element doesn't appear to be embedded in the given container element.");

            Rsed.assert && (this.element != null)
                        || Rsed.throw("Couldn't find a render surface element with the given id.");

            // A function that can be called by the render surface to draw polygons onto
            // itself.
            this.poly_filler = polygonFillFn.bind(this);

            this.depthBuffer = [];

            // For mouse picking. This will match the size of the pixel buffer - as you're rasterizing into
            // the pixel buffer, you'll write into each corresponding pixel in this buffer some ID value of
            // whichever polygon you're rasterizing; so that by reading a value from this array at the
            // mouse coordinates, we know which polygon it's hovering over.
            this.mousePickBuffer = [];

            // Draw the given polygons onto this render surface.
            this.draw_polygons = function(polygons = [])
            {
                this.poly_filler(polygons);
            }

            // Update the size of the render surface to match the size of its container elemen, adjusted
            // by the given scaling factor. Returns true if the size was changed, false is the old size
            // already matched the present one.
            this.update_size = function(scalingFactor = 1)
            {
                const targetWidth = Math.floor(this.containerElement.clientWidth * scalingFactor);
                const targetHeight = Math.floor(this.containerElement.clientHeight * scalingFactor);

                // If the size is already correct, ignore the request to update the size.
                if ((this.width === targetWidth) &&
                    (this.height === targetHeight))
                {
                    return false;
                }

                this.width = targetWidth;
                this.height = targetHeight;
                
                Rsed.assert && (!isNaN(this.width) &&
                                !isNaN(this.height))
                            || Rsed.throw("Failed to extract the canvas size.");

                this.element.setAttribute("width", this.width);
                this.element.setAttribute("height", this.height);

                // Initialize any auxiliary buffers.
                this.mousePickBuffer = new Array(this.width * this.height);
                //this.depthBuffer = new Array(this.width * this.height);

                return true;
            }

            // Exposes the relevant portion of the surface for rendering.
            this.exposed = function()
            {
                return this.element.getContext("2d");
            }

            // Cleans-up the render surface, to a state where it will display nothing but
            // a blank slate onto the screen.
            this.wipe_clean = function()
            {
                const surface = this.exposed();

                surface.fillStyle = "#101010";
                surface.fillRect(0, 0, this.width, this.height);

                // Reset auxiliary buffers.
                this.mousePickBuffer.fill(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.void, {}));
                //this.depthBuffer.fill(Number.MAX_VALUE);
            }
        }
    }
    return publicInterface;
})();
