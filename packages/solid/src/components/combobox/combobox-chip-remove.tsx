import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipContext,
    ComboboxContext,
    chipElements,
} from "./combobox-context.ts";

/** Removes its chip's value and returns focus to the input. */
export function ComboboxChipRemove(props: PartProps<{ disabled: boolean }>) {
    const context = useContext(ComboboxContext);
    const chip = useContext(ComboboxChipContext);
    const state = () => ({ disabled: context.disabled() });
    return renderPart("button", props, state, () => ({
        type: "button",
        tabindex: -1,
        disabled: context.disabled(),
        "data-combobox-part": "chip-remove",
        ...stateAttributes(state()),
        onPointerDown: (event: PointerEvent) => event.preventDefault(),
        onClick: () => {
            const element = chip.element();
            const index =
                element === null ? -1 : chipElements(context).indexOf(element);
            if (index >= 0) {
                context.removeAt(index, "chip-remove-press");
            }
            context.trigger()?.focus();
        },
    }));
}
