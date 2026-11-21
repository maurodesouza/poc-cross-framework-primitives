import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

/** Toggles the list; not in the tab order, keeps focus in the input. */
export function ComboboxTrigger(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useContext(ComboboxContext);
    const state = () => ({
        open: context.open(),
        disabled: context.disabled(),
    });
    return renderPart(
        "button",
        props,
        state,
        () => ({
            type: "button",
            tabindex: -1,
            disabled: context.disabled(),
            "aria-expanded": String(context.open()),
            "aria-controls": context.listId,
            "data-combobox-part": "trigger",
            ...stateAttributes(state()),
            onPointerDown: (event: PointerEvent) => event.preventDefault(),
            onClick: () => {
                context.pendingHighlight.current = null;
                context.setOpen(!context.open(), "trigger-press");
                context.trigger()?.focus();
            },
        }),
        { ref: context.setButton },
    );
}
