import { fieldStateAttributes } from "@poc/dom";
import { defineComponent, useId, watch } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldKey } from "./field-context.ts";

/** Names the field's control: `for` a labelable control, `aria-labelledby` on any (spec/field.md). */
export const FieldLabel = defineComponent({
    name: "FieldLabel",
    inheritAttrs: false,
    props: {
        ...asProp,
        id: { type: String, default: undefined },
    },
    setup(props, { attrs, slots }) {
        const field = useRequiredContext(FieldKey, "Field.Label");
        const generated = useId();
        const id = () => props.id ?? generated;
        watch(
            id,
            (current, _, onCleanup) => {
                field.labelId.value = current;
                onCleanup(() => {
                    if (field.labelId.value === current) {
                        field.labelId.value = undefined;
                    }
                });
            },
            { immediate: true },
        );
        return () => {
            const state = field.state.value;
            const control = field.control.value;
            return renderPart("label", { attrs, slots }, props.as, state, {
                id: id(),
                for: control?.labelable ? control.id : undefined,
                "data-field-part": "label",
                ...stateAttributes(fieldStateAttributes(state)),
            });
        };
    },
});
