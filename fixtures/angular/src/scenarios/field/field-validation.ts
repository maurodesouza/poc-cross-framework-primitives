import { Component, signal, ViewEncapsulation } from "@angular/core";
import { field } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";
import { FIELD_PARTS } from "./field-parts.ts";
import {
    validateCode,
    validatePassword,
    validateUsername,
} from "./validators.ts";

/**
 * The three validation modes and `validate` (spec/field.md). An error with no children of its
 * own shows the field's messages.
 */
@Component({
    selector: "[scenario-field-validation]",
    encapsulation: ViewEncapsulation.None,
    imports: [FIELD_PARTS, Output],
    template: `
        <div class="flex flex-col items-start gap-4">
            <div fieldRoot [validationMode]="'onChange'" [validate]="validateUsername" [class]="styles.root">
                <label fieldLabel [class]="styles.label">Username</label>
                <input fieldControl [class]="styles.control" />
                <div *fieldError [class]="styles.error"></div>
            </div>
            <div fieldRoot [validationMode]="'onBlur'" [validate]="validatePassword" [class]="styles.root">
                <label fieldLabel [class]="styles.label">Password</label>
                <input fieldControl [class]="styles.control" />
                <div *fieldError [class]="styles.error"></div>
            </div>
            <form class="flex flex-col items-start gap-4" (submit)="submit($event)">
                <div fieldRoot [name]="'code'" [validate]="validateCode" [class]="styles.root">
                    <label fieldLabel [class]="styles.label">Code</label>
                    <input fieldControl pattern="[A-Z]{3}" [class]="styles.control" />
                    <div *fieldError="'patternMismatch'" [class]="styles.error">Use three capital letters.</div>
                    <div *fieldError="'customError'" [class]="styles.error"></div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
        <pre fixtureOutput [values]="{ form: form() }"></pre>
    `,
})
export class FieldValidation {
    protected readonly styles = field;
    protected readonly validateUsername = validateUsername;
    protected readonly validatePassword = validatePassword;
    protected readonly validateCode = validateCode;
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
