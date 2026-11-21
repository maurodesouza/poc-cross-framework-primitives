import { computed, Directive, input } from "@angular/core";
import { createDelayGroup } from "@poc/dom";

/**
 * A delay group: shared delays and the instant hand-off (spec/tooltip.md, "Delay group"):
 * `<ng-container tooltipProvider [delay]="800">`. It renders no element.
 */
@Directive({ selector: "[tooltipProvider]", exportAs: "tooltipProvider" })
export class TooltipProvider {
    /** ms before a hovered trigger opens its tooltip. */
    readonly delay = input(600);
    /** ms before a tooltip closes once the pointer left. */
    readonly closeDelay = input(0);
    /** ms after a close during which another tooltip of the group opens at once. */
    readonly timeout = input(400);
    readonly group = computed(() =>
        createDelayGroup({ timeout: this.timeout() }),
    );
}
