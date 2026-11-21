import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { TooltipRoot } from "./tooltip-root.directive.ts";

/** Points at the anchor; placed along the popup's edge by the positioner: `<div tooltipArrow>`. */
@Directive({
    selector: "[tooltipArrow]",
    exportAs: "tooltipArrow",
    host: {
        "aria-hidden": "true",
        "data-tooltip-part": "arrow",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
    },
})
export class TooltipArrow {
    private readonly root = inject(TooltipRoot);
    readonly state = this.root.placed.asReadonly();
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        registerHost(this.root.arrow);
    }
}
