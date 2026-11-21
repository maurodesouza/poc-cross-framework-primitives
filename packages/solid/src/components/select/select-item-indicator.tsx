import { Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { SelectItemContext } from "./select-context.ts";

export interface SelectItemIndicatorProps
    extends PartProps<{ selected: boolean }> {
    /** Rendered while the item is not selected too. */
    keepMounted?: boolean;
}

/** Marks the selected item; hidden from assistive technologies (spec/select.md). */
export function SelectItemIndicator(props: SelectItemIndicatorProps) {
    const item = useContext(SelectItemContext);
    const state = () => ({ selected: item().selected });
    return (
        <Show when={item().selected || props.keepMounted}>
            {renderPart(
                "span",
                props,
                state,
                () => ({
                    "aria-hidden": "true",
                    "data-select-part": "item-indicator",
                }),
                { omit: ["keepMounted"] },
            )}
        </Show>
    );
}
