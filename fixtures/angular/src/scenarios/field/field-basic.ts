import { Component, signal, ViewEncapsulation } from "@angular/core";
import { field } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";
import { FIELD_PARTS } from "./field-parts.ts";

/** A required email and a disabled field in a form (spec/field.md). */
@Component({
    selector: "[scenario-field-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [FIELD_PARTS, Output],
    template: `
        <form class="flex flex-col items-start gap-4" (submit)="submit($event)">
            <div fieldRoot [name]="'email'" [class]="styles.root">
                <label fieldLabel [class]="styles.label">Email</label>
                <input fieldControl type="email" required [class]="styles.control" />
                <p fieldDescription [class]="styles.description">We never share it.</p>
                <div *fieldError="'valueMissing'" [class]="styles.error">Enter your email.</div>
                <div *fieldError="'typeMismatch'" [class]="styles.error">Enter a valid email.</div>
            </div>
            <div fieldRoot [name]="'nickname'" [disabled]="true" [class]="styles.root">
                <label fieldLabel [class]="styles.label">Nickname</label>
                <input fieldControl [class]="styles.control" />
                <p fieldDescription [class]="styles.description">Shown on your profile.</p>
            </div>
            <button type="submit">Submit</button>
        </form>
        <pre fixtureOutput [values]="{ form: form() }"></pre>
    `,
})
export class FieldBasic {
    protected readonly styles = field;
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
