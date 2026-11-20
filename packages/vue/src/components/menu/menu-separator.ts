import { defineComponent } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";

export const MenuSeparator = defineComponent({
    name: "MenuSeparator",
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
                    role: "separator",
                    "aria-orientation": "horizontal",
                    "data-menu-part": "separator",
                },
            );
    },
});
