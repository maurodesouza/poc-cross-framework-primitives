import {
    afterNextRender,
    afterRenderEffect,
    computed,
    DestroyRef,
    effect,
    inject,
    type Signal,
    untracked,
} from "@angular/core";
import { onSubmitAttempt } from "@poc/dom";
import { injectField } from "../inject/inject-field.ts";

export interface FieldControlOptions {
    /** The control's labelable element's id (or its main element's), once it has one. */
    id: Signal<string | undefined>;
    /** Whether `<label for>` can point at it (a native input or a `button`). */
    labelable: boolean;
    /** The control's value, given to `validate`. */
    value: Signal<unknown>;
    filled: Signal<boolean>;
    /** The element the form validates (the input, or the hidden input). */
    input: () => HTMLInputElement | null;
}

/** The field's state attributes for a control's main element, `null` outside a field. */
export interface FieldControlData {
    invalid: string | null;
    valid: string | null;
    dirty: string | null;
    touched: string | null;
    filled: string | null;
    focused: string | null;
    disabled: string | null;
}

export interface FieldControlBinding {
    /** Inside a `[fieldRoot]`. */
    inField: boolean;
    name: Signal<string | undefined>;
    disabled: Signal<boolean>;
    /** `aria-labelledby`, `aria-describedby`, `aria-invalid`, for the labelled element. */
    labelledBy: Signal<string | null>;
    describedBy: Signal<string | null>;
    ariaInvalid: Signal<"true" | null>;
    data: Signal<FieldControlData>;
    focused: () => void;
    blurred: () => void;
}

const NONE = computed(() => null);
const OUTSIDE: FieldControlBinding = {
    inField: false,
    name: computed(() => undefined),
    disabled: computed(() => false),
    labelledBy: NONE,
    describedBy: NONE,
    ariaInvalid: NONE,
    data: computed(() => ({
        invalid: null,
        valid: null,
        dirty: null,
        touched: null,
        filled: null,
        focused: null,
        disabled: null,
    })),
    focused: () => {},
    blurred: () => {},
};

function serialize(value: unknown): string {
    return JSON.stringify(value) ?? "undefined";
}

/**
 * A control's side of the integration contract (spec/field.md), in its directive's injection
 * context: registers its id, reports its value (after the render, so the validated element holds
 * it), its focus and blur, and the form's submission attempts, and returns what it renders.
 * Outside a `[fieldRoot]`, it does nothing and returns nothing.
 */
export function fieldControl(
    options: FieldControlOptions,
): FieldControlBinding {
    const field = injectField();
    if (field === null) {
        return OUTSIDE;
    }
    const { events } = field;

    effect((onCleanup) => {
        const id = options.id();
        if (id !== undefined && id !== "") {
            onCleanup(
                untracked(() => field.registerControl(id, options.labelable)),
            );
        }
    });

    let initial: string | null = null;
    let previous: string | null = null;
    afterRenderEffect(() => {
        const value = options.value();
        const filled = options.filled();
        const serialized = serialize(value);
        untracked(() => {
            if (initial === null) {
                initial = serialized;
                previous = serialized;
                events.mounted(options.input(), value, filled);
                return;
            }
            if (previous === serialized) {
                return;
            }
            previous = serialized;
            events.changed(
                options.input(),
                value,
                serialized !== initial,
                filled,
            );
        });
    });

    let stop: (() => void) | null = null;
    afterNextRender(() => {
        const form = options.input()?.form;
        if (form === null || form === undefined) {
            return;
        }
        stop = onSubmitAttempt(form, () =>
            events.submitAttempt(options.input(), untracked(options.value)),
        );
    });
    inject(DestroyRef).onDestroy(() => stop?.());

    return {
        inField: true,
        name: field.name,
        disabled: field.disabled,
        labelledBy: computed(() => field.labelId() ?? null),
        describedBy: computed(() => field.describedBy() ?? null),
        ariaInvalid: computed(() => (field.showsInvalid() ? "true" : null)),
        data: field.data,
        focused: events.focused,
        blurred: () =>
            events.blurred(options.input(), untracked(options.value)),
    };
}
