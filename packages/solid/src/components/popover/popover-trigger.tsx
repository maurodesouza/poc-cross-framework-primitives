import { getTabbables } from "@poc/dom";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
export function PopoverTrigger(props: PopoverTriggerProps) {
    const context = useContext(PopoverContext);
    const state = () => ({
        open: context.open(),
        disabled: props.disabled ?? false,
    });
    return renderPart(
        "button",
        props,
        state,
        () => ({
            type: "button",
            id: context.triggerId,
            disabled: state().disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": String(context.open()),
            "aria-controls": context.open() ? context.popupId : undefined,
            "data-popover-part": "trigger",
            ...stateAttributes(state()),
            onClick: () => context.setOpen(!context.open(), "trigger-press"),
            onKeyDown: (event: KeyboardEvent) => {
                const popup = context.popup();
                if (
                    event.key === "Tab" &&
                    !event.shiftKey &&
                    context.open() &&
                    popup
                ) {
                    event.preventDefault();
                    (getTabbables(popup)[0] ?? popup).focus();
                }
            },
        }),
        { ref: context.setTrigger, omit: ["disabled"] },
    );
}
