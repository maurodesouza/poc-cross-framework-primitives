import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { ComboboxContext } from "./combobox-context.ts";

export interface ComboboxPortalProps {
    children?: ReactNode;
    container?: Element | null;
}

export function ComboboxPortal({ children, container }: ComboboxPortalProps) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Portal");
    if (!context.presence.mounted || typeof document === "undefined") {
        return null;
    }
    return createPortal(children, container ?? document.body);
}
