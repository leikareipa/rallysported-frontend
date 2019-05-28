/*
 * Most recent known filename: js/render_surface.js
 *
 * Tarpeeksi Hyvae Soft 2018
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
                                                    surfaceElementName = "",
                                                    containerId = "",
                                                    polyFillFn = Function)
        {
            Rsed.assert && (surfaceElementId.length > 0)
                        || Rsed.throw("Expected a non-null string.");

            Rsed.assert && (surfaceElementName.length > 0)
                        || Rsed.throw("Expected a non-null string.");

            Rsed.assert && (containerId.length > 0)
                        || Rsed.throw("Expected a non-null string.");

            Rsed.assert && (polyFillFn != null)
                        || Rsed.throw("Expected a non-null polyfill function.");

            this.elementId = surfaceElementId;
            this.elementName = surfaceElementName;

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

                switch(this.elementName)
                {
                    case "canvas":
                    {
                        this.element = document.createElement("canvas");
                        break;
                    }
                    case "svg":
                    {
                        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        this.element.style.backgroundColor = "transparent";
                        this.element.style.pointerEvents = "none"; // Prevent polygons in the SVG from intercepting the mouse.
                        
                        break;
                    }
                    default:
                    {
                        Rsed.throw("Unknown render surface element id.");
                        break;
                    }
                }

                this.element.setAttribute("id", this.elementId);
                this.element.setAttribute("class", "canvas");
                this.containerElement.appendChild(this.element);
            }
            Rsed.assert && (this.element.parentNode === this.containerElement)
                        || Rsed.throw("The render surface element doesn't appear to be embedded in the given container element.");

            Rsed.assert && (this.element != null)
                        || Rsed.throw("Couldn't find a render surface element with the given id.");

            Rsed.assert && (this.element.tagName.toLowerCase() === this.elementName)
                        || Rsed.throw("The element by the given id is not compatible with the given element name.");

            // A function that can be called by the render surface to draw polygons onto
            // itself.
            this.poly_filler = polyFillFn.bind(this);

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
                if (this.elementName === "canvas")
                {
                    this.mousePickBuffer = new Array(this.width * this.height);
                    //this.depthBuffer = new Array(this.width * this.height);
                }

                return true;
            }

            // Exposes the relevant portion of the surface for rendering.
            this.exposed = function()
            {
                switch (this.elementName)
                {
                    case "canvas":
                    {
                        return this.element.getContext("2d");
                    }
                    case "svg":
                    {
                        this.element.setAttribute("width", this.width);
                        this.element.setAttribute("height", this.height);

                        return this.element;
                    }
                    default:
                    {
                        Rsed.throw("Unknown render surface element id.");
                    }
                }
            }

            // Cleans-up the render surface, to a state where it will display nothing but
            // a blank slate onto the screen.
            this.wipe_clean = function()
            {
                const surface = this.exposed();

                switch (this.elementName)
                {
                    case "svg":
                    {
                        while (this.element.firstChild !== null)
                        {
                            this.element.removeChild(this.element.firstChild);
                        }

                        break;
                    }
                    case "canvas":
                    {
                        surface.fillStyle = "#101010";
                        surface.fillRect(0, 0, this.width, this.height);

                        // Reset auxiliary buffers.
                        this.mousePickBuffer.fill(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.void, {}));
                        //this.depthBuffer.fill(Number.MAX_VALUE);

                        break;
                    }
                    default:
                    {
                        Rsed.throw("Unknown render surface element id.");
                    }
                }
            }
        }
    }
    return publicInterface;
})();
