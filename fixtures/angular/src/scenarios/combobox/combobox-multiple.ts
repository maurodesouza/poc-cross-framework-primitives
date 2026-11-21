import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUIT_POPUP_WITH_INDICATOR, fruitChips } from "./fruit-combobox.ts";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

const DEFAULT = FRUITS.filter(
    (fruit) => fruit.value === "apple" || fruit.value === "cherry",
);

let count = 0;

/** `multiple`, with chips, a Clear and a Status (spec/combobox.md). */
@Component({
    selector: "[scenario-combobox-multiple]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <ng-container comboboxRoot #combobox="comboboxRoot" multiple [items]="fruits" [(value)]="value">
            <div class="flex flex-col gap-1">
                <label [attr.for]="id" class="text-sm font-medium">Fruits</label>
                ${fruitChips(
                    "combobox",
                    "id",
                    `<button *comboboxClear aria-label="Clear fruits" [class]="styles.clear">×</button>
                    <button comboboxTrigger aria-label="Show fruits" [class]="styles.trigger">▾</button>`,
                )}
            </div>
            <div comboboxStatus [class]="styles.status">{{ value().length === 1 ? "1 fruit selected." : value().length + " fruits selected." }}</div>
            ${FRUIT_POPUP_WITH_INDICATOR}
        </ng-container>
        <pre fixtureOutput [values]="{ value: print(value()) }"></pre>
    `,
})
export class ComboboxMultiple {
    protected readonly styles = combobox;
    protected readonly id = `combobox-multiple-${++count}`;
    protected readonly fruits = FRUITS;
    protected readonly print = printValues;
    protected readonly value = signal<Fruit[]>(DEFAULT);
}
