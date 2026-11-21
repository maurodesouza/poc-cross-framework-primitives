import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { SelectItemKey } from "./select-context.ts";

/** Marks the selected item; hidden from assistive technologies (spec/select.md). */
export const SelectItemIndicator = defineComponent({
    name: "SelectItemIndicator",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** Rendered while the item is not selected too. */
        keepMounted: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
        const item = useRequiredContext(SelectItemKey, "Select.ItemIndicator");
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
                    "data-select-part": "item-indicator",
                },
            );
        };
    },
});
