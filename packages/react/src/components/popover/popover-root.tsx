import type { Align, Side } from "@poc/dom";
import { type ReactNode, useMemo, useState } from "react";
import {
    type OverlayRootProps,
    useOverlayRoot,
} from "../../hooks/use-overlay-root.ts";
import { PopoverContext } from "./popover-context.ts";

export interface PopoverRootProps extends OverlayRootProps {
    children?: ReactNode;
}

/** Holds the popover's state; renders no element (spec/popover.md). */
export function PopoverRoot({ children, ...props }: PopoverRootProps) {
    const root = useOverlayRoot(props);
    const [arrow, setArrow] = useState<HTMLElement | null>(null);
    const [placed, setPlaced] = useState<{ side: Side; align: Align }>({
        side: "bottom",
        align: "center",
    });
    const [titleId, setTitleId] = useState<string>();
    const [descriptionId, setDescriptionId] = useState<string>();
    const value = useMemo(
        () => ({
            ...root,
            arrow,
            setArrow,
            placed,
            setPlaced,
            titleId,
            setTitleId,
            descriptionId,
            setDescriptionId,
        }),
        [root, arrow, placed, titleId, descriptionId],
    );
    return (
        <PopoverContext.Provider value={value}>
            {children}
        </PopoverContext.Provider>
    );
}
