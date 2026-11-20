import { useId, useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { PopoverContext } from "./popover-context.ts";

export function PopoverDescription(props: PartProps<Record<string, never>>) {
    const context = useRequiredContext(PopoverContext, "Popover.Description");
    const generated = useId();
    const id = (props.id as string | undefined) ?? generated;
    const { setDescriptionId } = context;
    useLayoutEffect(() => {
        setDescriptionId(id);
        return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);
    return renderElement(
        "p",
        props,
        {},
        { id, "data-popover-part": "description" },
    );
}
