import {
    FieldControl,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldRoot,
} from "@poc/angular";

/** Every Field directive, for a scenario's `imports`. */
export const FIELD_PARTS = [
    FieldRoot,
    FieldLabel,
    FieldControl,
    FieldDescription,
    FieldError,
] as const;
