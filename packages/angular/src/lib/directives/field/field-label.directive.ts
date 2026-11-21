import { computed, Directive, input } from "@angular/core";
import { injectEnclosing } from "../../inject/enclosing.ts";
import { labelId } from "../../utils/label-id.ts";
import { FieldRoot } from "./field-root.directive.ts";

/**
 * Names the field's control: `for` a labelable control, `aria-labelledby` on any (spec/field.md):
 * `<label fieldLabel>Email</label>`.
 */
@Directive({
    selector: "[fieldLabel]",
    exportAs: "fieldLabel",
    host: {
        "data-field-part": "label",
        "[attr.id]": "resolvedId()",
        "[attr.for]": "htmlFor()",
        "[attr.data-invalid]": "field.data().invalid",
        "[attr.data-valid]": "field.data().valid",
        "[attr.data-dirty]": "field.data().dirty",
        "[attr.data-touched]": "field.data().touched",
        "[attr.data-filled]": "field.data().filled",
        "[attr.data-focused]": "field.data().focused",
        "[attr.data-disabled]": "field.data().disabled",
    },
})
export class FieldLabel {
    readonly id = input<string | undefined>(undefined);
    protected readonly field = injectEnclosing(
        FieldRoot,
        "fieldRoot",
        "FieldLabel",
    );
    protected readonly resolvedId = labelId(
        this.id,
        this.field.labelId,
        "poc-field-label",
    );
    protected readonly htmlFor = computed(() => {
        const control = this.field.control();
        return control?.labelable ? control.id : null;
    });
    readonly state = this.field.state;
}
