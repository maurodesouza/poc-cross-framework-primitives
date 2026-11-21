import { Component, signal, ViewEncapsulation } from "@angular/core";
import { popover } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { POPOVER_PARTS } from "./popover-parts.ts";

@Component({
    selector: "[scenario-popover-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [POPOVER_PARTS, Output],
    template: `
        <ng-container popoverRoot [(open)]="open" (openChangeDetails)="reason.set($event.details.reason)">
            <button popoverTrigger [class]="styles.trigger">Open popover</button>
            <ng-container *popoverPortal>
                <div popoverPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div popoverPopup [class]="styles.popup">
                        <h2 popoverTitle [class]="styles.title">Notifications</h2>
                        <p popoverDescription [class]="styles.description">You have 3 unread messages.</p>
                        <button type="button">Mark all as read</button>
                        <button popoverClose [class]="styles.close">Close</button>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <button type="button" class="ms-2">After trigger</button>
        <pre fixtureOutput [values]="{ open: open(), reason: reason() }"></pre>
    `,
})
export class PopoverBasic {
    protected readonly styles = popover;
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
}
