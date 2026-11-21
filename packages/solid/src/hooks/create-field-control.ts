import { fieldStateAttributes, onSubmitAttempt } from "@poc/dom";
import { createEffect, untrack, useContext } from "solid-js";
import { FieldContext } from "../components/field/field-context.ts";
import { stateAttributes } from "../utils/state-attributes.ts";

export interface FieldControlOptions {
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

export interface FieldControlBinding {
    /** Inside a `Field.Root`. */
    inField: boolean;
    name: () => string | undefined;
    disabled: () => boolean;
    /** `aria-labelledby`, `aria-describedby`, `aria-invalid`, for the labelled element. */
    aria: () => Record<string, string | undefined>;
    /** The field's state attributes, for the control's main element. */
    attributes: () => Record<`data-${string}`, string>;
    onFocus: () => void;
    onBlur: () => void;
}

const OUTSIDE: FieldControlBinding = {
    inField: false,
    name: () => undefined,
    disabled: () => false,
    aria: () => ({}),
    attributes: () => ({}),
    onFocus: () => {},
    onBlur: () => {},
};

function serialize(value: unknown): string {
    return JSON.stringify(value) ?? "undefined";
}

/**
 * A control's side of the integration contract (spec/field.md): registers its id, reports its
 * value, focus and blur, and the form's submission attempts, and returns what it renders. Outside
 * a `Field.Root`, it does nothing and returns nothing.
 */
export function createFieldControl(
    options: FieldControlOptions,
): FieldControlBinding {
    const field = useContext(FieldContext);
    if (field === null) {
        return OUTSIDE;
    }
    const { events } = field;
    const current = () => untrack(options.value);

    createEffect(options.id, (id) =>
        id === undefined
            ? undefined
            : field.registerControl(id, options.labelable),
    );

    // the first run is the mount; every later one a change of the value
    let initial: string | null = null;
    let previous: string | null = null;
    createEffect(
        () => serialize(options.value()),
        (serialized) => {
            const input = untrack(options.input);
            const filled = untrack(options.filled);
            if (initial === null) {
                initial = serialized;
                previous = serialized;
                events.mounted(input, current(), filled);
                return;
            }
            if (previous === serialized) {
                return;
            }
            previous = serialized;
            events.changed(input, current(), serialized !== initial, filled);
        },
    );

    createEffect(options.input, (input) => {
        const form = input?.form;
        if (form === null || form === undefined) {
            return undefined;
        }
        return onSubmitAttempt(form, () =>
            events.submitAttempt(untrack(options.input), current()),
        );
    });

    return {
        inField: true,
        name: field.name,
        disabled: field.disabled,
        aria: () => ({
            "aria-labelledby": field.labelId(),
            "aria-describedby": field.describedBy(),
            "aria-invalid": field.invalid() ? "true" : undefined,
        }),
        attributes: () => stateAttributes(fieldStateAttributes(field.state())),
        onFocus: events.focused,
        onBlur: () => events.blurred(untrack(options.input), current()),
    };
}
