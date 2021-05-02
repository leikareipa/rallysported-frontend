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
            notificationType: "warning", // | "info" | "error" | "fatal"
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
            case "info": return `${meta} fas fa-info`;
            case "warning": return `${meta} fas fa-toilet-paper-slash`;
            case "error": return `${meta} fas fa-spider`;
            case "fatal": return `${meta} fas fa-otter`;
            default: return `${meta} fas far fa-comment`;
        }
    })();

    // Spacing (in pixels) between two adjacent popup elements.
    const popupVerticalSpacing = 1;

    const popupElement = document.createElement("div");
    const iconElement = document.createElement("i");
    const textContainer = document.createElement("div");
    
    iconElement.classList.add(...(`icon-element ${faIcon}`.split(" ")));
    textContainer.classList.add("text-container");
    popupElement.classList.add("popup-notification", "transitioning-in", args.notificationType);

    textContainer.innerHTML = string;

    popupElement.appendChild(iconElement);
    popupElement.appendChild(textContainer);
    popupElement.onclick = close_popup;

    const container = document.getElementById("popup-notifications-container");

    container.appendChild(popupElement);
    update_vertical_positions();
    append_transition_in();

    const removalTimer = (args.timeoutMs <= 0)
                         ? false
                         : setTimeout(close_popup, args.timeoutMs);

    const publicInterface = Object.freeze({
        close: ()=>close_popup(true),
    });

    return publicInterface;

    function close_popup(initiatedByUser = false)
    {
        if (initiatedByUser &&
            popupElement.classList.contains("transitioning-in"))
        {
            return;
        }

        clearTimeout(removalTimer);

        const fadeout = popupElement.animate([
            {transform: "rotateX(90deg)", opacity: "0"}
        ], {duration: 200, easing: "ease-in-out"});

        fadeout.onfinish = ()=>{
            popupElement.remove();
            update_vertical_positions();
        }

        return;
    }

    // Adds a transitioning animation to the popup. Assumes that the popup element
    // has just been added to the DOM and has an opacity of 0.
    function append_transition_in()
    {
        setTimeout(()=>popupElement.classList.remove("transitioning-in"), 0);
        return;
    }

    // Arrange the currently open popups vertically bottom to top from newest to
    // oldest. (The first popup node is expected to be the oldest.)
    function update_vertical_positions()
    {
        const popups = Array.from(container.children).filter(p=>p.classList.contains("popup-notification"));

        if (!popups.length) {
            return;
        }

        let totalHeight = popups.reduce((totalHeight, popup)=>{
            return (totalHeight + popup.offsetHeight + popupVerticalSpacing);
        }, 0);

        for (const popup of popups) {
            popup.style.bottom = `${totalHeight -= (popup.offsetHeight + popupVerticalSpacing)}px`;
        }
    }
}
