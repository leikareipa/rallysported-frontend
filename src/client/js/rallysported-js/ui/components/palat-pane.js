/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 * 
 * A UI component that displays a thumbnail of each of the current project's PALA
 * textures. The user can click on the thumbnails to select which texture to paint
 * the ground with.
 * 
 */

"use strict";

export const component = Rsed.ui.component();

// We'll pre-generate the thumbnails into these pixel buffers.
const palatPaneBuffer = [];
const palatPaneMousePick = [];
let knownResX = undefined;
let knownResY = undefined;
let numPalatPaneCols = 9;
let numPalatPaneRows = 29;
let palatPaneWidth = 0;
let palatPaneHeight = 0;
let palatPaneOffsetX = undefined;
let palatPaneOffsetY = undefined;

component.update = function()
{
    const grab = component.is_grabbed();

    if (grab)
    {
        if (Rsed.ui.inputState.left_mouse_button_down() ||
            Rsed.ui.inputState.right_mouse_button_down())
        {
            Rsed.ui.groundBrush.set_brush_pala_idx(grab.palaIdx);
        }
    }
};

component.draw = function(offsetX = 0, offsetY = 0)
{
    if (knownResX !== Rsed.visual.canvas.width ||
        knownResY !== Rsed.visual.canvas.height ||
        offsetX !== palatPaneOffsetX ||
        offsetY !== palatPaneOffsetY)
    {
        knownResX = Rsed.visual.canvas.width;
        knownResY = Rsed.visual.canvas.height;

        generate_palat_pane();
    }

    offsetX -= palatPaneWidth;

    palatPaneOffsetX = offsetX;
    palatPaneOffsetY = offsetY;

    if (palatPaneBuffer.length > 0)
    {
        Rsed.ui.draw.image(palatPaneBuffer, palatPaneMousePick,
                           palatPaneWidth, palatPaneHeight,
                           palatPaneOffsetX, palatPaneOffsetY);

        // Draw a frame around the currently-selected PALA.
        {
            const frame = [];
            const dottedFrame = []
            const frameWidth = 9;
            const frameHeight = 9;
            
            for (let y = 0; y < frameHeight; y++)
            {
                for (let x = 0; x < frameWidth; x++)
                {
                    let color = 0;

                    if (y % (frameHeight - 1) === 0) color = "yellow";
                    if (x % (frameWidth - 1) === 0) color = "yellow";

                    frame.push(color);

                    if (color && ((x + y) % 2 !== 0))
                    {
                        dottedFrame.push("yellow");
                    }
                    else
                    {
                        dottedFrame.push(0);
                    }
                }
            }

            const selectedPalaIdx = Rsed.ui.groundBrush.brush_pala_idx();
            const y = Math.floor(selectedPalaIdx / numPalatPaneCols);
            const x = (selectedPalaIdx - y * numPalatPaneCols);

            Rsed.ui.draw.image(frame, null,
                               frameWidth, frameHeight,
                               palatPaneOffsetX + x * 8, palatPaneOffsetY + y * 8,
                               true);

            const mouseHover = component.is_hovered()

            if (mouseHover)
            {
                Rsed.ui.draw.image(dottedFrame, null,
                                   frameWidth, frameHeight,
                                   mouseHover.cornerX, mouseHover.cornerY,
                                   true);

                // Draw a label on the PALA over which the mouse cursor hovers in the
                // PALAT pane.
                if (Rsed.ui.inputState.key_down("shift"))
                {
                    const label = `#${Rsed.ui.inputState.current_mouse_hover().palaIdx}`;
                    const labelPixelWidth = (label.length * Rsed.ui.font.font_width());
                    const labelPixelHeight = Rsed.ui.font.font_height();

                    const x = (Rsed.ui.inputState.current_mouse_hover().cornerX - labelPixelWidth + 1);
                    const y = (Rsed.ui.inputState.current_mouse_hover().cornerY - labelPixelHeight + 2);

                    Rsed.ui.draw.string(label, x, y);
                }
            }
        }
    }

    return;
};

// Create a set of thumbnails of the contents of the current PALAT file. We'll
// display this pane of thumbnails to the user for selecting PALAs.
function generate_palat_pane()
{
    if ((Rsed.visual.canvas.height <= 0) ||
        (Rsed.visual.canvas.width <= 0))
    {
        return;
    }

    const maxNumPalas = 253;
    const palaWidth = Rsed.constants.palaWidth;
    const palaHeight = Rsed.constants.palaHeight;
    const palaThumbnailWidth = (palaWidth / 2);
    const palaThumbnailHeight = (palaHeight / 2);

    palatPaneBuffer.length = 0;
    palatPaneMousePick.length = 0;
    
    palatPaneHeight = (Math.floor((Rsed.visual.canvas.height - palatPaneOffsetY) / palaThumbnailHeight) - 2) * palaThumbnailHeight
    numPalatPaneRows = Math.ceil(palatPaneHeight / (palaHeight / 2));
    numPalatPaneCols = Math.ceil(maxNumPalas / numPalatPaneRows);
    palatPaneWidth = (numPalatPaneCols * (palaWidth / 2));

    // Make room for the border.
    palatPaneWidth++;
    palatPaneHeight++;

    if ((numPalatPaneCols <= 0) ||
        (numPalatPaneRows <= 0))
    {
        return;
    }

    let palaIdx = 0;
    for (let y = 0; y < numPalatPaneRows; y++)
    {
        for (let x = 0; x < numPalatPaneCols; (x++, palaIdx++))
        {
            if (palaIdx > maxNumPalas) break;

            const pala = Rsed.core.current_project().palat.texture[palaIdx];
            for (let py = 0; py < palaHeight; py++)
            {
                for (let px = 0; px < palaWidth; px++)
                {
                    const palaTexel = Math.floor(px + (palaHeight - py - 1) * palaWidth);
                    const bufferTexel = Math.floor((Math.floor(x * palaWidth + px) / 2) +
                                                    Math.floor((y * palaHeight + py) / 2) * palatPaneWidth);

                    palatPaneBuffer[bufferTexel] = Rsed.visual.palette.color_at_idx(pala.indices[palaTexel]);
                    palatPaneMousePick[bufferTexel] = {
                        type: "ui-component",
                        componentId: component.id,
                        palaIdx: palaIdx,
                        cornerX: ((x * palaThumbnailWidth) + palatPaneOffsetX),
                        cornerY: ((y * palaThumbnailHeight) + palatPaneOffsetY),
                    };
                }
            }
        }
    }

    // Draw a grid over the PALA thumbnails.
    for (let i = 0; i < numPalatPaneRows * palaHeight/2; i++)
    {
        for (let x = 0; x < numPalatPaneCols; x++)
        {
            palatPaneBuffer[(x * palaWidth/2) + i * palatPaneWidth] = "black";
        }
    }
    for (let i = 0; i < numPalatPaneCols * palaWidth/2; i++)
    {
        for (let y = 0; y < numPalatPaneRows; y++)
        {
            palatPaneBuffer[i + (y * palaHeight/2) * palatPaneWidth] = "black";
        }
    }

    return;
};
