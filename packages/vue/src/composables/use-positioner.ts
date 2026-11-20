import { type Align, anchorFloating, type Side } from "@poc/dom";
import { type Ref, ref, watch } from "vue";

export interface PositionerProps {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    /** The element to anchor to (default: the trigger). */
    anchor?: Element | null;
}

export const positionerProps = {
    side: { type: String as () => Side, default: undefined },
    align: { type: String as () => Align, default: undefined },
    sideOffset: { type: Number, default: 0 },
    alignOffset: { type: Number, default: 0 },
    collisionPadding: { type: Number, default: 8 },
    anchor: { type: Object as () => Element | null, default: undefined },
};

/** Positions an overlay's positioner next to its anchor while both exist; reports where it went. */
export function usePositioner(
    props: PositionerProps,
    defaults: { side: Side; align: Align },
    anchor: Ref<HTMLElement | null>,
    positioner: Ref<HTMLElement | null>,
    arrow: Ref<HTMLElement | null> | null,
) {
    const placed = ref<{ side: Side; align: Align }>({
        side: props.side ?? defaults.side,
        align: props.align ?? defaults.align,
    });
    watch(
        () =>
            [
                props.anchor ?? anchor.value,
                positioner.value,
                arrow?.value ?? null,
                props.side ?? defaults.side,
                props.align ?? defaults.align,
                props.sideOffset ?? 0,
                props.alignOffset ?? 0,
                props.collisionPadding ?? 8,
            ] as const,
        (
            [
                anchorElement,
                floating,
                arrowElement,
                side,
                align,
                sideOffset,
                alignOffset,
                collisionPadding,
            ],
            _,
            onCleanup,
        ) => {
            if (!anchorElement || !floating) {
                return;
            }
            onCleanup(
                anchorFloating(anchorElement, floating, {
                    side,
                    align,
                    sideOffset,
                    alignOffset,
                    collisionPadding,
                    arrow: arrowElement,
                    onPlaced: (next) => {
                        if (
                            placed.value.side !== next.side ||
                            placed.value.align !== next.align
                        ) {
                            placed.value = next;
                        }
                    },
                }),
            );
        },
        { flush: "post", immediate: true },
    );
    return placed;
}
