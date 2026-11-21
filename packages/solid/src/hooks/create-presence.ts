import { nextFrame, waitForAnimations } from "@poc/dom";
import { createEffect, createSignal } from "solid-js";

export type TransitionStatus = "starting" | "ending" | undefined;

export interface Presence {
    /** Whether the element is rendered: open, or closing while its exit animation runs. */
    mounted: () => boolean;
    status: () => TransitionStatus;
}

/**
 * Keeps an element mounted while its exit animation runs (spec/dialog.md, "Animation"):
 * `data-starting-style` for the first frame after mounting, `data-ending-style` until every
 * animation on the element has finished.
 */
export function createPresence(
    open: () => boolean,
    element: () => HTMLElement | null,
): Presence {
    // derived from `open` in the same pass, so the element's first render already carries
    // `data-starting-style` (an effect would set it after the browser styled the element, and
    // the enter transition would run backwards first); the effect below only clears it
    let shown = false;
    const [status, setStatus] = createSignal<TransitionStatus>(() => {
        if (open()) {
            shown = true;
            return "starting";
        }
        return shown ? "ending" : undefined;
    });
    createEffect(
        () => ({ current: status(), node: element() }),
        ({ current, node }) => {
            if (current === "starting" && node) {
                return nextFrame(node, () => setStatus(undefined));
            }
            if (current !== "ending") {
                return undefined;
            }
            let cancelled = false;
            const finish = () => {
                if (!cancelled) {
                    shown = false;
                    setStatus(undefined);
                }
            };
            if (node) {
                void waitForAnimations(node).then(finish);
            } else {
                finish();
            }
            return () => {
                cancelled = true;
            };
        },
    );
    return {
        mounted: () => open() || status() === "ending",
        status,
    };
}
