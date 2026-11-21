import { Component, signal, ViewEncapsulation } from "@angular/core";
import { select } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { FRUIT_ITEMS } from "./fruit-items.ts";
import { SELECT_PARTS } from "./select-parts.ts";

/** The consumer refuses Cherry: the value stays. */
@Component({
    selector: "[scenario-select-controlled]",
    encapsulation: ViewEncapsulation.None,
    imports: [SELECT_PARTS, Output],
    template: `
        <div class="flex flex-col items-start gap-2">
            <label for="fruit" class="text-sm font-medium">Fruit</label>
            <ng-container selectRoot [items]="items" [value]="value()" (valueChange)="onValueChange($event)">
                <button selectTrigger id="fruit" [class]="styles.trigger"><span selectValue placeholder="Choose a fruit" [class]="styles.value"></span></button>
                <ng-container *selectPortal>
                    <div selectPositioner [class]="styles.positioner">
                        <div selectPopup [class]="styles.popup">
                            <div selectList [class]="styles.list">
                                @for (item of items; track item.value) {
                                    <div selectItem [value]="item.value" [class]="styles.item">{{ item.label }}<span *selectItemIndicator [class]="styles['item-indicator']">✓</span></div>
                                }
                            </div>
                        </div>
                    </div>
                </ng-container>
            </ng-container>
        </div>
        <pre fixtureOutput [values]="{ value: value(), requested: requested() }"></pre>
    `,
})
export class SelectControlled {
    protected readonly styles = select;
    protected readonly items = FRUIT_ITEMS;
    protected readonly value = signal<string | null>("apple");
    protected readonly requested = signal<string | null | undefined>(undefined);

    protected onValueChange(next: string | null): void {
        this.requested.set(next);
        if (next !== "cherry") {
            this.value.set(next);
        }
    }
}
