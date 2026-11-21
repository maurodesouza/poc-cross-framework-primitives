import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { DATE_PICKER } from "./date-picker-state.ts";

/** Opens the picker; its content is the consumer's (the formatted value): `<button datePickerTrigger>`. */
@Directive({
    selector: "[datePickerTrigger]",
    exportAs: "datePickerTrigger",
    host: {
        type: "button",
        "aria-haspopup": "dialog",
        "data-date-picker-part": "trigger",
        "[attr.id]": "picker.overlay.triggerId",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "state().open ? picker.overlay.popupId : null",
        "[attr.data-open]": "data().open",
        "(click)": "picker.overlay.setOpen(!state().open, 'trigger-press')",
    },
})
export class DatePickerTrigger {
    protected readonly picker = inject(DATE_PICKER);
    readonly state = this.picker.state;
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly String = String;

    constructor() {
        registerHost(this.picker.overlay.trigger);
    }
}
