import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUIT_COMBOBOX } from "./fruit-combobox.ts";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

let count = 0;

@Component({
    selector: "[scenario-combobox-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <ng-container comboboxRoot [items]="fruits" [(value)]="value" [(inputValue)]="input" [(open)]="open" (openChangeDetails)="reason.set($event.details.reason)">
            ${FRUIT_COMBOBOX}
        </ng-container>
        <pre fixtureOutput [values]="{ value: print(value()), input: input(), open: open(), reason: reason() }"></pre>
    `,
})
export class ComboboxBasic {
    protected readonly styles = combobox;
    protected readonly id = `combobox-basic-${++count}`;
    protected readonly fruits = FRUITS;
    protected readonly print = printValues;
    protected readonly value = signal<Fruit | null>(null);
    protected readonly input = signal("");
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
}
