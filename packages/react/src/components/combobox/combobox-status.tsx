import { type PartProps, renderElement } from "../../utils/render-element.tsx";

/** A polite live region for the consumer's text (spec/combobox.md). */
export function ComboboxStatus(props: PartProps<Record<string, never>>) {
    return renderElement(
        "div",
        props,
        {},
        {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-combobox-part": "status",
        },
    );
}
