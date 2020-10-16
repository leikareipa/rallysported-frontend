/*
 * Most recent known filename: js/scene/scene.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 * 
 */

"use strict";

// A scene consists of a UI, a 3d mesh, and an input handler for one view to the current
// project. For instance, you might have a 3d scene, which shows the project's track as a
// textured 3d mesh; and a tilemap scene, which displays the project's tilemap for the
// user to edit.
Rsed.scene = function(args = {})
{
    Rsed.throw_if_not_type("object", args);
    
    args =
    {
        ...{
            draw_mesh: ()=>{},
            draw_ui: ()=>{},
            handle_user_interaction: ()=>{},
            on_key_fire: ()=>{},
            on_key_release: ()=>{},
        },
        ...args
    };

    const publicInterface =
    {
        ...args,
    };

    return publicInterface;
}
