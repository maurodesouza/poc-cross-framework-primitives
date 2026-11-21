import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { PopoverContext } from "./popover-context.ts";

export function PopoverClose(props: PartProps<Record<string, never>>) {
    const context = useContext(PopoverContext);
    return renderPart(
        "button",
        props,
        () => ({}),
        () => ({
            type: "button",
            "data-popover-part": "close",
            onClick: () => context.setOpen(false, "close-press"),
        }),
    );
}
