import { computed, Directive, inject, input } from "@angular/core";
import type { Align, Side } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { positionOverlay } from "../../utils/positioner.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { DATE_PICKER } from "./date-picker-state.ts";

/** Places the popup under the trigger: `<div datePickerPositioner>`. */
@Directive({
    selector: "[datePickerPositioner]",
    exportAs: "datePickerPositioner",
    host: {
        role: "presentation",
        "data-date-picker-part": "positioner",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
    },
})
export class DatePickerPositioner {
    private readonly picker = inject(DATE_PICKER);
    readonly side = input<Side | undefined>(undefined);
    readonly align = input<Align | undefined>(undefined);
    readonly sideOffset = input<number | undefined>(undefined);
    readonly alignOffset = input<number | undefined>(undefined);
    readonly collisionPadding = input<number | undefined>(undefined);
    readonly anchor = input<Element | null | undefined>(undefined);
    readonly state = computed(() => ({
        open: this.picker.overlay.open(),
        ...this.picker.placed(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const overlay = this.picker.overlay;
        positionOverlay(
            this,
            { side: "bottom", align: "start" },
            {
                anchor: overlay.trigger,
                positioner: registerHost(overlay.positioner),
            },
            this.picker.placed,
        );
    }
}
