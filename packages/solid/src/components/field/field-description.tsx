import { type FieldState, fieldStateAttributes } from "@poc/dom";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { useFieldContext } from "./field-context.ts";

export interface FieldDescriptionProps extends PartProps<FieldState> {
    id?: string;
}

/** Describes the field's control: listed in its `aria-describedby` (spec/field.md). */
export function FieldDescription(props: FieldDescriptionProps) {
    const field = useFieldContext("Field.Description");
    const generated = createUniqueId();
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    createEffect(element, (node) =>
        node === null ? undefined : field.registerMessage(node),
    );
    return renderPart(
        "p",
        props,
        field.state,
        () => ({
            id: props.id ?? generated,
            "data-field-part": "description",
            ...stateAttributes(fieldStateAttributes(field.state())),
        }),
        { ref: (node) => setElement(node) },
    );
}
