import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { MenuContext } from "./menu-context.ts";

export interface MenuPortalProps {
    children?: ReactNode;
    container?: Element | null;
}

export function MenuPortal({ children, container }: MenuPortalProps) {
    const context = useRequiredContext(MenuContext, "Menu.Portal");
    if (!context.presence.mounted || typeof document === "undefined") {
        return null;
    }
    return createPortal(children, container ?? document.body);
}
