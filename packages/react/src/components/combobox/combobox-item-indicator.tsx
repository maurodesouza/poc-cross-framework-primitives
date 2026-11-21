import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { ComboboxItemContext } from "./combobox-context.ts";

export interface ComboboxItemIndicatorProps
    extends PartProps<{ selected: boolean }> {
    /** Rendered while the item is not selected too. */
    keepMounted?: boolean;
}

/** Marks a selected item; hidden from assistive technologies (spec/combobox.md). */
export function ComboboxItemIndicator({
    keepMounted = false,
    ...props
}: ComboboxItemIndicatorProps) {
    const item = useRequiredContext(
        ComboboxItemContext,
        "Combobox.ItemIndicator",
    );
    if (!item.selected && !keepMounted) {
        return null;
    }
    return renderElement(
        "span",
        props,
        { selected: item.selected },
        {
            "aria-hidden": "true",
            "data-combobox-part": "item-indicator",
        },
    );
}
