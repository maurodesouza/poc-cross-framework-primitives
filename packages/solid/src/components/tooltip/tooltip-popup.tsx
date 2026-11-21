import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
    const context = useContext(TooltipContext);
    const state = () => ({
        open: context.open(),
        instant: context.instant(),
        ...context.placed(),
    });
    return renderPart(
        "div",
        props,
        state,
        () => {
            const current = state();
            const status = context.presence.status();
            return {
                id: context.popupId,
                role: "tooltip",
                "data-tooltip-part": "popup",
                ...stateAttributes({
                    open: current.open,
                    side: current.side,
                    align: current.align,
                    instant: current.instant,
                    "starting-style": status === "starting",
                    "ending-style": status === "ending",
                }),
            };
        },
        { ref: context.setPopup },
    );
}
