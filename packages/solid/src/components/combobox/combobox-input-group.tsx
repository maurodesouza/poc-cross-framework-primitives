import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, pressToOpen } from "./combobox-context.ts";

/** Holds the Input and its buttons; anchors the list (spec/combobox.md). */
export function ComboboxInputGroup(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useContext(ComboboxContext);
    const state = () => ({
        open: context.open(),
        disabled: context.disabled(),
    });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "group",
            "data-combobox-part": "input-group",
            ...stateAttributes(state()),
            onMouseDown: (event: MouseEvent) => pressToOpen(context, event),
        }),
        { ref: context.setInputGroup },
    );
}
