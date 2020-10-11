/*
 * Most recent known filename: js/ui/notification.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Opens a self-closing popup notification in RallySportED's DOM.
Rsed.ui.popup_notification = function(string = "", args = {})
{
    Rsed.throw_if_not_type("string", string);
    Rsed.throw_if_not_type("object", args);

    args =
    {
        ...{
            notificationType: "warning", // | "fatal"
            timeoutMs: 6000,
        },
        ...args
    }

    Rsed.throw_if_not_type("number", args.timeoutMs);
    Rsed.throw_if_not_type("string", args.notificationType);

    const faIcon = (()=>
    {
        const meta = "fa-fw";

        switch (args.notificationType)
        {
            case "warning": return `${meta} fas fa-exclamation-circle`;
            case "fatal": return `${meta} fas fa-otter`;
            default: return `${meta} fas far fa-comment`;
        }
    })();

    const popupElement = document.createElement("div");
    popupElement.classList.add("popup-notification", "animation-popup-slide-in", args.notificationType);
    popupElement.innerHTML = `<i class="far fa-fw fa-lg ${faIcon}"></i>
                              ${args.notificationType == "fatal"? "Fatal:" : ""}
                              ${string}`;
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
