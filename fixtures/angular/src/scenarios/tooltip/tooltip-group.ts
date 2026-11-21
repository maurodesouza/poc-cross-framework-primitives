import { Component, ViewEncapsulation } from "@angular/core";
import {
    TooltipPopup,
    TooltipPortal,
    TooltipPositioner,
    TooltipProvider,
    TooltipRoot,
    TooltipTrigger,
} from "@poc/angular";
import { tooltip } from "@poc/styles";

const TOOLS = [
    { label: "Bold", hint: "Bold (Ctrl+B)" },
    { label: "Italic", hint: "Italic (Ctrl+I)" },
    { label: "Underline", hint: "Underline (Ctrl+U)" },
];

@Component({
    selector: "[scenario-tooltip-group]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        TooltipProvider,
        TooltipRoot,
        TooltipTrigger,
        TooltipPortal,
        TooltipPositioner,
        TooltipPopup,
    ],
    template: `
        <ng-container tooltipProvider [delay]="800" [timeout]="400">
            <div class="flex gap-2">
                @for (tool of tools; track tool.label) {
                    <ng-container tooltipRoot>
                        <button tooltipTrigger [class]="styles.trigger">{{ tool.label }}</button>
                        <ng-container *tooltipPortal>
                            <div tooltipPositioner [sideOffset]="6" [class]="styles.positioner">
                                <div tooltipPopup [class]="styles.popup">{{ tool.hint }}</div>
                            </div>
                        </ng-container>
                    </ng-container>
                }
            </div>
            <div class="mt-30">
                <button type="button">Elsewhere</button>
            </div>
        </ng-container>
    `,
})
export class TooltipGroup {
    protected readonly styles = tooltip;
    protected readonly tools = TOOLS;
}
