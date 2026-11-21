import { Component, signal, ViewEncapsulation } from "@angular/core";
import { Output } from "../../kit/output.ts";
import { FruitCombobox } from "./fruit-combobox.ts";

@Component({
    selector: "[scenario-combobox-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [FruitCombobox, Output],
    template: `
        <div fruitCombobox [(value)]="value" [(inputValue)]="input" [(open)]="open" (openChangeDetails)="reason.set($event.details.reason)"></div>
        <pre fixtureOutput [values]="{ value: value(), input: input(), open: open(), reason: reason() }"></pre>
    `,
})
export class ComboboxBasic {
    protected readonly value = signal<string | null>(null);
    protected readonly input = signal("");
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
}
