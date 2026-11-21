import { nextFrame, waitForAnimations } from "@poc/dom";
import { untrack } from "svelte";

/**
 * Keeps an element mounted while its exit animation runs (spec/dialog.md, "Animation"). Created
 * during a component's initialization (it registers effects).
 */
export class Presence {
    mounted = $state(false);
    status = $state<"starting" | "ending" | undefined>(undefined);

    constructor(open: () => boolean, element: () => HTMLElement | null) {
        this.mounted = untrack(open);
        this.status = this.mounted ? "starting" : undefined;
        $effect.pre(() => {
            const isOpen = open();
            untrack(() => {
                if (isOpen) {
                    this.mounted = true;
                    this.status = "starting";
                } else if (this.mounted) {
                    this.status = "ending";
                }
            });
        });
        $effect(() => {
            const status = this.status;
            const node = element();
            if (status === "starting" && node) {
                return nextFrame(node, () => {
                    this.status = undefined;
                });
            }
            if (status === "ending") {
                let cancelled = false;
                const finish = () => {
                    if (!cancelled) {
                        this.mounted = false;
                        this.status = undefined;
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
            }
            return undefined;
        });
    }
}
