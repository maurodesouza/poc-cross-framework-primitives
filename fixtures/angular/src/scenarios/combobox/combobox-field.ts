import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox, field } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";
import { FIELD_PARTS } from "../field/field-parts.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUIT_POPUP } from "./fruit-combobox.ts";
import { FRUITS } from "./fruits.ts";

/** The combobox inside a Field: labelled, described and validated by it (spec/combobox.md). */
@Component({
    selector: "[scenario-combobox-field]",
    encapsulation: ViewEncapsulation.None,
    imports: [FIELD_PARTS, COMBOBOX_PARTS, Output],
    template: `
        <form class="flex flex-col items-start gap-4" (submit)="submit($event)">
            <div fieldRoot [name]="'fruit'" [class]="fieldStyles.root">
                <label fieldLabel [class]="fieldStyles.label">Fruit</label>
                <ng-container comboboxRoot [items]="fruits" required>
                    <div comboboxInputGroup [class]="styles['input-group']">
                        <input comboboxInput [class]="styles.input" />
                        <button *comboboxClear aria-label="Clear fruit" [class]="styles.clear">×</button>
                        <button comboboxTrigger aria-label="Show fruits" [class]="styles.trigger">▾</button>
                    </div>
                    ${FRUIT_POPUP}
                </ng-container>
                <p fieldDescription [class]="fieldStyles.description">Pick one.</p>
                <div *fieldError [class]="fieldStyles.error">Choose a fruit.</div>
            </div>
            <button type="submit">Submit</button>
        </form>
        <pre fixtureOutput [values]="{ form: form() }"></pre>
    `,
})
export class ComboboxField {
    protected readonly styles = combobox;
    protected readonly fieldStyles = field;
    protected readonly fruits = FRUITS;
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
