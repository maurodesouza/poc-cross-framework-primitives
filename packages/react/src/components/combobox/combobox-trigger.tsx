import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

/** Toggles the list; not in the tab order, keeps focus in the input. */
export function ComboboxTrigger(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Trigger");
    const { open, disabled } = context;
    return renderElement(
        "button",
        props,
        { open, disabled },
        {
            type: "button",
            tabIndex: -1,
            disabled,
            "aria-expanded": open,
            "aria-controls": context.listId,
            "data-combobox-part": "trigger",
            ...stateAttributes({ open, disabled }),
            onPointerDown: (event: PointerEvent) => event.preventDefault(),
            onClick: () => {
                context.pendingHighlight.current = null;
                context.setOpen(!open, "trigger-press");
                context.trigger?.focus();
            },
        },
        context.setButton,
    );
}
