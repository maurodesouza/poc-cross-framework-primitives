import type { MouseEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { ComboboxContext, pressToOpen } from "./combobox-context.ts";

/** `multiple`: holds the chips and the Input; a `toolbar` while it holds a chip. */
export function ComboboxChips(props: PartProps<Record<string, never>>) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Chips");
    return renderElement(
        "div",
        props,
        {},
        {
            role: context.values.length > 0 ? "toolbar" : undefined,
            "data-combobox-part": "chips",
            onMouseDown: (event: MouseEvent) => pressToOpen(context, event),
        },
        context.setChips,
    );
}
