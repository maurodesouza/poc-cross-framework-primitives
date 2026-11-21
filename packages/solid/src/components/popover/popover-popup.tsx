import {
    focusInitial,
    getTabbables,
    nextTabbableAfter,
    openOverlaySession,
} from "@poc/dom";
import { createEffect, useContext } from "solid-js";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.ts";

export interface PopoverPopupState {
    open: boolean;
    side: string;
    align: string;
}

export interface PopoverPopupProps extends PartProps<PopoverPopupState> {
    /** Focused on open (default: the popup). */
    initialFocus?: FocusTarget;
    /** Focused on close by Escape, Close or the trigger (default: the trigger). */
    finalFocus?: FocusTarget;
}

// Closing by these returns focus to the trigger; an outside press or focus leaving does not.
const RETURNS_FOCUS = new Set(["escape-key", "close-press", "trigger-press"]);

/** The non-modal popover (spec/popover.md). */
export function PopoverPopup(props: PopoverPopupProps) {
    const context = useContext(PopoverContext);

    createEffect(
        () => ({
            open: context.open(),
            popup: context.popup(),
            positioner: context.positioner(),
            trigger: context.trigger(),
            initialFocus: props.initialFocus,
        }),
        ({ open, popup, positioner, trigger, initialFocus }) => {
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
                    to: () => {
                        const final = resolveFocusTarget(props.finalFocus);
                        return final === false ? false : (final ?? trigger);
                    },
                },
            });
            const initial = resolveFocusTarget(initialFocus);
            if (initial !== false) {
                focusInitial(popup, initial ?? popup);
            }
            return session.end;
        },
    );

    const onKeyDown = (event: KeyboardEvent) => {
        const popup = context.popup();
        if (event.key !== "Tab" || popup === null || event.defaultPrevented) {
            return;
        }
        // in the tab order, the popup's content comes right after the trigger
        const trigger = context.trigger();
        const tabbables = getTabbables(popup);
        const active = popup.ownerDocument.activeElement;
        const first = tabbables[0] ?? popup;
        const last = tabbables.at(-1) ?? popup;
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
            "aria-labelledby": context.titleId(),
            "aria-describedby": context.descriptionId(),
            tabindex: -1,
            "data-popover-part": "popup",
            ...stateAttributes({
                ...state(),
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
            onKeyDown,
        }),
        { ref: context.setPopup, omit: ["initialFocus", "finalFocus"] },
    );
}
