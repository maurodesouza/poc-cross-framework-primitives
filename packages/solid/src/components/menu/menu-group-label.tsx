import { useContext } from "solid-js";
import { createLabelId } from "../../hooks/create-label-id.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { MenuGroupContext } from "./menu-group.tsx";

/** Names its Group. */
export function MenuGroupLabel(props: PartProps<Record<string, never>>) {
    const register = useContext(MenuGroupContext);
    const id = createLabelId(props, register ?? undefined);
    return renderPart(
        "div",
        props,
        () => ({}),
        () => ({
            id: id(),
            "data-menu-part": "group-label",
        }),
    );
}
