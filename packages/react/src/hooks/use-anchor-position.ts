import { type Align, anchorFloating, type Side } from "@poc/dom";
import { useLayoutEffect, useState } from "react";

export interface PositionOptions {
    side: Side;
    align: Align;
    sideOffset: number;
    alignOffset: number;
    collisionPadding: number;
}

/** Positions `floating` next to `anchor` while both exist, and reports where it ended up. */
export function useAnchorPosition(
    anchor: Element | null,
    floating: HTMLElement | null,
    arrow: HTMLElement | null,
    options: PositionOptions,
) {
    const [placed, setPlaced] = useState<{ side: Side; align: Align }>({
        side: options.side,
        align: options.align,
    });
    const { side, align, sideOffset, alignOffset, collisionPadding } = options;
    useLayoutEffect(() => {
        if (anchor === null || floating === null) {
            return undefined;
        }
        return anchorFloating(anchor, floating, {
            side,
            align,
            sideOffset,
            alignOffset,
            collisionPadding,
            arrow,
            onPlaced: (next) =>
                setPlaced((previous) =>
                    previous.side === next.side && previous.align === next.align
                        ? previous
                        : next,
                ),
        });
    }, [
        anchor,
        floating,
        arrow,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionPadding,
    ]);
    return placed;
}
