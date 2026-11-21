import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
    type OpenChangeEvent,
    TooltipArrow,
    TooltipPopup,
    TooltipPortal,
    TooltipPositioner,
    TooltipRoot,
    TooltipTrigger,
} from "@poc/angular";
import { tooltip } from "@poc/styles";
import { Output } from "../../kit/output.ts";

@Component({
    selector: "[scenario-tooltip-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        TooltipRoot,
        TooltipTrigger,
        TooltipPortal,
        TooltipPositioner,
        TooltipPopup,
        TooltipArrow,
        Output,
    ],
    template: `
        <div class="flex gap-2">
            <button type="button">Before</button>
            <ng-container tooltipRoot [delay]="500" [open]="open()" (openChangeDetails)="onOpenChange($event)">
                <button tooltipTrigger [class]="styles.trigger">Save</button>
                <ng-container *tooltipPortal>
                    <div tooltipPositioner [sideOffset]="6" [class]="styles.positioner">
                        <div tooltipPopup [class]="styles.popup"><div tooltipArrow [class]="styles.arrow"></div>Save the document</div>
                    </div>
                </ng-container>
            </ng-container>
        </div>
        <pre fixtureOutput [values]="{ open: open(), reason: reason() }"></pre>
    `,
})
export class TooltipBasic {
    protected readonly styles = tooltip;
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);

    protected onOpenChange(event: OpenChangeEvent): void {
        this.open.set(event.open);
        this.reason.set(event.details.reason);
    }
}
