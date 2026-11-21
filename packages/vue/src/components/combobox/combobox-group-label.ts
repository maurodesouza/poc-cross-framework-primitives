import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { ComboboxGroupKey } from "./combobox-context.ts";

/** Names its Group. */
export const ComboboxGroupLabel = defineComponent({
    name: "ComboboxGroupLabel",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const group = useRequiredContext(
            ComboboxGroupKey,
            "Combobox.GroupLabel",
        );
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                { id: group.labelId, "data-combobox-part": "group-label" },
            );
    },
});
