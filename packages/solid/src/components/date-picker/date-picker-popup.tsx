import { openOverlaySession } from "@poc/dom";
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

    const state = () => ({ open: context.open(), ...context.placed() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            id: context.popupId,
            role: "dialog",
            "data-date-picker-part": "popup",
            ...stateAttributes({
                ...state(),
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
        }),
        { ref: context.setPopup },
    );
}
