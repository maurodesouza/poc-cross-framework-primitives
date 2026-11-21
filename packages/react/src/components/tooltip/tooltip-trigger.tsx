import type { FocusEvent, PointerEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.ts";

function isFocusVisible(element: Element): boolean {
    try {
        return element.matches(":focus-visible");
    } catch {
        return true;
    }
}

/** The described control and the anchor (spec/tooltip.md). */
export function TooltipTrigger(props: PartProps<{ open: boolean }>) {
    const context = useRequiredContext(TooltipContext, "Tooltip.Trigger");
    const { open, popupId } = context;
    const { "aria-describedby": describedBy, ...rest } = props;
    const description =
        [describedBy, open ? popupId : undefined].filter(Boolean).join(" ") ||
        undefined;
    return renderElement(
        "button",
        rest,
        { open },
        {
            type: "button",
            id: context.triggerId,
            "aria-describedby": description,
            "data-tooltip-part": "trigger",
            ...stateAttributes({ open }),
            onPointerEnter: (event: PointerEvent) => {
                // a tap never opens a tooltip
                if (event.pointerType !== "touch") {
                    context.hoverStart();
                }
            },
            onPointerLeave: (event: PointerEvent) => {
                if (event.pointerType !== "touch") {
                    context.hoverEnd();
                }
            },
            onPointerDown: () => context.press(),
            onFocus: (event: FocusEvent) => {
                if (!context.disabled && isFocusVisible(event.currentTarget)) {
                    context.show("trigger-focus", true);
                }
            },
            onBlur: () => {
                if (open) {
                    context.hide("trigger-focus");
                }
            },
        },
        context.setTrigger,
    );
}
