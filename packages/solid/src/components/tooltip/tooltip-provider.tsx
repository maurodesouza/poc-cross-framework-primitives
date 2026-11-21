import { createDelayGroup } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createMemo } from "solid-js";
import { TooltipProviderContext } from "./tooltip-context.ts";

export interface TooltipProviderProps {
    /** ms before a hovered trigger opens its tooltip. */
    delay?: number;
    /** ms before a tooltip closes once the pointer left. */
    closeDelay?: number;
    /** ms after a close during which another tooltip of the group opens at once. */
    timeout?: number;
    children?: JSX.Element;
}

/** A delay group: shared delays and the instant hand-off (spec/tooltip.md). */
export function TooltipProvider(props: TooltipProviderProps) {
    const group = createMemo(() =>
        createDelayGroup({ timeout: props.timeout ?? 400 }),
    );
    const value = {
        delay: () => props.delay ?? 600,
        closeDelay: () => props.closeDelay ?? 0,
        group,
    };
    return (
        <TooltipProviderContext value={value}>
            {props.children}
        </TooltipProviderContext>
    );
}
