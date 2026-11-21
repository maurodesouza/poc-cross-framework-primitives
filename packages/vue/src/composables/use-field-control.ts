import { fieldStateAttributes, onSubmitAttempt } from "@poc/dom";
import { inject, onBeforeUnmount, onMounted, watch } from "vue";
import { FieldKey } from "../components/field/field-context.ts";
import { stateAttributes } from "../utils/state-attributes.ts";

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

/** What a control renders inside a field; each getter is read at render time. */
export interface FieldControlBinding {
    /** Inside a `Field.Root`. */
    inField: boolean;
    name: () => string | undefined;
    disabled: () => boolean;
    /** `aria-labelledby`, `aria-describedby`, `aria-invalid`, for the labelled element. */
    aria: () => Record<string, string | undefined>;
    /** The field's state attributes, for the control's main element. */
    attributes: () => Record<string, string>;
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
export function useFieldControl(
    options: UseFieldControlOptions,
): FieldControlBinding {
    const field = inject(FieldKey, null);
    if (field === null) {
        return OUTSIDE;
    }
    const { events } = field;

    watch(
        options.id,
        (id, _, onCleanup) => {
            if (id !== undefined) {
                onCleanup(field.registerControl(id, options.labelable));
            }
        },
        { immediate: true },
    );

    let stop: (() => void)[] = [];
    // from the mount on: the control's own state may be defined after this call
    onMounted(() => {
        const initial = serialize(options.value());
        let previous = initial;
        events.mounted(options.input(), options.value(), options.filled());
        const form = options.input()?.form;
        if (form !== null && form !== undefined) {
            stop.push(
                onSubmitAttempt(form, () =>
                    events.submitAttempt(options.input(), options.value()),
                ),
            );
        }
        // after the render: the validated element holds the new value
        stop.push(
            watch(
                () => serialize(options.value()),
                (serialized) => {
                    if (previous === serialized) {
                        return;
                    }
                    previous = serialized;
                    events.changed(
                        options.input(),
                        options.value(),
                        serialized !== initial,
                        options.filled(),
                    );
                },
                { flush: "post" },
            ),
        );
    });
    onBeforeUnmount(() => {
        for (const cleanup of stop) {
            cleanup();
        }
        stop = [];
    });

    return {
        inField: true,
        name: field.name,
        disabled: field.disabled,
        aria: () => ({
            "aria-labelledby": field.labelId.value,
            "aria-describedby": field.describedBy.value,
            "aria-invalid": field.invalid.value ? "true" : undefined,
        }),
        attributes: () =>
            stateAttributes(fieldStateAttributes(field.state.value)),
        onFocus: events.focused,
        onBlur: () => events.blurred(options.input(), options.value()),
    };
}
