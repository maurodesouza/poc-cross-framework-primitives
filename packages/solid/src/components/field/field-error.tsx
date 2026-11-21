import {
    type FieldErrorMatch,
    type FieldState,
    fieldErrorShown,
    fieldStateAttributes,
} from "@poc/dom";
import {
    createEffect,
    createSignal,
    createUniqueId,
    For,
    Show,
} from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { type FieldContextValue, useFieldContext } from "./field-context.ts";

export interface FieldErrorProps extends PartProps<FieldState> {
    /** A `ValidityState` key (`"customError"` for `validate`'s messages), or `true` for always. */
    match?: FieldErrorMatch;
    id?: string;
}

/**
 * An error message, rendered only while shown: its children, or the field's messages (one as
 * text, several as a list) (spec/field.md).
 */
export function FieldError(props: FieldErrorProps) {
    const field = useFieldContext("Field.Error");
    const generated = createUniqueId();
    const shown = () =>
        fieldErrorShown(props.match, field.shown(), {
            invalid: field.invalid(),
            disabled: field.disabled(),
        });
    return (
        <Show when={shown()}>
            {(_shown) => (
                <ErrorElement
                    field={field}
                    consumer={props}
                    id={props.id ?? generated}
                />
            )}
        </Show>
    );
}

/** The shown error: its own owner, so it leaves the control's `aria-describedby` when hidden. */
function ErrorElement(props: {
    field: FieldContextValue;
    consumer: FieldErrorProps;
    id: string;
}) {
    const { field, consumer } = props;
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    createEffect(element, (node) =>
        node === null ? undefined : field.registerMessage(node),
    );
    const errors = () => field.shown().errors;
    return renderPart(
        "div",
        consumer,
        field.state,
        () => ({
            id: props.id,
            "data-field-part": "error",
            ...stateAttributes(fieldStateAttributes(field.state())),
        }),
        {
            ref: (node) => setElement(node),
            omit: ["match"],
            children: () =>
                consumer.children ??
                (errors().length > 1 ? (
                    <ul>
                        <For each={errors()}>
                            {(message) => <li>{message}</li>}
                        </For>
                    </ul>
                ) : (
                    errors()[0]
                )),
        },
    );
}
