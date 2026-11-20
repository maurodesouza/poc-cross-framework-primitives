import type { Align, Side } from "@poc/dom";
import { useAnchorPosition } from "./use-anchor-position.ts";

export interface PositionerProps {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    /** The element to anchor to (default: the trigger). */
    anchor?: Element | null;
}

/** Positions an overlay's positioner from its props, with the given defaults. */
export function usePositioner(
    props: PositionerProps,
    defaults: { side: Side; align: Align },
    anchor: Element | null,
    positioner: HTMLElement | null,
    arrow: HTMLElement | null,
) {
    return useAnchorPosition(props.anchor ?? anchor, positioner, arrow, {
        side: props.side ?? defaults.side,
        align: props.align ?? defaults.align,
        sideOffset: props.sideOffset ?? 0,
        alignOffset: props.alignOffset ?? 0,
        collisionPadding: props.collisionPadding ?? 8,
    });
}
