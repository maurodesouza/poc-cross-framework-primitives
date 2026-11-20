import { useContext, useId, useLayoutEffect } from "react";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { MenuGroupContext } from "./menu-group.tsx";

/** Names its Group. */
export function MenuGroupLabel(props: PartProps<Record<string, never>>) {
    const register = useContext(MenuGroupContext);
    const generated = useId();
    const id = (props.id as string | undefined) ?? generated;
    useLayoutEffect(() => {
        register?.(id);
        return () => register?.(undefined);
    }, [id, register]);
    return renderElement(
        "div",
        props,
        {},
        { id, "data-menu-part": "group-label" },
    );
}
