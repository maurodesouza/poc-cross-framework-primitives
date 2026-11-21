import { type Align, anchorFloating, type Side } from "@poc/dom";
import { createEffect, createSignal } from "solid-js";

export interface PositionerProps {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    /** The element to anchor to (default: the trigger). */
    anchor?: Element | null;
}

export const POSITIONER_KEYS = [
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "anchor",
] as const;

export interface Placement {
    side: Side;
    align: Align;
}

/** Where an overlay is placed; setting an equal placement changes nothing. */
export function createPlacement(
    initial: () => Placement,
): [() => Placement, (next: Placement) => void] {
    const [placed, setPlaced] = createSignal<Placement>(() => initial());
    return [
        placed,
        (next) =>
            setPlaced((previous) =>
                previous.side === next.side && previous.align === next.align
                    ? previous
                    : next,
            ),
    ];
}

/**
 * Positions an overlay's positioner next to its anchor while both exist (spec/popover.md,
 * "Positioning"), from its props with the given defaults; reports where it ended up, to itself and
 * to its root (`onPlaced`).
 */
export function createPositioner(
    props: PositionerProps,
    defaults: Placement,
    elements: {
        anchor: () => Element | null;
        positioner: () => HTMLElement | null;
        arrow?: () => HTMLElement | null;
    },
    onPlaced: (placed: Placement) => void,
): () => Placement {
    const [placed, setPlaced] = createPlacement(() => ({
        side: props.side ?? defaults.side,
        align: props.align ?? defaults.align,
    }));
    createEffect(
        () => ({
            anchor: props.anchor ?? elements.anchor(),
            floating: elements.positioner(),
            arrow: elements.arrow?.() ?? null,
            side: props.side ?? defaults.side,
            align: props.align ?? defaults.align,
            sideOffset: props.sideOffset ?? 0,
            alignOffset: props.alignOffset ?? 0,
            collisionPadding: props.collisionPadding ?? 8,
        }),
        ({ anchor, floating, ...options }) => {
            if (anchor === null || floating === null) {
                return undefined;
            }
            return anchorFloating(anchor, floating, {
                ...options,
                onPlaced: (next) => {
                    setPlaced(next);
                    onPlaced(next);
                },
            });
        },
    );
    return placed;
}
