import { Component, ViewEncapsulation } from "@angular/core";
import { PlacedPopover } from "./placed-popover.ts";

@Component({
    selector: "[scenario-popover-rtl]",
    encapsulation: ViewEncapsulation.None,
    imports: [PlacedPopover],
    template: `<p class="my-4" placedPopover label="End" side="end"></p>`,
})
export class PopoverRtl {}
