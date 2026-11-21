import { type PartProps, renderPart } from "../../utils/part.tsx";

/** Between groups; no role of its own (a `listbox` owns only groups and options). */
export function ComboboxSeparator(props: PartProps<Record<string, never>>) {
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            role: "presentation",
            "data-orientation": "horizontal",
            "data-combobox-part": "separator",
        }),
    );
}
