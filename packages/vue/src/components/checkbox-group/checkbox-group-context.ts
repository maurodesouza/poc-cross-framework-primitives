import type { ComputedRef, InjectionKey, Ref } from "vue";

export interface CheckboxGroupContext {
    value: ComputedRef<readonly string[]>;
    allValues: () => readonly string[];
    disabled: () => boolean;
    /** Checks or clears one child's value. */
    toggle: (value: string, checked: boolean) => void;
    /** The parent checkbox: checks every value of `allValues`, or none. */
    setAll: (checked: boolean) => void;
    /** A form reset: back to `defaultValue`. */
    reset: () => void;
    /** The children's element ids, for the parent's `aria-controls`. */
    ids: Ref<Readonly<Record<string, string>>>;
}

export const CheckboxGroupKey: InjectionKey<CheckboxGroupContext> =
    Symbol("CheckboxGroup");
