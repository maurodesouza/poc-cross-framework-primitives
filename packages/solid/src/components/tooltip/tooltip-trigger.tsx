import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
    const context = useContext(TooltipContext);
    const state = () => ({ open: context.open() });
    return renderPart(
        "button",
        props,
        state,
        () => {
            const open = context.open();
            const describedBy = props["aria-describedby"] as string | undefined;
            return {
                type: "button",
                id: context.triggerId,
                "aria-describedby":
                    [describedBy, open ? context.popupId : undefined]
                        .filter(Boolean)
                        .join(" ") || undefined,
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
                    if (
                        !context.disabled() &&
                        isFocusVisible(event.currentTarget as Element)
                    ) {
                        context.show("trigger-focus", true);
                    }
                },
                onBlur: () => {
                    if (context.open()) {
                        context.hide("trigger-focus");
                    }
                },
            };
        },
        { ref: context.setTrigger, omit: ["aria-describedby"] },
    );
}
