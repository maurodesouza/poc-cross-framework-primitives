import { type Align, anchorFloating, type Side } from "@poc/dom";

export interface PositionerOptions {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    anchor?: Element | null;
}

/**
 * Positions an overlay's positioner next to its anchor while both exist, and reports where it
 * went through `onPlaced`. Registers an effect: call it during a component's initialization.
 */
export function usePositioner(
    options: () => PositionerOptions,
    defaults: { side: Side; align: Align },
    anchor: () => HTMLElement | null,
    floating: () => HTMLElement | null,
    arrow: () => HTMLElement | null,
    onPlaced: (placed: { side: Side; align: Align }) => void,
): void {
    $effect(() => {
        const props = options();
        const anchorElement = props.anchor ?? anchor();
        const floatingElement = floating();
        if (!anchorElement || !floatingElement) {
            return undefined;
        }
        let last: { side: Side; align: Align } | null = null;
        return anchorFloating(anchorElement, floatingElement, {
            side: props.side ?? defaults.side,
            align: props.align ?? defaults.align,
            sideOffset: props.sideOffset ?? 0,
            alignOffset: props.alignOffset ?? 0,
            collisionPadding: props.collisionPadding ?? 8,
            arrow: arrow(),
            onPlaced: (placed) => {
                if (
                    last?.side !== placed.side ||
                    last?.align !== placed.align
                ) {
                    last = placed;
                    onPlaced(placed);
                }
            },
        });
    });
}
