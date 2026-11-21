import { inject } from "@angular/core";
import { FieldRoot } from "../directives/field/field-root.directive.ts";

/**
 * The enclosing `[fieldRoot]`, or `null` outside a field (spec/field.md, "Integration contract"):
 * a control reads the field's state, ids, `name` and `disabled` through it, and reports its
 * interaction to it (`events`).
 */
export function injectField(): FieldRoot | null {
    return inject(FieldRoot, { optional: true });
}
