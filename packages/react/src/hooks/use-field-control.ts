import { fieldStateAttributes, onSubmitAttempt } from "@poc/dom";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { FieldContext } from "../components/field/field-context.ts";
import { stateAttributes } from "../utils/state-attributes.ts";

export interface UseFieldControlOptions {
    /** The control's labelable element's id (or its main element's). */
    id: string | undefined;
    /** Whether `<label for>` can point at it (a native input or a `button`). */
    labelable: boolean;
    /** The control's value, given to `validate`. */
    value: unknown;
    filled: boolean;
    /** The element the form validates (the input, or the hidden input). */
    input: () => HTMLInputElement | null;
}

export interface FieldControlBinding {
    /** Inside a `Field.Root`. */
    inField: boolean;
    name: string | undefined;
    disabled: boolean;
    /** `aria-labelledby`, `aria-describedby`, `aria-invalid`, for the labelled element. */
    aria: Record<string, string | undefined>;
    /** The field's state attributes, for the control's main element. */
    attributes: Record<`data-${string}`, string>;
    onFocus: () => void;
    onBlur: () => void;
}

const OUTSIDE: FieldControlBinding = {
    inField: false,
    name: undefined,
    disabled: false,
    aria: {},
    attributes: {},
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
export function useFieldControl(
    options: UseFieldControlOptions,
): FieldControlBinding {
    const field = useContext(FieldContext);
    const latest = useRef(options);
    latest.current = options;
    const initial = useRef<string | null>(null);
    const previous = useRef<string | null>(null);

    const { id, labelable } = options;
    const registerControl = field?.registerControl;
    useLayoutEffect(
        () =>
            registerControl === undefined || id === undefined
                ? undefined
                : registerControl(id, labelable),
        [registerControl, id, labelable],
    );

    const events = field?.events;
    const serialized = serialize(options.value);
    useEffect(() => {
        if (events === undefined) {
            return;
        }
        const { input, value, filled } = latest.current;
        if (initial.current === null) {
            initial.current = serialized;
            previous.current = serialized;
            events.mounted(input(), value, filled);
            return;
        }
        if (previous.current === serialized) {
            return;
        }
        previous.current = serialized;
        events.changed(input(), value, serialized !== initial.current, filled);
    }, [events, serialized]);

    useEffect(() => {
        const form = latest.current.input()?.form;
        if (events === undefined || form === null || form === undefined) {
            return undefined;
        }
        return onSubmitAttempt(form, () => {
            const { input, value } = latest.current;
            events.submitAttempt(input(), value);
        });
    }, [events]);

    if (field === null || events === undefined) {
        return OUTSIDE;
    }
    return {
        inField: true,
        name: field.name,
        disabled: field.disabled,
        aria: {
            "aria-labelledby": field.labelId,
            "aria-describedby": field.describedBy,
            "aria-invalid": field.invalid ? "true" : undefined,
        },
        attributes: stateAttributes(fieldStateAttributes(field.state)),
        onFocus: events.focused,
        onBlur: () => {
            const { input, value } = latest.current;
            events.blurred(input(), value);
        },
    };
}
