import { useId, useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { PopoverContext } from "./popover-context.ts";

export function PopoverTitle(props: PartProps<Record<string, never>>) {
    const context = useRequiredContext(PopoverContext, "Popover.Title");
    const generated = useId();
    const id = (props.id as string | undefined) ?? generated;
    const { setTitleId } = context;
    useLayoutEffect(() => {
        setTitleId(id);
        return () => setTitleId(undefined);
    }, [id, setTitleId]);
    return renderElement("h2", props, {}, { id, "data-popover-part": "title" });
}
