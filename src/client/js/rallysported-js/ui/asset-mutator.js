/*
 * Most recent known filename: js/ui/asset-mutator.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 */

"use strict";

// A layer that sits between the user and the game assets (heightmap, tilemap, textures,
// etc.), registering and routing all commands from the user to modify those assets. This
// is to ensure that all user-initiated modifications are inserted into the undo/redo
// stack, transmitted through the network in shared editing mode, etc.
//
// WARNING: If a particular mutation of asset is not available via this layer, the user
// should not be allowed to perform it even if the asset object itself provides a direct
// function for that mutation. For instance, the layer doesn't provide a way to set the
// number of track props even though it could be done via project.props.set_count(); so
// the user should instead be made to act via the layer's "add" and "remove" prop actions,
// or the layer should be expanded to allow specific manipulation of the prop count.
Rsed.ui.assetMutator = (function()
{
    const publicInterface = {
        // Call this function when the user requests (e.g. via the UI) to perform a
        // mutation on an asset - e.g. to paint the tilemap, alter the heightmap, etc.
        //
        // 'assetType' identifies which class of asset is to be edited. Valid values
        // are "maasto" (heightmap), "varimaa" (tilemap), "texture", and "prop".
        //
        // 'editAction' defines the action to be performed on the asset; being an
        // object of the following form:
        //
        //   {
        //       command: A string enumerator identifying the edit action to be performed wrt. the asset
        //       target: A property identifying the specific instance of asset to be acted in regard to
        //       data: A payload associated with the action - e.g. a new height value to modify the heightmap with
        //   }
        //
        // You can find which 'editAction' parameters are valid for a given class of
        // asset by inspecting the applicator functions.
        user_edit: (assetType = "", editAction = {})=>
        {
            if (!Object.keys(applicators).includes(assetType))
            {
                Rsed.throw("Unknown asset type.");
            }

            return applicators[assetType](Rsed.core.current_project(), editAction);
        }
    }

    // For each class of asset, a function that applies a user-requested mutation on
    // the asset.
    const applicators = {
        "maasto": (project, edit)=>
        {
            Rsed.ui.undoStack.mark_dirty_ground_tile(edit.target.x, edit.target.y);
    
            switch (edit.command)
            {
                case "set-height":
                {
                    project.maasto.set_tile_value_at(edit.target.x, edit.target.y, edit.data);
                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        "varimaa": (project, edit)=>
        {
            Rsed.ui.undoStack.mark_dirty_ground_tile(edit.target.x, edit.target.y);
    
            switch (edit.command)
            {
                case "set-tile":
                {
                    project.varimaa.set_tile_value_at(edit.target.x, edit.target.y, edit.data);
                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        "texture": (project, edit)=>
        {
            Rsed.ui.undoStack.mark_dirty_texture(edit.target.texture.args.assetType, edit.target.texture.args.assetId);
    
            switch (edit.command)
            {
                case "set-pixel":
                {
                    // Returns the new modified texture.
                    return edit.target.texture.set_pixel_at(edit.target.u, edit.target.v, edit.data);
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        },

        "prop": (project, edit)=>
        {
            const trackId = project.track_id();
            const propIdx = edit.target;

            Rsed.ui.undoStack.mark_dirty_props();
    
            switch (edit.command)
            {
                case "move":
                {
                    project.props.move(trackId, propIdx, edit.data);
                    break;
                }
                case "remove":
                {
                    project.props.remove(trackId, propIdx);
                    break;
                }
                case "set-type":
                {
                    project.props.change_prop_type(trackId, propIdx, edit.data);
                    break;
                }
                case "add":
                {
                    project.props.add_location(trackId, propIdx, edit.data);
                    break;
                }
                default: Rsed.throw("Unknown edit action."); break;
            }
        }
    }

    return publicInterface;
})();
