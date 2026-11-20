import type { Align, Side } from "@poc/dom";
import { defineComponent, provide, ref, shallowRef } from "vue";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import { PopoverKey } from "./popover-context.ts";

/** Holds the popover's state (`v-model:open`); renders no element (spec/popover.md). */
export const PopoverRoot = defineComponent({
    name: "PopoverRoot",
    props: overlayRootProps,
    emits: overlayRootEmits,
    setup(props, { emit, slots }) {
        const root = useOverlayRoot(props, emit);
        provide(PopoverKey, {
            ...root,
            arrow: shallowRef(null),
            placed: ref<{ side: Side; align: Align }>({
                side: "bottom",
                align: "center",
            }),
            titleId: ref(),
            descriptionId: ref(),
        });
        return () => slots.default?.();
    },
});
