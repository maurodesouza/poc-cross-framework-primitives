import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    untracked,
} from "@angular/core";
import { getTabbables, nextTabbableAfter, openOverlaySession } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { DATE_PICKER } from "./date-picker-state.ts";

const RETURNS_FOCUS = new Set(["escape-key", "item-press", "trigger-press"]);

/** The non-modal dialog holding the bound calendar (spec/calendar.md, pickers): `<div datePickerPopup>`. */
@Directive({
    selector: "[datePickerPopup]",
    exportAs: "datePickerPopup",
    host: {
        role: "dialog",
        "data-date-picker-part": "popup",
        "[attr.id]": "picker.overlay.popupId",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
        "(keydown)": "onKeyDown($event)",
    },
})
export class DatePickerPopup {
    protected readonly picker = inject(DATE_PICKER);
    readonly state = computed(() => ({
        open: this.picker.overlay.open(),
        ...this.picker.placed(),
    }));
    protected readonly data = computed(() => {
        const status = this.picker.overlay.presence.status();
        return dataValues({
            ...this.state(),
            "starting-style": status === "starting",
            "ending-style": status === "ending",
        });
    });

    private readonly popup: HTMLElement;

    constructor() {
        const overlay = this.picker.overlay;
        const popup = registerHost(overlay.popup);
        this.popup = popup;
        afterRenderEffect((onCleanup) => {
            const open = overlay.open();
            const positioner = overlay.positioner();
            const trigger = overlay.trigger();
            if (!open) {
                return;
            }
            untracked(() => {
                const session = openOverlaySession(popup.ownerDocument, {
                    elements: () => [positioner ?? popup],
                    ignore: () => [trigger],
                    dismiss: (reason) => overlay.setOpen(false, reason),
                    focusOut: () => [trigger],
                    returnFocus: {
                        when: RETURNS_FOCUS,
                        reason: () => overlay.lastReason.current,
                        to: () => trigger,
                    },
                });
                onCleanup(session.end);
            });
        });
    }

    protected onKeyDown(event: KeyboardEvent): void {
        if (event.key !== "Tab" || event.defaultPrevented) {
            return;
        }
        const overlay = this.picker.overlay;
        const popup = this.popup;
        const trigger = overlay.trigger();
        // in the tab order, the popup's content comes right after the trigger (as popover.md)
        const tabbables = getTabbables(popup);
        const active = popup.ownerDocument.activeElement;
        const first = tabbables[0] ?? popup;
        const last = tabbables.at(-1) ?? popup;
        if (event.shiftKey && (active === first || active === popup)) {
            event.preventDefault();
            overlay.setOpen(false, "focus-out");
            trigger?.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            const next = trigger
                ? nextTabbableAfter(trigger, [overlay.positioner(), popup])
                : null;
            overlay.setOpen(false, "focus-out");
            next?.focus();
        }
    }
}
