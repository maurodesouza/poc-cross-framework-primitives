import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUIT_COMBOBOX } from "./fruit-combobox.ts";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

let count = 0;

/** The consumer refuses an input value with a digit: the input keeps the consumer's value. */
@Component({
    selector: "[scenario-combobox-rejected-input]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <ng-container comboboxRoot [items]="fruits" [(value)]="value" [inputValue]="input()" (inputValueChange)="onInputValue($event)" [(open)]="open">
            ${FRUIT_COMBOBOX}
        </ng-container>
        <pre fixtureOutput [values]="{ value: print(value()), input: input(), open: open() }"></pre>
    `,
})
export class ComboboxRejectedInput {
    protected readonly styles = combobox;
    protected readonly id = `combobox-rejected-input-${++count}`;
    protected readonly fruits = FRUITS;
    protected readonly print = printValues;
    protected readonly value = signal<Fruit | null>(null);
    protected readonly input = signal("");
    protected readonly open = signal(false);

    protected onInputValue(next: string): void {
        if (!/\d/.test(next)) {
            this.input.set(next);
        }
    }
}
