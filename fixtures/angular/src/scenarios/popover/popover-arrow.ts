import { Component, ViewEncapsulation } from "@angular/core";
import { popover } from "@poc/styles";
import { POPOVER_PARTS } from "./popover-parts.ts";

@Component({
    selector: "[scenario-popover-arrow]",
    encapsulation: ViewEncapsulation.None,
    imports: [POPOVER_PARTS],
    template: `
        <ng-container popoverRoot>
            <button popoverTrigger [class]="styles.trigger">With arrow</button>
            <ng-container *popoverPortal>
                <div popoverPositioner [sideOffset]="10" [class]="styles.positioner">
                    <div popoverPopup [class]="styles.popup">
                        <div popoverArrow data-testid="arrow" [class]="styles.arrow"></div>
                        <h2 popoverTitle [class]="styles.title">Arrow</h2>
                    </div>
                </div>
            </ng-container>
        </ng-container>
    `,
})
export class PopoverArrow {
    protected readonly styles = popover;
}
