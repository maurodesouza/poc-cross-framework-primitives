import type { JSX } from "@solidjs/web";
import { createSignal } from "solid-js";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { createPlacement } from "../../hooks/create-positioner.ts";
import { PopoverContext } from "./popover-context.ts";

export interface PopoverRootProps extends OverlayRootProps {
    children?: JSX.Element;
}

/** Holds the popover's state; renders no element (spec/popover.md). */
export function PopoverRoot(props: PopoverRootProps) {
    const root = createOverlayRoot(props);
    const [arrow, setArrow] = createSignal<HTMLElement | null>(null);
    const [placed, setPlaced] = createPlacement(() => ({
        side: "bottom",
        align: "center",
    }));
    const [titleId, setTitleId] = createSignal<string>();
    const [descriptionId, setDescriptionId] = createSignal<string>();
    const value = {
        ...root,
        arrow,
        setArrow: (element: HTMLElement | null) => setArrow(element),
        placed,
        setPlaced,
        titleId,
        setTitleId: (id: string | undefined) => setTitleId(id),
        descriptionId,
        setDescriptionId: (id: string | undefined) => setDescriptionId(id),
    };
    return <PopoverContext value={value}>{props.children}</PopoverContext>;
}
