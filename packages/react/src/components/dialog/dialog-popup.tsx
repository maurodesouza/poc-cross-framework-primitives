import {
    focusInitial,
    inertOutside,
    lockScroll,
    openOverlaySession,
    trapFocus,
} from "@poc/dom";
import { useEffect, useRef } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
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
export function DialogPopup({
    initialFocus,
    finalFocus,
    ...props
}: DialogPopupProps) {
    const context = useRequiredContext(DialogContext, "Dialog.Popup");
    const { open, popup, backdrop, trigger, setOpen } = context;
    const focusTargets = useRef({ initialFocus, finalFocus });
    focusTargets.current = { initialFocus, finalFocus };

    useEffect(() => {
        if (!open || popup === null) {
            return undefined;
        }
        const doc = popup.ownerDocument;
        const previous =
            doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
        const session = openOverlaySession(doc, {
            elements: () => [popup],
            dismiss: (reason) => setOpen(false, reason),
            returnFocus: {
                reason: () => null,
                to: () => {
                    const final = resolveFocusTarget(
                        focusTargets.current.finalFocus,
                    );
                    return final === false
                        ? false
                        : (final ?? trigger ?? previous);
                },
            },
        });
        const initial = resolveFocusTarget(focusTargets.current.initialFocus);
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
    }, [open, popup, backdrop, trigger, setOpen]);

    const status = context.presence.status;
    return renderElement(
        "div",
        props,
        { open },
        {
            id: context.popupId,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": context.titleId,
            "aria-describedby": context.descriptionId,
            tabIndex: -1,
            "data-dialog-part": "popup",
            ...stateAttributes({
                open,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
        },
        context.setPopup,
    );
}
