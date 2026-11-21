import { Component, signal, ViewEncapsulation } from "@angular/core";
import { CheckboxIndicator, CheckboxRoot } from "@poc/angular";
import { checkbox } from "@poc/styles";
import { Output } from "../../kit/output.ts";

/** The consumer refuses to clear the checkbox: it stays checked. */
@Component({
    selector: "[scenario-checkbox-controlled]",
    encapsulation: ViewEncapsulation.None,
    imports: [CheckboxRoot, CheckboxIndicator, Output],
    template: `
        <label class="flex items-center gap-2 text-sm"><button checkboxRoot #box="checkboxRoot" [checked]="checked()" (checkedChange)="onCheckedChange($event)" [class]="styles.root"><span *checkboxIndicator [class]="styles.indicator">{{ box.state().indeterminate ? "–" : "✓" }}</span></button>Keep me signed in</label>
        <pre fixtureOutput [values]="{ checked: checked(), requested: requested() }"></pre>
    `,
})
export class CheckboxControlled {
    protected readonly styles = checkbox;
    protected readonly checked = signal(true);
    protected readonly requested = signal<boolean | undefined>(undefined);

    protected onCheckedChange(next: boolean): void {
        this.requested.set(next);
        if (next) {
            this.checked.set(true);
        }
    }
}
