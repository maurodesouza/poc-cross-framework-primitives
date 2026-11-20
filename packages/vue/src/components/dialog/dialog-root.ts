import { defineComponent, provide, ref, shallowRef } from "vue";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import { DialogKey } from "./dialog-context.ts";

/** Holds the dialog's state (`v-model:open`); renders no element (spec/dialog.md). */
export const DialogRoot = defineComponent({
    name: "DialogRoot",
    props: overlayRootProps,
    emits: overlayRootEmits,
    setup(props, { emit, slots }) {
        const root = useOverlayRoot(props, emit);
        provide(DialogKey, {
            ...root,
            backdrop: shallowRef(null),
            titleId: ref(),
            descriptionId: ref(),
        });
        return () => slots.default?.();
    },
});
