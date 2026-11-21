import { Component, signal, ViewEncapsulation } from "@angular/core";
import { Output } from "../../kit/output.ts";
import { FruitCombobox } from "./fruit-combobox.ts";

@Component({
    selector: "[scenario-combobox-controlled]",
    encapsulation: ViewEncapsulation.None,
    imports: [FruitCombobox, Output],
    template: `
        <div fruitCombobox [(value)]="value" [(inputValue)]="input" [(open)]="open"></div>
        <button type="button" class="mt-2" (click)="reset()">Reset</button>
        <pre fixtureOutput [values]="{ value: value(), input: input(), open: open() }"></pre>
    `,
})
export class ComboboxControlled {
    protected readonly value = signal<string | null>("mango");
    protected readonly input = signal("Mango");
    protected readonly open = signal(false);

    protected reset(): void {
        this.value.set(null);
        this.input.set("");
    }
}
