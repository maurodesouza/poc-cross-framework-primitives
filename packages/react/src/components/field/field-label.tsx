import type { FieldState } from "@poc/dom";
import { fieldStateAttributes } from "@poc/dom";
import { useId, useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.ts";

export interface FieldLabelProps extends PartProps<FieldState> {
    id?: string;
}

/** Names the field's control: `for` a labelable control, `aria-labelledby` on any (spec/field.md). */
export function FieldLabel({ id: idProp, ...props }: FieldLabelProps) {
    const field = useRequiredContext(FieldContext, "Field.Label");
    const generated = useId();
    const id = idProp ?? generated;
    const { setLabelId } = field;
    useLayoutEffect(() => {
        setLabelId(id);
        return () => setLabelId(undefined);
    }, [id, setLabelId]);
    return renderElement("label", props, field.state, {
        id,
        htmlFor: field.control?.labelable ? field.control.id : undefined,
        "data-field-part": "label",
        ...stateAttributes(fieldStateAttributes(field.state)),
    });
}
