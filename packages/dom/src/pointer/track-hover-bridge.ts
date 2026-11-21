import { isInHoverBridge } from "./hover-bridge.ts";

export interface HoverBridgeCallbacks {
    /** The pointer moved over the trigger, the popup or the gap between them. */
    inside: () => void;
    /** The pointer moved anywhere else. */
    outside: () => void;
}

/**
 * Follows the pointer while a hover-opened tooltip is open (spec/tooltip.md, "Pointer"): every
 * move of the document's pointer reports whether it is in the hover bridge of `trigger` and
 * `popup` (`isInHoverBridge`), or over the trigger alone while there is no popup yet. It holds no
 * state: the framework decides what a move means (cancel or start the close delay). Returns the
 * cleanup.
 */
export function trackHoverBridge(
    trigger: Element,
    popup: Element | null,
    callbacks: HoverBridgeCallbacks,
): () => void {
    const doc = trigger.ownerDocument;
    const onMove = (event: PointerEvent) => {
        const point = { x: event.clientX, y: event.clientY };
        const inside =
            popup !== null
                ? isInHoverBridge(point, trigger, popup)
                : event.target instanceof Node &&
                  trigger.contains(event.target);
        if (inside) {
            callbacks.inside();
        } else {
            callbacks.outside();
        }
    };
    doc.addEventListener("pointermove", onMove);
    return () => doc.removeEventListener("pointermove", onMove);
}
