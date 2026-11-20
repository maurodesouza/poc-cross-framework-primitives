import { nextFrame, waitForAnimations } from "@poc/dom";
import { type Ref, ref, watch } from "vue";

export type TransitionStatus = "starting" | "ending" | undefined;

/**
 * Keeps an element mounted while its exit animation runs (spec/dialog.md, "Animation"):
 * `data-starting-style` for the first frame after mounting, `data-ending-style` until every
 * animation on the element has finished.
 */
export function usePresence(
    open: Ref<boolean>,
    element: () => HTMLElement | null,
) {
    const mounted = ref(open.value);
    const status = ref<TransitionStatus>(open.value ? "starting" : undefined);
    watch(
        open,
        (isOpen) => {
            if (isOpen) {
                mounted.value = true;
                status.value = "starting";
            } else if (mounted.value) {
                status.value = "ending";
            }
        },
        { flush: "sync" },
    );
    watch(
        status,
        (current, _, onCleanup) => {
            const node = element();
            if (current === "starting" && node) {
                onCleanup(nextFrame(node, () => (status.value = undefined)));
            } else if (current === "ending") {
                let cancelled = false;
                onCleanup(() => {
                    cancelled = true;
                });
                const finish = () => {
                    if (!cancelled) {
                        mounted.value = false;
                        status.value = undefined;
                    }
                };
                if (node) {
                    void waitForAnimations(node).then(finish);
                } else {
                    finish();
                }
            }
        },
        { flush: "post" },
    );
    return { mounted, status };
}
