import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { ComboboxContext } from "./combobox-context.ts";

/**
 * A polite live region, always rendered; its children are shown only while the list is empty
 * (spec/combobox.md).
 */
export function ComboboxEmpty({
    children,
    ...props
}: PartProps<Record<string, never>>) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Empty");
    const empty = context.hasItems
        ? context.entries.length === 0
        : context.itemCount === 0;
    return renderElement(
        "div",
        { ...props, children: empty ? children : null },
        {},
        {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-combobox-part": "empty",
        },
    );
}
