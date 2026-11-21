import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { ComboboxKey, isEmpty } from "./combobox-context.ts";

/**
 * A polite live region, always rendered; its children are shown only while the list is empty
 * (spec/combobox.md).
 */
export const ComboboxEmpty = defineComponent({
    name: "ComboboxEmpty",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Empty");
        return () => {
            const empty = isEmpty(context);
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                {
                    role: "status",
                    "aria-live": "polite",
                    "aria-atomic": "true",
                    "data-combobox-part": "empty",
                },
                () => (empty ? slots.default?.({ state: {} }) : []),
            );
        };
    },
});
