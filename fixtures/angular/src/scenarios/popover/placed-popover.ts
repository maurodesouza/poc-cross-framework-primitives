import { Component, input, ViewEncapsulation } from "@angular/core";
import type { Align, Side } from "@poc/angular";
import { popover } from "@poc/styles";
import { POPOVER_PARTS } from "./popover-parts.ts";

/**
 * A popover whose popup is titled "Placed", placed by its Positioner inputs. The component is the
 * `<p>` that holds it in React's scenarios (an attribute selector).
 */
@Component({
    selector: "p[placedPopover]",
    encapsulation: ViewEncapsulation.None,
    imports: [POPOVER_PARTS],
    template: `
        <ng-container popoverRoot>
            <button popoverTrigger [class]="styles.trigger">{{ label() }}</button>
            <ng-container *popoverPortal>
                <div popoverPositioner [side]="side()" [align]="align()" [sideOffset]="4" [class]="styles.positioner">
                    <div popoverPopup [class]="styles.popup">
                        <h2 popoverTitle [class]="styles.title">Placed</h2>
                    </div>
                </div>
            </ng-container>
        </ng-container>
    `,
})
export class PlacedPopover {
    protected readonly styles = popover;
    readonly label = input.required<string>();
    readonly side = input.required<Side>();
    readonly align = input<Align | undefined>(undefined);
}
