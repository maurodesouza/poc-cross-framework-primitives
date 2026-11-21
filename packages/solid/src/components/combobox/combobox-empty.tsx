import { type PartProps, renderPart } from "../../utils/part.tsx";

/** What the consumer shows when no item matches (it renders it only then). */
export function ComboboxEmpty(props: PartProps<Record<string, never>>) {
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            "data-combobox-part": "empty",
        }),
    );
}
