import { Component, ViewEncapsulation } from "@angular/core";
import { PlacedPopover } from "./placed-popover.ts";

@Component({
    selector: "[scenario-popover-placement]",
    encapsulation: ViewEncapsulation.None,
    imports: [PlacedPopover],
    template: `
        <p class="my-4" placedPopover label="Bottom start" side="bottom" align="start"></p>
        <p class="my-4" placedPopover label="End" side="end"></p>
        <p class="fixed bottom-2 start-6" placedPopover label="Flip" side="bottom"></p>
    `,
})
export class PopoverPlacement {}
