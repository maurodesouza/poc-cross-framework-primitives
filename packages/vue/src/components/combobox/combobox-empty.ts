import { defineComponent } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";

/** What the consumer shows when no item matches (it renders it only then). */
export const ComboboxEmpty = defineComponent({
    name: "ComboboxEmpty",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                { "data-combobox-part": "empty" },
            );
    },
});
