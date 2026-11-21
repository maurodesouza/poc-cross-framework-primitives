import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { ComboboxContext, pressToOpen } from "./combobox-context.ts";

/** `multiple`: holds the chips and the Input; a `toolbar` while it holds a chip. */
export function ComboboxChips(props: PartProps<Record<string, never>>) {
    const context = useContext(ComboboxContext);
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            role: context.values().length > 0 ? "toolbar" : undefined,
            "data-combobox-part": "chips",
            onMouseDown: (event: MouseEvent) => pressToOpen(context, event),
        }),
        { ref: context.setChips },
    );
}
