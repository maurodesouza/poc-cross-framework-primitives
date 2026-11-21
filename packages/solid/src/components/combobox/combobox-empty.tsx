import { Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { ComboboxContext } from "./combobox-context.ts";

/**
 * A polite live region, always rendered; its children are shown only while the list is empty
 * (spec/combobox.md).
 */
export function ComboboxEmpty(props: PartProps<Record<string, never>>) {
    const context = useContext(ComboboxContext);
    const empty = () =>
        context.hasItems()
            ? context.entries().length === 0
            : context.itemCount() === 0;
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-combobox-part": "empty",
        }),
        { children: () => <Show when={empty()}>{props.children}</Show> },
    );
}
