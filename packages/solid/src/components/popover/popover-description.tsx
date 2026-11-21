import { useContext } from "solid-js";
import { createLabelId } from "../../hooks/create-label-id.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { PopoverContext } from "./popover-context.ts";

export function PopoverDescription(props: PartProps<Record<string, never>>) {
    const context = useContext(PopoverContext);
    const id = createLabelId(props, context.setDescriptionId);
    return renderPart(
        "p",
        props,
        () => ({}),
        () => ({
            id: id(),
            "data-popover-part": "description",
        }),
    );
}
