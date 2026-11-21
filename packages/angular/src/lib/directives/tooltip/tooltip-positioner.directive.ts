import { computed, Directive, inject, input } from "@angular/core";
import type { Align, Side } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { positionOverlay } from "../../utils/positioner.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { TooltipRoot } from "./tooltip-root.directive.ts";

/** Places the popup next to its anchor (spec/tooltip.md, "Positioning"): `<div tooltipPositioner>`. */
@Directive({
    selector: "[tooltipPositioner]",
    exportAs: "tooltipPositioner",
    host: {
        role: "presentation",
        "data-tooltip-part": "positioner",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
    },
})
export class TooltipPositioner {
    private readonly root = inject(TooltipRoot);
    readonly side = input<Side | undefined>(undefined);
    readonly align = input<Align | undefined>(undefined);
    readonly sideOffset = input<number | undefined>(undefined);
    readonly alignOffset = input<number | undefined>(undefined);
    readonly collisionPadding = input<number | undefined>(undefined);
    readonly anchor = input<Element | null | undefined>(undefined);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        ...this.root.placed(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const overlay = this.root.overlay;
        positionOverlay(
            this,
            { side: "top", align: "center" },
            {
                anchor: overlay.trigger,
                positioner: registerHost(overlay.positioner),
                arrow: this.root.arrow,
            },
            this.root.placed,
        );
    }
}
