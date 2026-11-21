import type { FieldState, FieldValidation } from "@poc/dom";
import { createContext } from "react";

/** What a control inside the field reports (spec/field.md, "Integration contract"). */
export interface FieldControlEvents {
    /** The control mounted: its value, whether it is filled. Sets the custom validity, shows nothing. */
    mounted: (
        input: HTMLInputElement | null,
        value: unknown,
        filled: boolean,
    ) => void;
    changed: (
        input: HTMLInputElement | null,
        value: unknown,
        dirty: boolean,
        filled: boolean,
    ) => void;
    focused: () => void;
    blurred: (input: HTMLInputElement | null, value: unknown) => void;
    submitAttempt: (input: HTMLInputElement | null, value: unknown) => void;
}

export interface FieldContextValue {
    state: FieldState;
    /** `aria-invalid`: the field shows an error and is not disabled. */
    invalid: boolean;
    name: string | undefined;
    disabled: boolean;
    shown: FieldValidation;
    labelId: string | undefined;
    setLabelId: (id: string | undefined) => void;
    /** The control's id, and whether `<label for>` can point at it. */
    control: { id: string; labelable: boolean } | null;
    registerControl: (id: string, labelable: boolean) => () => void;
    describedBy: string | undefined;
    /** A description, or a shown error: listed in the control's `aria-describedby`. */
    registerMessage: (element: HTMLElement) => () => void;
    events: FieldControlEvents;
}

export const FieldContext = createContext<FieldContextValue | null>(null);
