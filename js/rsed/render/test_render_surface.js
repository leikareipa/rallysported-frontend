const test_render_surface = function()
{
    unit_tester_n.test_unit("Render surface", function()
    {
        // Creation of a render surface.
        {
            const surfaceName = "render_surface";
            const surfaceType = "svg";
            const containerName = "render_surface_test_container";

            // Make sure the element into which we'll create the render surface doesn't exist yet.
            unit_tester_n.require((document.getElementById(containerName) === null), "Temporary test element should not exist yet.");

            // Insert the surface's container element into the HTML.
            const containerElement = document.createElement("div");
            containerElement.setAttribute("id", containerName);
            document.body.appendChild(containerElement)

            // (We pass null as the polygon filler function, since we don't aim to test fill functionality
            // here.)
            const surface = new render_surface_n.render_surface_o(surfaceName, surfaceType, containerName, function(){});
            unit_tester_n.require((surface instanceof render_surface_n.render_surface_o), "Create a render surface.");

            unit_tester_n.reject(function(){ new render_surface_n.render_surface_o(surfaceName, surfaceType, containerName, null); },
                            "Reject creating a render surface with a null polyfill function.");

            unit_tester_n.require((surface.containerId === containerName &&
                                   surface.elementId === surfaceName &&
                                   surface.elementName === surfaceType), "Set surface element ids.");
            unit_tester_n.require((surface.containerElement === containerElement), "Assign the surface container element.");
            unit_tester_n.require((surface.element === document.getElementById(surfaceName)), "Create the render surface element.");

            /// TODO. Test rendering into the surface.
        }
    });
}
