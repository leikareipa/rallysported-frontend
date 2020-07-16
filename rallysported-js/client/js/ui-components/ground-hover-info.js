/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays information about the ground under the
 * mouse cursor. This information might be, for instance, the height of
 * the terrain or the name of a prop.
 * 
 */

"use strict";

export const component = Rsed.ui.component();

component.draw = function(offsetX = 0, offsetY = 0)
{
    Rsed.throw_if_not_type("number", offsetX, offsetY);
    
    const mouseHover = Rsed.ui.inputState.current_mouse_hover();
    const mouseGrab = Rsed.ui.inputState.current_mouse_grab();

    let str;

    if ((mouseHover && (mouseHover.type === "prop")) ||
        (mouseGrab && (mouseGrab.type === "prop")))
    {
        // Prefer mouseGrab over mouseHover, as the prop follows the cursor lazily while
        // grabbing, so hover might be over the background.
        const mouse = (mouseGrab || mouseHover);

        str = "PROP:\"" + Rsed.core.current_project().props.name(mouse.propId) + "\"" +
              " IDX:" + mouse.propId + "(" + mouse.propTrackIdx + ")";
    }
    else if (mouseHover && (mouseHover.type === "ground"))
    {
        const x = mouseHover.groundTileX;
        const y = mouseHover.groundTileY;

        const xStr = String(x).padStart(3, "0");
        const yStr = String(y).padStart(3, "0");

        const heightStr = (Rsed.core.current_project().maasto.tile_at(x, y) < 0? "-" : "+") +
                            String(Math.abs(Rsed.core.current_project().maasto.tile_at(x, y))).padStart(3, "0");

        const palaStr = String(Rsed.core.current_project().varimaa.tile_at(x, y)).padStart(3, "0");

        str = "HEIGHT:" + heightStr + " PALA:" + palaStr +" X,Y:"+xStr+","+yStr;
    }
    else
    {
        str = "HEIGHT:+000 PALA:000 X,Y:000,000";
    }

    Rsed.ui.draw.string(str, offsetX, offsetY);
};
