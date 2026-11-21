import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { TooltipContext } from "./tooltip-context.ts";

export interface TooltipPortalProps {
    children?: ReactNode;
    container?: Element | null;
}

export function TooltipPortal({ children, container }: TooltipPortalProps) {
    const context = useRequiredContext(TooltipContext, "Tooltip.Portal");
    if (!context.presence.mounted || typeof document === "undefined") {
        return null;
    }
    return createPortal(children, container ?? document.body);
}
