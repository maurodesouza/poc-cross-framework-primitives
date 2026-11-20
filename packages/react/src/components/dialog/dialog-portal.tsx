import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogPortalProps {
    children?: ReactNode;
    /** Where the content goes (default: `document.body`). */
    container?: Element | null;
}

/** Moves the backdrop and the popup to the end of `body` while the dialog is open or closing. */
export function DialogPortal({ children, container }: DialogPortalProps) {
    const context = useRequiredContext(DialogContext, "Dialog.Portal");
    if (!context.presence.mounted || typeof document === "undefined") {
        return null;
    }
    return createPortal(children, container ?? document.body);
}
