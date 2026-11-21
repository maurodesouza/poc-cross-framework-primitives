import FieldControl from "./field-control.svelte";
import FieldDescription from "./field-description.svelte";
import FieldError from "./field-error.svelte";
import FieldLabel from "./field-label.svelte";
import FieldRoot from "./field-root.svelte";

/** spec/field.md */
export const Field = {
    Root: FieldRoot,
    Label: FieldLabel,
    Control: FieldControl,
    Description: FieldDescription,
    Error: FieldError,
};
