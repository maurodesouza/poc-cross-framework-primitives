import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipContext,
    ComboboxContext,
    chipElements,
} from "./combobox-context.ts";

/** Removes its chip's value and returns focus to the input. */
export function ComboboxChipRemove(props: PartProps<{ disabled: boolean }>) {
    const context = useRequiredContext(ComboboxContext, "Combobox.ChipRemove");
    const chip = useRequiredContext(ComboboxChipContext, "Combobox.ChipRemove");
    const { disabled } = context;
    return renderElement(
        "button",
        props,
        { disabled },
        {
            type: "button",
            tabIndex: -1,
            disabled,
            "data-combobox-part": "chip-remove",
            ...stateAttributes({ disabled }),
            onPointerDown: (event: PointerEvent) => event.preventDefault(),
            onClick: () => {
                const element = chip.element();
                const index =
                    element === null
                        ? -1
                        : chipElements(context).indexOf(element);
                if (index >= 0) {
                    context.removeAt(index, "chip-remove-press");
                }
                context.trigger?.focus();
            },
        },
    );
}
