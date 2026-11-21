import {
    type FieldErrorMatch,
    type FieldState,
    fieldErrorShown,
    fieldStateAttributes,
} from "@poc/dom";
import { useId, useLayoutEffect } from "react";
import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.ts";

export interface FieldErrorProps extends PartProps<FieldState> {
    /** A `ValidityState` key (`"customError"` for `validate`'s messages), or `true` for always. */
    match?: FieldErrorMatch;
    id?: string;
}

/**
 * An error message, rendered only while shown: its children, or the field's messages (one as
 * text, several as a list) (spec/field.md).
 */
export function FieldError({
    match,
    id: idProp,
    children,
    ...props
}: FieldErrorProps) {
    const field = useRequiredContext(FieldContext, "Field.Error");
    const generated = useId();
    const [element, ref] = useElement<HTMLElement>();
    const shown = fieldErrorShown(match, field.shown, field);
    const { registerMessage } = field;
    useLayoutEffect(
        () =>
            element === null || !shown ? undefined : registerMessage(element),
        [element, shown, registerMessage],
    );
    if (!shown) {
        return null;
    }
    const errors = field.shown.errors;
    const content =
        children ??
        (errors.length > 1 ? (
            <ul>
                {errors.map((message) => (
                    <li key={message}>{message}</li>
                ))}
            </ul>
        ) : (
            errors[0]
        ));
    return renderElement(
        "div",
        { ...props, children: content },
        field.state,
        {
            id: idProp ?? generated,
            "data-field-part": "error",
            ...stateAttributes(fieldStateAttributes(field.state)),
        },
        ref,
    );
}
