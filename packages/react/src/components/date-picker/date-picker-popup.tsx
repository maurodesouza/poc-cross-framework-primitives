import { getTabbables, nextTabbableAfter, openOverlaySession } from "@poc/dom";
import { type KeyboardEvent, useEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.ts";

const RETURNS_FOCUS = new Set(["escape-key", "item-press", "trigger-press"]);

/** The non-modal dialog holding the bound calendar (spec/calendar.md, pickers). */
export function DatePickerPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = useRequiredContext(DatePickerContext, "DatePicker.Popup");
    const { open, popup, positioner, trigger, setOpen, lastReason } = context;

    useEffect(() => {
        if (!open || popup === null) {
            return undefined;
        }
        const session = openOverlaySession(popup.ownerDocument, {
            elements: () => [positioner ?? popup],
            ignore: () => [trigger],
            dismiss: (reason) => setOpen(false, reason),
            focusOut: () => [trigger],
            returnFocus: {
                when: RETURNS_FOCUS,
                reason: () => lastReason.current,
                to: () => trigger,
            },
        });
        return session.end;
    }, [open, popup, positioner, trigger, setOpen, lastReason]);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab" || popup === null || event.defaultPrevented) {
            return;
        }
        // in the tab order, the popup's content comes right after the trigger (as popover.md)
        const tabbables = getTabbables(popup);
        const active = popup.ownerDocument.activeElement;
        const first = tabbables[0] ?? popup;
        const last = tabbables.at(-1) ?? popup;
        if (event.shiftKey && (active === first || active === popup)) {
            event.preventDefault();
            setOpen(false, "focus-out");
            trigger?.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            const next = trigger
                ? nextTabbableAfter(trigger, [positioner, popup])
                : null;
            setOpen(false, "focus-out");
            next?.focus();
        }
    };

    const status = context.presence.status;
    return renderElement(
        "div",
        props,
        { open, ...context.placed },
        {
            id: context.popupId,
            role: "dialog",
            "data-date-picker-part": "popup",
            onKeyDown,
            ...stateAttributes({
                open,
                side: context.placed.side,
                align: context.placed.align,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
        },
        context.setPopup,
    );
}
