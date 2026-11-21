import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.ts";

export interface TooltipPopupState {
    open: boolean;
    side: string;
    align: string;
    instant: boolean;
}

/** The `tooltip`; never takes focus (spec/tooltip.md). */
export function TooltipPopup(props: PartProps<TooltipPopupState>) {
    const context = useRequiredContext(TooltipContext, "Tooltip.Popup");
    const { open, instant, placed } = context;
    const status = context.presence.status;
    return renderElement(
        "div",
        props,
        { open, instant, ...placed },
        {
            id: context.popupId,
            role: "tooltip",
            "data-tooltip-part": "popup",
            ...stateAttributes({
                open,
                side: placed.side,
                align: placed.align,
                instant,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
        },
        context.setPopup,
    );
}
