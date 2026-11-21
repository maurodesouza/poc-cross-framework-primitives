import { computed, Directive, inject, input } from "@angular/core";
import type { Align, Side } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { positionOverlay } from "../../utils/positioner.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { PopoverRoot } from "./popover-root.directive.ts";

export interface PopoverPositionerState {
    open: boolean;
    side: Side;
    align: Align;
}

/** Places the popup next to its anchor (spec/popover.md, "Positioning"): `<div popoverPositioner>`. */
@Directive({
    selector: "[popoverPositioner]",
    exportAs: "popoverPositioner",
    host: {
        role: "presentation",
        "data-popover-part": "positioner",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
    },
})
export class PopoverPositioner {
    private readonly root = inject(PopoverRoot);
    readonly side = input<Side | undefined>(undefined);
    readonly align = input<Align | undefined>(undefined);
    readonly sideOffset = input<number | undefined>(undefined);
    readonly alignOffset = input<number | undefined>(undefined);
    readonly collisionPadding = input<number | undefined>(undefined);
    readonly anchor = input<Element | null | undefined>(undefined);
    readonly state = computed<PopoverPositionerState>(() => ({
        open: this.root.overlay.open(),
        ...this.root.placed(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const overlay = this.root.overlay;
        const positioner = registerHost(overlay.positioner);
        positionOverlay(
            this,
            { side: "bottom", align: "center" },
            { anchor: overlay.trigger, positioner, arrow: this.root.arrow },
            this.root.placed,
        );
    }
}
