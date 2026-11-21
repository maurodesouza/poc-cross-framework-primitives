import { createContext } from "solid-js";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";
import type { Placement } from "../../hooks/create-positioner.ts";

export interface PopoverContextValue extends OverlayRoot {
    arrow: () => HTMLElement | null;
    setArrow: (element: HTMLElement | null) => void;
    placed: () => Placement;
    setPlaced: (placed: Placement) => void;
    titleId: () => string | undefined;
    setTitleId: (id: string | undefined) => void;
    descriptionId: () => string | undefined;
    setDescriptionId: (id: string | undefined) => void;
}

export const PopoverContext = createContext<PopoverContextValue>();
