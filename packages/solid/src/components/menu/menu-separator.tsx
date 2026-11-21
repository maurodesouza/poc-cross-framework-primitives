import { type PartProps, renderPart } from "../../utils/part.tsx";

export function MenuSeparator(props: PartProps<Record<string, never>>) {
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            role: "separator",
            "aria-orientation": "horizontal",
            "data-menu-part": "separator",
        }),
    );
}
