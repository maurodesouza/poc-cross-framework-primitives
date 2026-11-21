import {
    booleanAttribute,
    computed,
    Directive,
    input,
    signal,
    untracked,
} from "@angular/core";
import {
    type FieldState,
    type FieldValidate,
    type FieldValidation,
    type FieldValidationMode,
    fieldDescribedBy,
    fieldStateAttributes,
    shownAfterChange,
    UNVALIDATED,
    validateField,
    validatesOnChange,
} from "@poc/dom";
import { dataValues } from "../../utils/state-attributes.ts";

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

/**
 * Holds the field's state, validation and ids (spec/field.md), on the consumer's own element:
 * `<div fieldRoot name="email" [validate]="check" validationMode="onBlur">`. The parts and the
 * integrated controls inside it find it by injection (`injectField()`).
 */
@Directive({
    selector: "[fieldRoot]",
    exportAs: "fieldRoot",
    host: {
        "data-field-part": "root",
        "[attr.data-invalid]": "data().invalid",
        "[attr.data-valid]": "data().valid",
        "[attr.data-dirty]": "data().dirty",
        "[attr.data-touched]": "data().touched",
        "[attr.data-filled]": "data().filled",
        "[attr.data-focused]": "data().focused",
        "[attr.data-disabled]": "data().disabled",
    },
})
export class FieldRoot {
    /** The control's form name; it wins over the control's own. */
    readonly name = input<string | undefined>(undefined);
    readonly disabled = input(false, { transform: booleanAttribute });
    /** Forces the invalid state (an error the app found). */
    readonly invalid = input(false, { transform: booleanAttribute });
    readonly validate = input<FieldValidate | undefined>(undefined);
    readonly validationMode = input<FieldValidationMode>("onSubmit");

    private readonly touched = signal(false);
    private readonly focused = signal(false);
    private readonly dirty = signal(false);
    private readonly filled = signal(false);
    /** What the field shows: its validity and messages. */
    readonly shown = signal<FieldValidation>(UNVALIDATED);
    /** The label's id, for the control's `aria-labelledby`. */
    readonly labelId = signal<string | undefined>(undefined);
    /** The control's id, and whether `<label for>` can point at it. */
    readonly control = signal<{ id: string; labelable: boolean } | null>(null);
    private readonly messages = signal<readonly HTMLElement[]>([]);
    /** The description's and the shown errors' ids, in document order. */
    readonly describedBy = computed(() => fieldDescribedBy(this.messages()));
    private readonly valid = computed(() =>
        this.disabled()
            ? null
            : this.invalid()
              ? false
              : this.shown().validity.valid,
    );
    /** `aria-invalid`: the field shows an error and is not disabled. */
    readonly showsInvalid = computed(() => this.valid() === false);
    readonly state = computed<FieldState>(() => ({
        valid: this.valid(),
        dirty: this.dirty(),
        touched: this.touched(),
        filled: this.filled(),
        focused: this.focused(),
        disabled: this.disabled(),
    }));
    /** The field's state attributes, which every part and the control's main element carry. */
    readonly data = computed(() =>
        dataValues(fieldStateAttributes(this.state())),
    );

    // whether the value changed once, or a submission was attempted (the required rule)
    private changed = false;
    private submitted = false;

    private run(
        element: HTMLInputElement | null,
        value: unknown,
        always: boolean,
    ): FieldValidation {
        return validateField(element, {
            value,
            validate: untracked(this.validate),
            valueChanged: this.changed,
            always,
        });
    }

    readonly events: FieldControlEvents = {
        mounted: (element, value, filled) => {
            this.filled.set(filled);
            this.run(element, value, false);
        },
        changed: (element, value, dirty, filled) => {
            this.changed = true;
            this.dirty.set(dirty);
            this.filled.set(filled);
            const onChange = validatesOnChange(
                untracked(this.validationMode),
                this.submitted,
            );
            const next = this.run(element, value, onChange);
            this.shown.update((before) =>
                shownAfterChange(before, next, onChange),
            );
        },
        focused: () => this.focused.set(true),
        blurred: (element, value) => {
            this.focused.set(false);
            this.touched.set(true);
            if (untracked(this.validationMode) === "onBlur") {
                this.shown.set(this.run(element, value, false));
            }
        },
        submitAttempt: (element, value) => {
            this.submitted = true;
            this.changed = true;
            this.shown.set(
                this.run(
                    element,
                    value,
                    validatesOnChange(untracked(this.validationMode), true),
                ),
            );
        },
    };

    /** The control registers its id; returns the cleanup. */
    registerControl(id: string, labelable: boolean): () => void {
        const entry = { id, labelable };
        this.control.set(entry);
        return () => {
            if (untracked(this.control) === entry) {
                this.control.set(null);
            }
        };
    }

    /** A description, or a shown error, listed in the control's `aria-describedby`. */
    registerMessage(element: HTMLElement): () => void {
        this.messages.update((list) => [
            ...list.filter((entry) => entry !== element),
            element,
        ]);
        return () =>
            this.messages.update((list) =>
                list.filter((entry) => entry !== element),
            );
    }
}
