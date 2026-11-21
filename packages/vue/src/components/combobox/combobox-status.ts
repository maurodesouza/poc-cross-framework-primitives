import { defineComponent } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";

/** A polite live region for the consumer's text (spec/combobox.md). */
export const ComboboxStatus = defineComponent({
    name: "ComboboxStatus",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                {
                    role: "status",
                    "aria-live": "polite",
                    "aria-atomic": "true",
                    "data-combobox-part": "status",
                },
            );
    },
});
