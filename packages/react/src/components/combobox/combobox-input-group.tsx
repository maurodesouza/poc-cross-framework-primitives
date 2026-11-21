import type { MouseEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, pressToOpen } from "./combobox-context.ts";

/** Holds the Input and its buttons; anchors the list (spec/combobox.md). */
export function ComboboxInputGroup(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useRequiredContext(ComboboxContext, "Combobox.InputGroup");
    const { open, disabled } = context;
    return renderElement(
        "div",
        props,
        { open, disabled },
        {
            role: "group",
            "data-combobox-part": "input-group",
            ...stateAttributes({ open, disabled }),
            onMouseDown: (event: MouseEvent) => pressToOpen(context, event),
        },
        context.setInputGroup,
    );
}
