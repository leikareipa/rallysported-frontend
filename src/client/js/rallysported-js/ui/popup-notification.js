/*
 * Most recent known filename: js/ui/notification.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Opens a self-closing popup notification on RallySportED's page.
Rsed.ui.popup_notification = function(string = "", args = {})
{
    Rsed.throw_if_not_type("string", string);
    Rsed.throw_if_not_type("object", args);

    args =
    {
        ...
        {
            notificationType: "warning", // | "error"
            timeoutMs: 6000,
        },
        ...args
    }

    Rsed.throw_if_not_type("number", args.timeoutMs);
    Rsed.throw_if_not_type("string", args.notificationType);

    const popupElement = document.createElement("div");
    popupElement.classList.add("popup-notification", "animation-popup-slide-in", args.notificationType);
    popupElement.appendChild(document.createTextNode(string));
    document.getElementById("popup-notification-container").appendChild(popupElement);

    const removalTimer = ((args.timeoutMs <= 0)? false : setTimeout(close_popup, args.timeoutMs));

    const publicInterface =
    {
        close: close_popup,
    };

    return publicInterface;

    function close_popup()
    {
        clearTimeout(removalTimer);
        popupElement.remove();

        return;
    }
}
