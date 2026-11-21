import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { ComboboxGroupContext } from "./combobox-context.ts";

/** Names its Group. */
export function ComboboxGroupLabel(props: PartProps<Record<string, never>>) {
    const group = useRequiredContext(
        ComboboxGroupContext,
        "Combobox.GroupLabel",
    );
    return renderElement(
        "div",
        props,
        {},
        { id: group.labelId, "data-combobox-part": "group-label" },
    );
}
