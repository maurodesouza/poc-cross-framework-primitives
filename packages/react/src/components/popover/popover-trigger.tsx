import { getTabbables } from "@poc/dom";
import type { KeyboardEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.ts";

export interface PopoverTriggerState {
    open: boolean;
    disabled: boolean;
}

export interface PopoverTriggerProps extends PartProps<PopoverTriggerState> {
    disabled?: boolean;
}

/** Toggles the popover and anchors it. While open, Tab from it enters the popup (spec/popover.md). */
export function PopoverTrigger({
    disabled = false,
    ...props
}: PopoverTriggerProps) {
    const context = useRequiredContext(PopoverContext, "Popover.Trigger");
    const state = { open: context.open, disabled };
    return renderElement(
        "button",
        props,
        state,
        {
            type: "button",
            id: context.triggerId,
            disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": context.open,
            "aria-controls": context.open ? context.popupId : undefined,
            "data-popover-part": "trigger",
            ...stateAttributes({ open: context.open, disabled }),
            onClick: () => context.setOpen(!context.open, "trigger-press"),
            onKeyDown: (event: KeyboardEvent) => {
                if (
                    event.key === "Tab" &&
                    !event.shiftKey &&
                    context.open &&
                    context.popup
                ) {
                    event.preventDefault();
                    (getTabbables(context.popup)[0] ?? context.popup).focus();
                }
            },
        },
        context.setTrigger,
    );
}
