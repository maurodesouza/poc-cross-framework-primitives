import { createContext } from "solid-js";

export interface CheckboxGroupContextValue {
    value: () => readonly string[];
    allValues: () => readonly string[];
    disabled: () => boolean;
    /** Checks or clears one child's value. */
    toggle: (value: string, checked: boolean) => void;
    /** The parent checkbox: checks every value of `allValues`, or none. */
    setAll: (checked: boolean) => void;
    /** A form reset: back to `defaultValue`. */
    reset: () => void;
    /** The children's element ids, for the parent's `aria-controls`. */
    ids: () => Readonly<Record<string, string>>;
    registerId: (value: string, id: string | null) => void;
}

export const CheckboxGroupContext =
    createContext<CheckboxGroupContextValue | null>(null);
