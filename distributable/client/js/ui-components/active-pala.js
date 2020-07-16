/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays the currently-selected PALA texture.
 * Clicking on the component opens/closes the scene's PALAT pane.
 * 
 */

"use strict";

export const component = Rsed.ui.component();

component.update = function(sceneSettings = {})
{
    Rsed.throw_if_not_type("object", sceneSettings);
    Rsed.throw_if_undefined(sceneSettings.showPalatPane);

    if (component.is_grabbed())
    {
        sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
        Rsed.ui.inputState.reset_mouse_grab();
    }
};

component.draw = function(offsetX = 0, offsetY = 0)
{
    Rsed.throw_if_not_type("number", offsetX, offsetY);
    
    const currentPalaIdx = Rsed.ui.groundBrush.brush_pala_idx();
    const billboardIdx = Rsed.core.current_project().palat.billboard_idx(currentPalaIdx);
    const palaTexture = Rsed.core.current_project().palat.texture[currentPalaIdx];
    const billboardTexture = (billboardIdx == null)
                                ? null
                                : Rsed.core.current_project().palat.texture[billboardIdx];

    const mousePick = new Array(palaTexture.indices.length).fill({
        type: "ui-component",
        componentId: component.id,
        string: "Hello",
    });

    if (palaTexture)
    {
        Rsed.ui.draw.image(palaTexture.indices, mousePick, 16, 16, offsetX, offsetY, false, true);

        if (billboardTexture)
        {
            Rsed.ui.draw.image(billboardTexture.indices, null, 16, 16, offsetX, offsetY, true, true);
        }

        Rsed.ui.draw.string((Rsed.ui.groundBrush.brush_size() + 1) + "*", (offsetX - 7), (offsetY - 1))
    }
    else
    {
        Rsed.throw("Invalid brush PALA index.");
    }
};
