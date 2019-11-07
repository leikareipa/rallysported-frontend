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

    // Create and add the notification DOM element.
    const notificationElement = document.createElement("div");
    {
        notificationElement.classList.add("animation-flip");

        notificationElement.appendChild(document.createTextNode(string));
        document.getElementById("popup-container").appendChild(notificationElement);
    }

    const removalTimer = setTimeout(close_notification, args.timeoutMs);

    const publicInterface =
    {
        close: close_notification,
    };

    return publicInterface;

    function close_notification()
    {
        clearTimeout(removalTimer);
        notificationElement.remove();

        return;
    }
}
