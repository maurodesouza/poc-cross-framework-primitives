import type { JSX } from "@solidjs/web";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext } from "./select-context.ts";

export interface SelectValueProps extends PartProps<{ placeholder: boolean }> {
    /** Shown while nothing is selected. */
    placeholder?: JSX.Element;
}

/** The selected item's label, or the placeholder (spec/select.md). */
export function SelectValue(props: SelectValueProps) {
    const context = useContext(SelectContext);
    const label = () =>
        context.items().find((item) => item.value === context.value())?.label;
    const state = () => ({ placeholder: label() === undefined });
    return renderPart(
        "span",
        props,
        state,
        () => ({
            "data-select-part": "value",
            ...stateAttributes(state()),
        }),
        {
            omit: ["placeholder"],
            children: () => props.children ?? label() ?? props.placeholder,
        },
    );
}
