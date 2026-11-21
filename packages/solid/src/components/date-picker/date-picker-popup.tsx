import { getTabbables, nextTabbableAfter, openOverlaySession } from "@poc/dom";
import { createEffect } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { usePicker } from "./use-picker.ts";

const RETURNS_FOCUS = new Set(["escape-key", "item-press", "trigger-press"]);

/** The non-modal dialog holding the bound calendar (spec/calendar.md, pickers). */
export function DatePickerPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = usePicker("DatePicker.Popup");

    createEffect(
        () => ({
            open: context.open(),
            popup: context.popup(),
            positioner: context.positioner(),
            trigger: context.trigger(),
        }),
        ({ open, popup, positioner, trigger }) => {
            if (!open || popup === null) {
                return undefined;
            }
            const session = openOverlaySession(popup.ownerDocument, {
                elements: () => [positioner ?? popup],
                ignore: () => [trigger],
                dismiss: (reason) => context.setOpen(false, reason),
                focusOut: () => [trigger],
                returnFocus: {
                    when: RETURNS_FOCUS,
                    reason: () => context.lastReason.current,
                    to: () => trigger,
                },
            });
            return session.end;
        },
    );

    const onKeyDown = (event: KeyboardEvent) => {
        const popup = context.popup();
        if (event.key !== "Tab" || popup === null || event.defaultPrevented) {
            return;
        }
        // in the tab order, the popup's content comes right after the trigger (as popover.md)
        const tabbables = getTabbables(popup);
        const active = popup.ownerDocument.activeElement;
        const first = tabbables[0] ?? popup;
        const last = tabbables.at(-1) ?? popup;
        const trigger = context.trigger();
        if (event.shiftKey && (active === first || active === popup)) {
            event.preventDefault();
            context.setOpen(false, "focus-out");
            trigger?.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            const next = trigger
                ? nextTabbableAfter(trigger, [context.positioner(), popup])
                : null;
            context.setOpen(false, "focus-out");
            next?.focus();
        }
    };

    const state = () => ({ open: context.open(), ...context.placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            id: context.popupId,
            role: "dialog",
            "data-date-picker-part": "popup",
            onKeyDown,
            ...stateAttributes({
                ...state(),
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
        }),
        { ref: context.setPopup },
    );
}
