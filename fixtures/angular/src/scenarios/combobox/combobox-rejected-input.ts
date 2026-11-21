import { Component, signal, ViewEncapsulation } from "@angular/core";
import { Output } from "../../kit/output.ts";
import { FruitCombobox } from "./fruit-combobox.ts";

/** The consumer refuses an input value with a digit: the input keeps the consumer's value. */
@Component({
    selector: "[scenario-combobox-rejected-input]",
    encapsulation: ViewEncapsulation.None,
    imports: [FruitCombobox, Output],
    template: `
        <div fruitCombobox [(value)]="value" [inputValue]="input()" (inputValueChange)="onInputValue($event)" [(open)]="open"></div>
        <pre fixtureOutput [values]="{ value: value(), input: input(), open: open() }"></pre>
    `,
})
export class ComboboxRejectedInput {
    protected readonly value = signal<string | null>(null);
    protected readonly input = signal("");
    protected readonly open = signal(false);

    protected onInputValue(next: string): void {
        if (!/\d/.test(next)) {
            this.input.set(next);
        }
    }
}
