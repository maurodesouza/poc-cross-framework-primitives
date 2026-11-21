import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { SelectContext } from "./select-context.ts";

/** The `listbox`, named by the trigger's labels (spec/select.md). */
export function SelectList(props: PartProps<{ open: boolean }>) {
    const context = useRequiredContext(SelectContext, "Select.List");
    return renderElement(
        "div",
        props,
        { open: context.open },
        {
            role: "listbox",
            id: context.listId,
            "aria-labelledby": context.trigger?.id,
            "data-select-part": "list",
        },
    );
}
