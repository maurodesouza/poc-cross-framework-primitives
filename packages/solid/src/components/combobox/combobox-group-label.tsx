import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { ComboboxGroupContext } from "./combobox-context.ts";

/** Names its Group. */
export function ComboboxGroupLabel(props: PartProps<Record<string, never>>) {
    const group = useContext(ComboboxGroupContext);
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({ id: group.labelId, "data-combobox-part": "group-label" }),
    );
}
