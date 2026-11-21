import type { Align, DelayGroup, Side } from "@poc/dom";
import type { InjectionKey, Ref, ShallowRef } from "vue";
import type { OverlayRoot } from "../../composables/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

/** A Provider's delays and its delay group (spec/tooltip.md, "Delay group"). */
export interface TooltipProviderContext {
    delay: () => number;
    closeDelay: () => number;
    group: DelayGroup;
}

export const TooltipProviderKey: InjectionKey<TooltipProviderContext> =
    Symbol("TooltipProvider");

export interface TooltipContext extends OverlayRoot {
    /** Opens now; `instant` when no delay ran (focus, the group's hand-off). */
    show: (reason: ChangeReason, instant: boolean) => void;
    hide: (reason: ChangeReason) => void;
    /** The trigger's hover: starts the delay (or opens at once in a hand-off). */
    hoverStart: () => void;
    hoverEnd: () => void;
    /** A press on the trigger closes and blocks reopening until the pointer leaves. */
    press: () => void;
    instant: Ref<boolean>;
    disabled: () => boolean;
    arrow: ShallowRef<HTMLElement | null>;
    placed: Ref<{ side: Side; align: Align }>;
}

export const TooltipKey: InjectionKey<TooltipContext> = Symbol("Tooltip");
