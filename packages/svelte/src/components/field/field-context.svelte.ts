import {
    type FieldState,
    type FieldValidate,
    type FieldValidation,
    type FieldValidationMode,
    fieldDescribedBy,
    shownAfterChange,
    UNVALIDATED,
    validateField,
    validatesOnChange,
} from "@poc/dom";
import { untrack } from "svelte";
import { createContext } from "../../utils/context.ts";

export interface FieldOptions {
    name: string | undefined;
    disabled: boolean;
    invalid: boolean;
    validate: FieldValidate | undefined;
    validationMode: FieldValidationMode;
}

/** A field's state, validation and ids (spec/field.md); the Root provides it, the parts read it. */
export class FieldRootState {
    touched = $state(false);
    focused = $state(false);
    dirty = $state(false);
    filled = $state(false);
    shown = $state.raw<FieldValidation>(UNVALIDATED);
    labelId = $state<string>();
    /** The control's id, and whether `<label for>` can point at it. */
    control = $state.raw<{ id: string; labelable: boolean } | null>(null);
    /** The description and the shown errors: listed in the control's `aria-describedby`. */
    messages = $state.raw<readonly HTMLElement[]>([]);
    readonly describedBy = $derived(fieldDescribedBy(this.messages));
    // whether the value changed once, or a submission was attempted (the required rule)
    #changed = false;
    #submitted = false;

    constructor(readonly options: () => FieldOptions) {}

    get name(): string | undefined {
        return this.options().name;
    }

    get disabled(): boolean {
        return this.options().disabled;
    }

    get valid(): boolean | null {
        const { disabled, invalid } = this.options();
        return disabled ? null : invalid ? false : this.shown.validity.valid;
    }

    /** `aria-invalid`: the field shows an error and is not disabled. */
    get invalid(): boolean {
        return this.valid === false;
    }

    get state(): FieldState {
        return {
            valid: this.valid,
            dirty: this.dirty,
            touched: this.touched,
            filled: this.filled,
            focused: this.focused,
            disabled: this.disabled,
        };
    }

    registerControl(id: string, labelable: boolean): () => void {
        this.control = { id, labelable };
        return () => {
            this.control = null;
        };
    }

    registerMessage(element: HTMLElement): () => void {
        // called from an effect: never depend on the list it writes
        untrack(() => {
            this.messages = [...this.messages, element];
        });
        return () =>
            untrack(() => {
                this.messages = this.messages.filter(
                    (entry) => entry !== element,
                );
            });
    }

    #run(
        input: HTMLInputElement | null,
        value: unknown,
        always: boolean,
    ): FieldValidation {
        return validateField(input, {
            value,
            validate: untrack(() => this.options().validate),
            valueChanged: this.#changed,
            always,
        });
    }

    #mode(): FieldValidationMode {
        return untrack(() => this.options().validationMode);
    }

    /** The control mounted: sets the custom validity, shows nothing. */
    mounted(input: HTMLInputElement | null, value: unknown, filled: boolean) {
        this.filled = filled;
        this.#run(input, value, false);
    }

    changed(
        input: HTMLInputElement | null,
        value: unknown,
        dirty: boolean,
        filled: boolean,
    ) {
        this.#changed = true;
        this.dirty = dirty;
        this.filled = filled;
        const onChange = validatesOnChange(this.#mode(), this.#submitted);
        const next = this.#run(input, value, onChange);
        this.shown = shownAfterChange(
            untrack(() => this.shown),
            next,
            onChange,
        );
    }

    focus() {
        this.focused = true;
    }

    blur(input: HTMLInputElement | null, value: unknown) {
        this.focused = false;
        this.touched = true;
        if (this.#mode() === "onBlur") {
            this.shown = this.#run(input, value, false);
        }
    }

    submitAttempt(input: HTMLInputElement | null, value: unknown) {
        this.#submitted = true;
        this.#changed = true;
        this.shown = this.#run(
            input,
            value,
            validatesOnChange(this.#mode(), true),
        );
    }
}

export const FieldContext = createContext<FieldRootState>("Field.Root");
