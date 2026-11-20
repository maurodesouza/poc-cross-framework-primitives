import type { Align, Side } from "@poc/dom";
import { createContext } from "react";
import type { OverlayRoot } from "../../hooks/use-overlay-root.ts";

export interface PopoverContextValue extends OverlayRoot {
    arrow: HTMLElement | null;
    setArrow: (element: HTMLElement | null) => void;
    placed: { side: Side; align: Align };
    setPlaced: (placed: { side: Side; align: Align }) => void;
    titleId: string | undefined;
    setTitleId: (id: string | undefined) => void;
    descriptionId: string | undefined;
    setDescriptionId: (id: string | undefined) => void;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);
