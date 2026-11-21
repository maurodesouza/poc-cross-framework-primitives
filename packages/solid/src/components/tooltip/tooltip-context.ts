import type { DelayGroup } from "@poc/dom";
import { createContext } from "solid-js";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";
import type { Placement } from "../../hooks/create-positioner.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

/** A Provider's delays and its delay group (spec/tooltip.md, "Delay group"). */
export interface TooltipProviderValue {
    delay: () => number;
    closeDelay: () => number;
    group: () => DelayGroup;
}

export const TooltipProviderContext =
    createContext<TooltipProviderValue | null>(null);

export interface TooltipContextValue extends OverlayRoot {
    /** Opens now; `instant` when no delay ran (focus, the group's hand-off). */
    show: (reason: ChangeReason, instant: boolean) => void;
    hide: (reason: ChangeReason) => void;
    /** The trigger's hover: starts the delay (or opens at once in a hand-off). */
    hoverStart: () => void;
    hoverEnd: () => void;
    /** A press on the trigger closes and blocks reopening until the pointer leaves. */
    press: () => void;
    instant: () => boolean;
    disabled: () => boolean;
    arrow: () => HTMLElement | null;
    setArrow: (element: HTMLElement | null) => void;
    placed: () => Placement;
    setPlaced: (placed: Placement) => void;
}

export const TooltipContext = createContext<TooltipContextValue>();
