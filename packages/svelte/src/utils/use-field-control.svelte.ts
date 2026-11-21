import { fieldStateAttributes, onSubmitAttempt } from "@poc/dom";
import { untrack } from "svelte";
import { FieldContext } from "../components/field/field-context.svelte.ts";
import { stateAttributes } from "./state-attributes.ts";

export interface UseFieldControlOptions {
    /** The control's labelable element's id (or its main element's). */
    id: () => string | undefined;
    /** Whether `<label for>` can point at it (a native input or a `button`). */
    labelable: boolean;
    /** The control's value, given to `validate`. */
    value: () => unknown;
    filled: () => boolean;
    /** The element the form validates (the input, or the hidden input). */
    input: () => HTMLInputElement | null;
}

/** What a control renders for its field; every member reads the field's current state. */
export interface FieldControlBinding {
    /** Inside a `Field.Root`. */
    readonly inField: boolean;
    readonly name: string | undefined;
    readonly disabled: boolean;
    /** `aria-labelledby`, `aria-describedby`, `aria-invalid`, for the labelled element. */
    readonly aria: Record<string, string | undefined>;
    /** The field's state attributes, for the control's main element. */
    readonly attributes: Record<string, string>;
    readonly onfocus: () => void;
    readonly onblur: () => void;
}

export const OUTSIDE_FIELD: FieldControlBinding = {
    inField: false,
    name: undefined,
    disabled: false,
    aria: {},
    attributes: {},
    onfocus: () => {},
    onblur: () => {},
};

function serialize(value: unknown): string {
    return JSON.stringify(value) ?? "undefined";
}

/**
 * A control's side of the integration contract (spec/field.md): registers its id, reports its
 * value, focus and blur, and the form's submission attempts, and returns what it renders. Outside
 * a `Field.Root`, it does nothing and returns nothing. Call it while the component initializes.
 */
export function useFieldControl(
    options: UseFieldControlOptions,
): FieldControlBinding {
    const field = FieldContext.maybe();
    if (field === undefined) {
        return OUTSIDE_FIELD;
    }

    $effect(() => {
        const id = options.id();
        if (id === undefined) {
            return undefined;
        }
        return untrack(() => field.registerControl(id, options.labelable));
    });

    let initial: string | null = null;
    let previous: string | null = null;
    $effect(() => {
        const serialized = serialize(options.value());
        untrack(() => {
            const input = options.input();
            const value = options.value();
            const filled = options.filled();
            if (initial === null) {
                initial = serialized;
                previous = serialized;
                field.mounted(input, value, filled);
                return;
            }
            if (previous === serialized) {
                return;
            }
            previous = serialized;
            field.changed(input, value, serialized !== initial, filled);
        });
    });

    $effect(() => {
        const form = options.input()?.form;
        if (form === null || form === undefined) {
            return undefined;
        }
        return onSubmitAttempt(form, () =>
            field.submitAttempt(options.input(), options.value()),
        );
    });

    return {
        inField: true,
        get name() {
            return field.name;
        },
        get disabled() {
            return field.disabled;
        },
        get aria() {
            return {
                "aria-labelledby": field.labelId,
                "aria-describedby": field.describedBy,
                "aria-invalid": field.invalid ? "true" : undefined,
            };
        },
        get attributes() {
            return stateAttributes(fieldStateAttributes(field.state));
        },
        onfocus: () => field.focus(),
        onblur: () => field.blur(options.input(), options.value()),
    };
}
