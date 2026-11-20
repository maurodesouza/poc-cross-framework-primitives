import {
    focusInitial,
    getTabbables,
    nextTabbableAfter,
    pushLayer,
    watchFocusOutside,
} from "@poc/dom";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
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
export function PopoverPopup({
    initialFocus,
    finalFocus,
    ...props
}: PopoverPopupProps) {
    const context = useRequiredContext(PopoverContext, "Popover.Popup");
    const { open, popup, positioner, trigger, setOpen, lastReason } = context;
    const focusTargets = useRef({ initialFocus, finalFocus });
    focusTargets.current = { initialFocus, finalFocus };

    useEffect(() => {
        if (!open || popup === null) {
            return undefined;
        }
        const doc = popup.ownerDocument;
        const layer = pushLayer(doc, {
            elements: () => [positioner ?? popup],
            ignore: () => [trigger],
            onEscape: () => setOpen(false, "escape-key"),
            onOutsidePress: () => setOpen(false, "outside-press"),
        });
        const initial = resolveFocusTarget(focusTargets.current.initialFocus);
        if (initial !== false) {
            focusInitial(popup, initial ?? popup);
        }
        const stopWatching = watchFocusOutside(
            doc,
            () => [positioner ?? popup, trigger, ...layer.elementsAbove()],
            () => setOpen(false, "focus-out"),
        );
        return () => {
            layer.remove();
            stopWatching();
            if (RETURNS_FOCUS.has(lastReason.current ?? "")) {
                const final = resolveFocusTarget(
                    focusTargets.current.finalFocus,
                );
                if (final !== false) {
                    (final ?? trigger)?.focus({ preventScroll: true });
                }
            }
        };
    }, [open, popup, positioner, trigger, setOpen, lastReason]);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab" || popup === null || event.defaultPrevented) {
            return;
        }
        // in the tab order, the popup's content comes right after the trigger
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
    const state = { open, ...context.placed };
    return renderElement(
        "div",
        props,
        state,
        {
            id: context.popupId,
            role: "dialog",
            "aria-labelledby": context.titleId,
            "aria-describedby": context.descriptionId,
            tabIndex: -1,
            "data-popover-part": "popup",
            ...stateAttributes({
                open,
                side: context.placed.side,
                align: context.placed.align,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
            onKeyDown,
        },
        context.setPopup,
    );
}
