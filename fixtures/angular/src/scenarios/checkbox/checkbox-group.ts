import { Component, signal, ViewEncapsulation } from "@angular/core";
import { CheckboxGroup, CheckboxIndicator, CheckboxRoot } from "@poc/angular";
import { checkbox, checkboxGroup } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";

const TOPPINGS = [
    { value: "cheese", label: "Cheese" },
    { value: "ham", label: "Ham" },
    { value: "pineapple", label: "Pineapple" },
];

@Component({
    selector: "[scenario-checkbox-group]",
    encapsulation: ViewEncapsulation.None,
    imports: [CheckboxGroup, CheckboxRoot, CheckboxIndicator, Output],
    template: `
        <form class="flex flex-col items-start gap-2" (submit)="submit($event)">
            <h2 id="toppings" class="text-sm font-semibold">Toppings</h2>
            <div checkboxGroup aria-labelledby="toppings" [value]="value()" (valueChange)="value.set($event)" [allValues]="allValues" [class]="groupStyles.root">
                <label class="flex items-center gap-2 text-sm"><button checkboxRoot #all="checkboxRoot" parent [class]="styles.root"><span *checkboxIndicator [class]="styles.indicator">{{ all.state().indeterminate ? "–" : "✓" }}</span></button>All toppings</label>
                @for (topping of toppings; track topping.value) {
                    <label class="flex items-center gap-2 text-sm"><button checkboxRoot #box="checkboxRoot" name="toppings" [value]="topping.value" [class]="styles.root"><span *checkboxIndicator [class]="styles.indicator">{{ box.state().indeterminate ? "–" : "✓" }}</span></button>{{ topping.label }}</label>
                }
            </div>
            <button type="submit">Submit</button>
        </form>
        <pre fixtureOutput [values]="{ value: value().join(',') || undefined, form: form() }"></pre>
    `,
})
export class CheckboxGroupScenario {
    protected readonly styles = checkbox;
    protected readonly groupStyles = checkboxGroup;
    protected readonly toppings = TOPPINGS;
    protected readonly allValues = TOPPINGS.map((topping) => topping.value);
    protected readonly value = signal<string[]>(["cheese"]);
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
