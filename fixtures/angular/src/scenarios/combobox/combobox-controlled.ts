import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUIT_COMBOBOX } from "./fruit-combobox.ts";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

let count = 0;

@Component({
    selector: "[scenario-combobox-controlled]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <ng-container comboboxRoot [items]="fruits" [(value)]="value" [(inputValue)]="input" [(open)]="open">
            ${FRUIT_COMBOBOX}
        </ng-container>
        <button type="button" class="mt-2" (click)="reset()">Reset</button>
        <pre fixtureOutput [values]="{ value: print(value()), input: input(), open: open() }"></pre>
    `,
})
export class ComboboxControlled {
    protected readonly styles = combobox;
    protected readonly id = `combobox-controlled-${++count}`;
    protected readonly fruits = FRUITS;
    protected readonly print = printValues;
    protected readonly value = signal<Fruit | null>(
        FRUITS.find((fruit) => fruit.value === "mango") ?? null,
    );
    protected readonly input = signal("Mango");
    protected readonly open = signal(false);

    protected reset(): void {
        this.value.set(null);
        this.input.set("");
    }
}
