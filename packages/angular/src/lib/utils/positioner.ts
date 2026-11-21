import {
    afterRenderEffect,
    type Signal,
    signal,
    untracked,
    type WritableSignal,
} from "@angular/core";
import { type Align, anchorFloating, type Side } from "@poc/dom";

/** The positioning inputs every Positioner directive declares (spec/popover.md, "Positioning"). */
export interface PositionerInputs {
    side: Signal<Side | undefined>;
    align: Signal<Align | undefined>;
    sideOffset: Signal<number | undefined>;
    alignOffset: Signal<number | undefined>;
    collisionPadding: Signal<number | undefined>;
    /** The element to anchor to (default: the trigger). */
    anchor: Signal<Element | null | undefined>;
}

export interface Placement {
    side: Side;
    align: Align;
}

/** Where an overlay is placed; setting an equal placement changes nothing. */
export function placementSignal(initial: Placement): WritableSignal<Placement> {
    return signal(initial, {
        equal: (a, b) => a.side === b.side && a.align === b.align,
    });
}

/**
 * Positions an overlay's positioner next to its anchor while both exist, from its inputs with the
 * given defaults, after each render; reports where it ended up in `placed` (the root's).
 */
export function positionOverlay(
    inputs: PositionerInputs,
    defaults: Placement,
    elements: {
        anchor: Signal<Element | null>;
        positioner: HTMLElement;
        arrow?: Signal<HTMLElement | null>;
    },
    placed: WritableSignal<Placement>,
): void {
    afterRenderEffect((onCleanup) => {
        const anchor = inputs.anchor() ?? elements.anchor();
        const options = {
            side: inputs.side() ?? defaults.side,
            align: inputs.align() ?? defaults.align,
            sideOffset: inputs.sideOffset() ?? 0,
            alignOffset: inputs.alignOffset() ?? 0,
            collisionPadding: inputs.collisionPadding() ?? 8,
            arrow: elements.arrow?.() ?? null,
        };
        if (anchor === null) {
            return;
        }
        untracked(() => {
            onCleanup(
                anchorFloating(anchor, elements.positioner, {
                    ...options,
                    onPlaced: (next) => placed.set(next),
                }),
            );
        });
    });
}
