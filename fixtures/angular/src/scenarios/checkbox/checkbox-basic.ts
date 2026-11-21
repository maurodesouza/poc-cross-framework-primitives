import { Component, signal, ViewEncapsulation } from "@angular/core";
import { CheckboxIndicator, CheckboxRoot } from "@poc/angular";
import { checkbox } from "@poc/styles";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.ts";

/**
 * The checkboxes inside a form (spec/checkbox.md). Each hidden input follows its checkbox, and
 * each label's text is one text node after it, as in React.
 */
@Component({
    selector: "[scenario-checkbox-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [CheckboxRoot, CheckboxIndicator, Output],
    template: `
        <form class="flex flex-col items-start gap-2" (submit)="submit($event)">
            <label class="flex items-center gap-2 text-sm"><button checkboxRoot #termsBox="checkboxRoot" name="terms" required (checkedChange)="terms.set($event)" [class]="styles.root"><span *checkboxIndicator [class]="styles.indicator">{{ termsBox.state().indeterminate ? "–" : "✓" }}</span></button>Accept terms</label>
            <label class="flex items-center gap-2 text-sm"><button checkboxRoot #newsBox="checkboxRoot" name="news" value="yes" defaultChecked [class]="styles.root"><span *checkboxIndicator [class]="styles.indicator">{{ newsBox.state().indeterminate ? "–" : "✓" }}</span></button>Subscribe</label>
            <label class="flex items-center gap-2 text-sm"><button checkboxRoot #lockedBox="checkboxRoot" disabled [class]="styles.root"><span *checkboxIndicator [class]="styles.indicator">{{ lockedBox.state().indeterminate ? "–" : "✓" }}</span></button>Locked</label>
            <div class="flex gap-2">
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </div>
        </form>
        <pre fixtureOutput [values]="{ terms: terms(), form: form() }"></pre>
    `,
})
export class CheckboxBasic {
    protected readonly styles = checkbox;
    protected readonly terms = signal<boolean | undefined>(undefined);
    protected readonly form = signal<string | undefined>(undefined);

    protected submit(event: SubmitEvent): void {
        event.preventDefault();
        this.form.set(formEntries(event.currentTarget as HTMLFormElement));
    }
}
