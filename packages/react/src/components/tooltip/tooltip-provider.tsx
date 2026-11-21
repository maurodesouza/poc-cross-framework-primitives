import { createDelayGroup } from "@poc/dom";
import { type ReactNode, useMemo } from "react";
import { TooltipProviderContext } from "./tooltip-context.ts";

export interface TooltipProviderProps {
    /** ms before a hovered trigger opens its tooltip. */
    delay?: number;
    /** ms before a tooltip closes once the pointer left. */
    closeDelay?: number;
    /** ms after a close during which another tooltip of the group opens at once. */
    timeout?: number;
    children?: ReactNode;
}

/** A delay group: shared delays and the instant hand-off (spec/tooltip.md). */
export function TooltipProvider({
    delay = 600,
    closeDelay = 0,
    timeout = 400,
    children,
}: TooltipProviderProps) {
    const value = useMemo(
        () => ({ delay, closeDelay, group: createDelayGroup({ timeout }) }),
        [delay, closeDelay, timeout],
    );
    return (
        <TooltipProviderContext.Provider value={value}>
            {children}
        </TooltipProviderContext.Provider>
    );
}
