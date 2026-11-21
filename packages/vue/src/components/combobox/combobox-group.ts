import { defineComponent, provide, useId } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { ComboboxGroupKey } from "./combobox-context.ts";

/** A `group` of items, named by its GroupLabel (spec/combobox.md). */
export const ComboboxGroup = defineComponent({
    name: "ComboboxGroup",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const labelId = `${useId()}-label`;
        provide(ComboboxGroupKey, { labelId });
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                {
                    role: "group",
                    "aria-labelledby": labelId,
                    "data-combobox-part": "group",
                },
            );
    },
});
