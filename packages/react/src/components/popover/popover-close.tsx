import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { PopoverContext } from "./popover-context.ts";

export function PopoverClose(props: PartProps<Record<string, never>>) {
    const context = useRequiredContext(PopoverContext, "Popover.Close");
    return renderElement(
        "button",
        props,
        {},
        {
            type: "button",
            "data-popover-part": "close",
            onClick: () => context.setOpen(false, "close-press"),
        },
    );
}
