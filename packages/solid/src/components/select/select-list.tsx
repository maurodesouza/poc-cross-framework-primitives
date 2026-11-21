import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { SelectContext } from "./select-context.ts";

/** The `listbox`, named by the trigger's labels (spec/select.md). */
export function SelectList(props: PartProps<{ open: boolean }>) {
    const context = useContext(SelectContext);
    const state = () => ({ open: context.open() });
    return renderPart("div", props, state, () => ({
        role: "listbox",
        id: context.listId,
        "aria-labelledby": context.trigger()?.id,
        "data-select-part": "list",
    }));
}
