import { FieldControl } from "./field-control.ts";
import { FieldDescription } from "./field-description.ts";
import { FieldError } from "./field-error.ts";
import { FieldLabel } from "./field-label.ts";
import { FieldRoot } from "./field-root.ts";

/** spec/field.md */
export const Field = {
    Root: FieldRoot,
    Label: FieldLabel,
    Control: FieldControl,
    Description: FieldDescription,
    Error: FieldError,
};
