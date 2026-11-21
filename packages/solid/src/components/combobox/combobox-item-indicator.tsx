import { Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { ComboboxItemContext } from "./combobox-context.ts";

export interface ComboboxItemIndicatorProps
    extends PartProps<{ selected: boolean }> {
    /** Rendered while the item is not selected too. */
    keepMounted?: boolean;
}

/** Marks a selected item; hidden from assistive technologies (spec/combobox.md). */
export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps) {
    const item = useContext(ComboboxItemContext);
    const state = () => ({ selected: item().selected });
    return (
        <Show when={item().selected || props.keepMounted}>
            {renderPart(
                "span",
                props,
                state,
                () => ({
                    "aria-hidden": "true",
                    "data-combobox-part": "item-indicator",
                }),
                { omit: ["keepMounted"] },
            )}
        </Show>
    );
}
