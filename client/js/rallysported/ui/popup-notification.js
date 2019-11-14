/*
 * Most recent known filename: js/ui/notification.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Opens a self-closing popup notification on RallySportED's page.
Rsed.popup_notification = function(string = "", args = {})
{
    Rsed.throw_if_not_type("string", string);
    Rsed.throw_if_not_type("object", args);

    args =
    {
        ...
        {
            notificationType: "warning", // | "error"
            timeoutMs: 5000,
        },
        ...args
    }

    Rsed.throw_if_not_type("number", args.timeoutMs);
    Rsed.throw_if_not_type("string", args.notificationType);

    // Create and add the notification DOM element.
    const popupElement = document.createElement("div");
    {
        popupElement.classList.add("animation-flip");

        switch (args.notificationType)
        {
            case "warning": popupElement.style.backgroundColor = "gold"; break;
            case "error": popupElement.style.backgroundColor = "hotpink"; break;
            default: Rsed.throw(`Unknown notification type "${args.notificationType}".`); break;
        }

        popupElement.appendChild(document.createTextNode(string));
        document.getElementById("popup-notification-container").appendChild(popupElement);
    }

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
