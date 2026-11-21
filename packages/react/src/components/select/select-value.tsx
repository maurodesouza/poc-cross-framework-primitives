import type { ReactNode } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext } from "./select-context.ts";

export interface SelectValueProps extends PartProps<{ placeholder: boolean }> {
    /** Shown while nothing is selected. */
    placeholder?: ReactNode;
}

/** The selected item's label, or the placeholder (spec/select.md). */
export function SelectValue({ placeholder, ...props }: SelectValueProps) {
    const context = useRequiredContext(SelectContext, "Select.Value");
    const label = context.items.find(
        (item) => item.value === context.value,
    )?.label;
    const isPlaceholder = label === undefined;
    return renderElement(
        "span",
        { children: isPlaceholder ? placeholder : label, ...props },
        { placeholder: isPlaceholder },
        {
            "data-select-part": "value",
            ...stateAttributes({ placeholder: isPlaceholder }),
        },
    );
}
