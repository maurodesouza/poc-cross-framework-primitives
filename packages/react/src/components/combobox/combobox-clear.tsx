import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

/** Clears the text and the value; rendered only while there is a value (spec/combobox.md). */
export function ComboboxClear(props: PartProps<{ disabled: boolean }>) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Clear");
    const { disabled } = context;
    if (context.values.length === 0) {
        return null;
    }
    return renderElement(
        "button",
        props,
        { disabled },
        {
            type: "button",
            tabIndex: -1,
            disabled,
            "data-combobox-part": "clear",
            ...stateAttributes({ disabled }),
            onPointerDown: (event: PointerEvent) => event.preventDefault(),
            onClick: () => {
                context.clear("clear-press");
                context.trigger?.focus();
            },
        },
        context.setClearButton,
    );
}
