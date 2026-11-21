import {
    booleanAttribute,
    computed,
    Directive,
    inject,
    input,
} from "@angular/core";
import { getTabbables } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { PopoverRoot } from "./popover-root.directive.ts";

export interface PopoverTriggerState {
    open: boolean;
    disabled: boolean;
}

/**
 * Toggles the popover and anchors it: `<button popoverTrigger>`. While open, Tab from it enters
 * the popup (spec/popover.md).
 */
@Directive({
    selector: "[popoverTrigger]",
    exportAs: "popoverTrigger",
    host: {
        type: "button",
        "aria-haspopup": "dialog",
        "data-popover-part": "trigger",
        "[attr.id]": "root.overlay.triggerId",
        "[attr.disabled]": "data().disabled",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "state().open ? root.overlay.popupId : null",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "(click)": "root.overlay.setOpen(!state().open, 'trigger-press')",
        "(keydown)": "onKeyDown($event)",
    },
})
export class PopoverTrigger {
    protected readonly root = inject(PopoverRoot);
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly state = computed<PopoverTriggerState>(() => ({
        open: this.root.overlay.open(),
        disabled: this.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly String = String;

    constructor() {
        registerHost(this.root.overlay.trigger);
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const popup = this.root.overlay.popup();
        if (
            event.key === "Tab" &&
            !event.shiftKey &&
            this.state().open &&
            popup
        ) {
            event.preventDefault();
            (getTabbables(popup)[0] ?? popup).focus();
        }
    }
}
