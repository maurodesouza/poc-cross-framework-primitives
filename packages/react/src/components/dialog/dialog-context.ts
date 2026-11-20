import { createContext } from "react";
import type { OverlayRoot } from "../../hooks/use-overlay-root.ts";

export interface DialogContextValue extends OverlayRoot {
    backdrop: HTMLElement | null;
    setBackdrop: (element: HTMLElement | null) => void;
    titleId: string | undefined;
    setTitleId: (id: string | undefined) => void;
    descriptionId: string | undefined;
    setDescriptionId: (id: string | undefined) => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);
