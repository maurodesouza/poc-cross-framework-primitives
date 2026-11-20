import { type PartProps, renderElement } from "../../utils/render-element.tsx";

/** What the consumer shows when no item matches (it renders it only then). */
export function ComboboxEmpty(props: PartProps<Record<string, never>>) {
    return renderElement("div", props, {}, { "data-combobox-part": "empty" });
}
