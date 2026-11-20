import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { PopoverContext } from "./popover-context.ts";

export interface PopoverPortalProps {
    children?: ReactNode;
    container?: Element | null;
}

export function PopoverPortal({ children, container }: PopoverPortalProps) {
    const context = useRequiredContext(PopoverContext, "Popover.Portal");
    if (!context.presence.mounted || typeof document === "undefined") {
        return null;
    }
    return createPortal(children, container ?? document.body);
}
