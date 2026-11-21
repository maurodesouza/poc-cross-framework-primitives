import { defineComponent } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";

/** Between groups; no role of its own (a `listbox` owns only groups and options). */
export const ComboboxSeparator = defineComponent({
    name: "ComboboxSeparator",
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
                    role: "presentation",
                    "data-orientation": "horizontal",
                    "data-combobox-part": "separator",
                },
            );
    },
});
