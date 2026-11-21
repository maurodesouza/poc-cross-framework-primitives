import {
    focusInitial,
    inertOutside,
    lockScroll,
    openOverlaySession,
    trapFocus,
} from "@poc/dom";
import { createEffect, useContext } from "solid-js";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogPopupState {
    open: boolean;
}

export interface DialogPopupProps extends PartProps<DialogPopupState> {
    /** Focused on open (default: the first tabbable element, else the popup). */
    initialFocus?: FocusTarget;
    /** Focused on close (default: the trigger, else the element focused before opening). */
    finalFocus?: FocusTarget;
}

/** The modal dialog (spec/dialog.md): focus trap, inert page, scroll lock, its own layer. */
export function DialogPopup(props: DialogPopupProps) {
    const context = useContext(DialogContext);

    createEffect(
        () => ({
            open: context.open(),
            popup: context.popup(),
            backdrop: context.backdrop(),
            trigger: context.trigger(),
            initialFocus: props.initialFocus,
        }),
        ({ open, popup, backdrop, trigger, initialFocus }) => {
            if (!open || popup === null) {
                return undefined;
            }
            const doc = popup.ownerDocument;
            const previous =
                doc.activeElement instanceof HTMLElement
                    ? doc.activeElement
                    : null;
            const session = openOverlaySession(doc, {
                elements: () => [popup],
                dismiss: (reason) => context.setOpen(false, reason),
                returnFocus: {
                    reason: () => null,
                    to: () => {
                        const final = resolveFocusTarget(props.finalFocus);
                        return final === false
                            ? false
                            : (final ?? trigger ?? previous);
                    },
                },
            });
            const initial = resolveFocusTarget(initialFocus);
            focusInitial(popup, initial === false ? popup : initial);
            const release = trapFocus(popup, session.elementsAbove);
            const unlock = lockScroll(doc);
            const restoreInert = inertOutside(
                backdrop ? [popup, backdrop] : [popup],
            );
            return () => {
                release();
                unlock();
                restoreInert();
                session.end();
            };
        },
    );

    const state = () => ({ open: context.open() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            id: context.popupId,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": context.titleId(),
            "aria-describedby": context.descriptionId(),
            tabindex: -1,
            "data-dialog-part": "popup",
            ...stateAttributes({
                open: context.open(),
                "starting-style": context.presence.status() === "starting",
                "ending-style": context.presence.status() === "ending",
            }),
        }),
        { ref: context.setPopup, omit: ["initialFocus", "finalFocus"] },
    );
}
