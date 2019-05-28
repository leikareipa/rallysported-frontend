/*
 * Most recent known filename: js/track/props.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

Rsed.props_n = (function()
{
    // The collection of prop meshes we know about, as an array of vertices for each mesh.
    const propMeshes = [];

    // The name of each prop in the prop meshes array.
    const propNames = [];

    // A list of the textures we can use on props.
    const propTextures = [];

    const publicInterface = {};
    {
        publicInterface.clear_prop_textures = function()
        {
            propTextures.length = 0;
        }

        publicInterface.clear_prop_data = function()
        {
            propMeshes.length = 0;
            propNames.length = 0;
            propTextures.length = 0;
        }

        publicInterface.add_prop_texture = function(texture = texture_n.texture_o)
        {
            k_assert((texture instanceof texture_n.texture_o), "Expected a texture object.");

            texture.hasAlpha = true;
            propTextures.push(texture);
        }

        publicInterface.add_prop_mesh = function(name = "", polygons = [Rsed.geometry_n.polygon_o])
        {
            k_assert((polygons[0] instanceof Rsed.geometry_n.polygon_o), "Expected a polygon mesh.");
            k_assert((name.length > 0), "Expected a non-empty prop name string.");
            k_assert((polygons.length > 0), "Expectd a non-empty mesh.");
            
            propMeshes.push(polygons);
            propNames.push(name);
        }

        publicInterface.prop_name_for_idx = function(propIdx)
        {
            k_assert((propIdx >= 0 && propIdx < propNames.length), "Querying a prop name out of bounds.");
            return propNames[propIdx];
        }

        publicInterface.prop_idx_for_name = function(propName = "")
        {
            const propIdx = propNames.indexOf(propName);
            k_assert((propIdx >= 0 && propIdx < propNames.length), "Can't find the given prop name to return an index.");

            return propIdx;
        }

        // Returns a copy of the mesh of the prop of the given name, offset by the given x,y,z.
        publicInterface.prop_mesh = function(name = "", idOnTrack = 0, offsetX = 0, offsetY = 0, offsetZ = 0, wireframeEnabled = false)
        {
            k_assert((name.length > 0), "Expected a non-empty prop mesh name string.");

            const idx = propNames.indexOf(name);
            const sourceMesh = propMeshes[idx];
            k_assert((idx >= 0), "Couldn't find a prop with the given name.");

            const copyMesh = [];
            for (let i = 0; i < sourceMesh.length; i++)
            {
                copyMesh.push(new Rsed.geometry_n.polygon_o(sourceMesh[i].v.length));
                copyMesh[i].clone_from(sourceMesh[i]);

                copyMesh[i].hasWireframe = wireframeEnabled;

                copyMesh[i].isEthereal = ui_view_n.hideProps;

                copyMesh[i].mousePickId = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.prop,
                                                                             {propIdx:idx, propTrackId:idOnTrack});

                for (let v = 0; v < copyMesh[i].v.length; v++)
                {
                    copyMesh[i].v[v].x += offsetX;
                    copyMesh[i].v[v].y += offsetY;
                    copyMesh[i].v[v].z += offsetZ;
                }
            }

            return copyMesh;
        }

        publicInterface.prop_texture = function(idx)
        {
            if (idx == null) return null;

            k_assert((idx >= 0 && idx < propTextures.length), "Tried to access a prop texture out of bounds.");

            return propTextures[idx];
        }

        publicInterface.prop_names = function() { return propNames.slice(0); }
    }
    return publicInterface;
})();
