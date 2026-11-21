import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { SelectItemContext } from "./select-context.ts";

export interface SelectItemIndicatorProps
    extends PartProps<{ selected: boolean }> {
    /** Rendered while the item is not selected too. */
    keepMounted?: boolean;
}

/** Marks the selected item; hidden from assistive technologies (spec/select.md). */
export function SelectItemIndicator({
    keepMounted = false,
    ...props
}: SelectItemIndicatorProps) {
    const item = useRequiredContext(SelectItemContext, "Select.ItemIndicator");
    if (!item.selected && !keepMounted) {
        return null;
    }
    return renderElement(
        "span",
        props,
        { selected: item.selected },
        {
            "aria-hidden": "true",
            "data-select-part": "item-indicator",
        },
    );
}
