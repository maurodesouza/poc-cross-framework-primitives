import { type FieldState, fieldStateAttributes } from "@poc/dom";
import { useId, useLayoutEffect } from "react";
import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.ts";

export interface FieldDescriptionProps extends PartProps<FieldState> {
    id?: string;
}

/** Describes the field's control: listed in its `aria-describedby` (spec/field.md). */
export function FieldDescription({
    id: idProp,
    ...props
}: FieldDescriptionProps) {
    const field = useRequiredContext(FieldContext, "Field.Description");
    const generated = useId();
    const [element, ref] = useElement<HTMLElement>();
    const { registerMessage } = field;
    useLayoutEffect(
        () => (element === null ? undefined : registerMessage(element)),
        [element, registerMessage],
    );
    return renderElement(
        "p",
        props,
        field.state,
        {
            id: idProp ?? generated,
            "data-field-part": "description",
            ...stateAttributes(fieldStateAttributes(field.state)),
        },
        ref,
    );
}
