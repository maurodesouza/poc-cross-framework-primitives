import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { ComboboxItemKey } from "./combobox-context.ts";

/** Marks a selected item; hidden from assistive technologies (spec/combobox.md). */
export const ComboboxItemIndicator = defineComponent({
    name: "ComboboxItemIndicator",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** Rendered while the item is not selected too. */
        keepMounted: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
        const item = useRequiredContext(
            ComboboxItemKey,
            "Combobox.ItemIndicator",
        );
        return () => {
            const selected = item.value.selected;
            if (!selected && !props.keepMounted) {
                return null;
            }
            return renderPart(
                "span",
                { attrs, slots },
                props.as,
                { selected },
                {
                    "aria-hidden": "true",
                    "data-combobox-part": "item-indicator",
                },
            );
        };
    },
});
