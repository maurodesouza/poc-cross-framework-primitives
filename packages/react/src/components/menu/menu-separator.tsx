import { type PartProps, renderElement } from "../../utils/render-element.tsx";

export function MenuSeparator(props: PartProps<Record<string, never>>) {
    return renderElement(
        "div",
        props,
        {},
        {
            role: "separator",
            "aria-orientation": "horizontal",
            "data-menu-part": "separator",
        },
    );
}
