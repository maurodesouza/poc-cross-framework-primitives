import { type PartProps, renderElement } from "../../utils/render-element.tsx";

/** Between groups; no role of its own (a `listbox` owns only groups and options). */
export function ComboboxSeparator(props: PartProps<Record<string, never>>) {
    return renderElement(
        "div",
        props,
        {},
        {
            role: "presentation",
            "data-orientation": "horizontal",
            "data-combobox-part": "separator",
        },
    );
}
