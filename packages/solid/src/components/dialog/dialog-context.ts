import { createContext } from "solid-js";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";

export interface DialogContextValue extends OverlayRoot {
    backdrop: () => HTMLElement | null;
    setBackdrop: (element: HTMLElement | null) => void;
    titleId: () => string | undefined;
    setTitleId: (id: string | undefined) => void;
    descriptionId: () => string | undefined;
    setDescriptionId: (id: string | undefined) => void;
}

export const DialogContext = createContext<DialogContextValue>();
