import { createAttachmentKey } from "svelte/attachments";

/**
 * A stable attachment that reports a part's element (set on mount, `null` on removal). Spread on
 * the default element and handed to the `child` snippet with the other props, so a consumer's own
 * element is registered too. Created once per component: a new function would re-attach.
 */
export function elementRef(
    set: (element: HTMLElement | null) => void,
): Record<symbol, (node: HTMLElement) => () => void> {
    return {
        [createAttachmentKey()]: (node: HTMLElement) => {
            set(node);
            return () => set(null);
        },
    };
}
