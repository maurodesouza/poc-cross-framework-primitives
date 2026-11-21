import { type PartProps, renderPart } from "../../utils/part.tsx";

/** A polite live region for the consumer's text (spec/combobox.md). */
export function ComboboxStatus(props: PartProps<Record<string, never>>) {
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-combobox-part": "status",
        }),
    );
}
