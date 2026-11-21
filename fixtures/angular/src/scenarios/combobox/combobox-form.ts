import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";
import { TOPPINGS } from "./combobox-items.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUIT_POPUP, fruitChips } from "./fruit-combobox.ts";
import { FRUITS } from "./fruits.ts";

const NUTS = TOPPINGS.filter((topping) => topping.value === "nuts");

let count = 0;

/** A single and a multiple combobox in a native form (spec/combobox.md). */
@Component({
    selector: "[scenario-combobox-form]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <form class="flex flex-col items-start gap-4" (submit)="submit($event)">
            <ng-container comboboxRoot [items]="fruits" name="fruit" required>
                <div class="flex flex-col gap-1">
                    <label [attr.for]="id" class="text-sm font-medium">Fruit</label>
                    <div comboboxInputGroup [class]="styles['input-group']">
                        <input comboboxInput [id]="id" [class]="styles.input" />
                    </div>
                </div>
                ${FRUIT_POPUP}
            </ng-container>
            <ng-container comboboxRoot #toppings="comboboxRoot" multiple [items]="toppingItems" name="toppings" [defaultValue]="nuts">
                <div class="flex flex-col gap-1">
                    <label [attr.for]="toppingsId" class="text-sm font-medium">Toppings</label>
                    ${fruitChips("toppings", "toppingsId", "")}
                </div>
                <ng-container *comboboxPortal>
                    <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
                        <div comboboxPopup [class]="styles.popup">
                            <div comboboxList #toppingList="comboboxList" [class]="styles.list">
                                @for (topping of toppingList.entries(); track topping.value) {
                                    <div comboboxItem [value]="topping" [class]="styles.item">{{ topping.label }}</div>
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
        <pre fixtureOutput [values]="{ form: form() }"></pre>
    `,
})
export class ComboboxForm {
    protected readonly styles = combobox;
    protected readonly id = `combobox-form-fruit-${++count}`;
    protected readonly toppingsId = `combobox-form-toppings-${count}`;
    protected readonly fruits = FRUITS;
    protected readonly toppingItems = TOPPINGS;
    protected readonly nuts = NUTS;
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
