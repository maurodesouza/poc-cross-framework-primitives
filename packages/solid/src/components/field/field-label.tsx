import { type FieldState, fieldStateAttributes } from "@poc/dom";
import { createLabelId } from "../../hooks/create-label-id.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { useFieldContext } from "./field-context.ts";

export interface FieldLabelProps extends PartProps<FieldState> {
    id?: string;
}

/** Names the field's control: `for` a labelable control, `aria-labelledby` on any (spec/field.md). */
export function FieldLabel(props: FieldLabelProps) {
    const field = useFieldContext("Field.Label");
    const id = createLabelId(props, field.setLabelId);
    return renderPart("label", props, field.state, () => {
        const control = field.control();
        return {
            id: id(),
            for: control?.labelable ? control.id : undefined,
            "data-field-part": "label",
            ...stateAttributes(fieldStateAttributes(field.state())),
        };
    });
}
