import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { SelectContext } from "./select-context.ts";

export interface SelectPortalProps {
    children?: ReactNode;
    container?: Element | null;
}

export function SelectPortal({ children, container }: SelectPortalProps) {
    const context = useRequiredContext(SelectContext, "Select.Portal");
    if (!context.presence.mounted || typeof document === "undefined") {
        return null;
    }
    return createPortal(children, container ?? document.body);
}
