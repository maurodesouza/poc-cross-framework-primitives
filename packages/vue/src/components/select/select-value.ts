import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectKey } from "./select-context.ts";

/** The selected item's label, or the placeholder (spec/select.md). */
export const SelectValue = defineComponent({
    name: "SelectValue",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** Shown while nothing is selected. */
        placeholder: { type: String, default: undefined },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SelectKey, "Select.Value");
        return () => {
            const label = context
                .items()
                .find((item) => item.value === context.value.value)?.label;
            const placeholder = label === undefined;
            return renderPart(
                "span",
                { attrs, slots },
                props.as,
                { placeholder },
                {
                    "data-select-part": "value",
                    ...stateAttributes({ placeholder }),
                },
                () =>
                    slots.default?.({ placeholder }) ??
                    (placeholder ? props.placeholder : label),
            );
        };
    },
});
