import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    input,
    untracked,
} from "@angular/core";
import {
    focusInitial,
    inertOutside,
    lockScroll,
    openOverlaySession,
    trapFocus,
} from "@poc/dom";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { DialogRoot } from "./dialog-root.directive.ts";

export interface DialogPopupState {
    open: boolean;
}

/**
 * The modal dialog (spec/dialog.md): focus trap, inert page, scroll lock, its own layer.
 * `<div dialogPopup [initialFocus]="cancel">`.
 */
@Directive({
    selector: "[dialogPopup]",
    exportAs: "dialogPopup",
    host: {
        role: "dialog",
        "aria-modal": "true",
        tabindex: "-1",
        "data-dialog-part": "popup",
        "[attr.id]": "root.overlay.popupId",
        "[attr.aria-labelledby]": "root.titleId() ?? null",
        "[attr.aria-describedby]": "root.descriptionId() ?? null",
        "[attr.data-open]": "data().open",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
    },
})
export class DialogPopup {
    protected readonly root = inject(DialogRoot);
    /** Focused on open (default: the first tabbable element, else the popup). */
    readonly initialFocus = input<FocusTarget>(undefined);
    /** Focused on close (default: the trigger, else the element focused before opening). */
    readonly finalFocus = input<FocusTarget>(undefined);
    readonly state = computed<DialogPopupState>(() => ({
        open: this.root.overlay.open(),
    }));
    protected readonly data = computed(() => {
        const status = this.root.overlay.presence.status();
        return dataValues({
            open: this.state().open,
            "starting-style": status === "starting",
            "ending-style": status === "ending",
        });
    });

    constructor() {
        const popup = registerHost(this.root.overlay.popup);
        const overlay = this.root.overlay;
        afterRenderEffect((onCleanup) => {
            const open = overlay.open();
            const backdrop = this.root.backdrop();
            const trigger = overlay.trigger();
            if (!open) {
                return;
            }
            untracked(() => {
                const doc = popup.ownerDocument;
                const previous =
                    doc.activeElement instanceof HTMLElement
                        ? doc.activeElement
                        : null;
                const session = openOverlaySession(doc, {
                    elements: () => [popup],
                    dismiss: (reason) => overlay.setOpen(false, reason),
                    returnFocus: {
                        reason: () => null,
                        to: () => {
                            const final = resolveFocusTarget(this.finalFocus());
                            return final === false
                                ? false
                                : (final ?? trigger ?? previous);
                        },
                    },
                });
                const initial = resolveFocusTarget(this.initialFocus());
                focusInitial(popup, initial === false ? popup : initial);
                const release = trapFocus(popup, session.elementsAbove);
                const unlock = lockScroll(doc);
                const restoreInert = inertOutside(
                    backdrop ? [popup, backdrop] : [popup],
                );
                onCleanup(() => {
                    release();
                    unlock();
                    restoreInert();
                    session.end();
                });
            });
        });
    }
}
