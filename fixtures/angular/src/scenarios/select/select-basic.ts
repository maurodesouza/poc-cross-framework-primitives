import { Component, signal, ViewEncapsulation } from "@angular/core";
import type { OpenChangeEvent } from "@poc/angular";
import { select } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";
import { FRUIT_ITEMS } from "./fruit-items.ts";
import { SELECT_PARTS } from "./select-parts.ts";

/**
 * The Select inside a form (spec/select.md). The root is a comment node and the list moves to
 * `body`, so the elements match React's.
 */
@Component({
    selector: "[scenario-select-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [SELECT_PARTS, Output],
    template: `
        <form class="flex flex-col items-start gap-2" (submit)="submit($event)">
            <label for="fruit" class="text-sm font-medium">Fruit</label>
            <ng-container selectRoot [items]="items" name="fruit" required (valueChange)="value.set($event)" (openChangeDetails)="onOpenChange($event)">
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
            <div class="flex gap-2">
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </div>
        </form>
        <pre fixtureOutput [values]="{ value: value(), open: open(), reason: reason(), form: form() }"></pre>
    `,
})
export class SelectBasic {
    protected readonly styles = select;
    protected readonly items = FRUIT_ITEMS;
    protected readonly value = signal<string | null>(null);
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
    protected readonly form = signal<string | undefined>(undefined);

    protected onOpenChange(event: OpenChangeEvent): void {
        this.open.set(event.open);
        this.reason.set(event.details.reason);
    }

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
