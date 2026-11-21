export interface DragSessionOptions {
    /** Every move of the dragging pointer, captured: outside the element and the window too. */
    onMove: (event: PointerEvent) => void;
    /** The drag ended: pointer up, cancel or a lost capture (`null` when `end()` stopped it). */
    onEnd: (event: PointerEvent | null) => void;
}

/**
 * A pointer drag from `event` (a `pointerdown` on `element`), with pointer capture (spec/slider.md,
 * "Pointer"): `element` receives the pointer's moves until it is released. It holds no value;
 * the framework turns each move into its state. Returns the cleanup, which also ends the drag.
 */
export function startDrag(
    element: Element,
    event: PointerEvent,
    options: DragSessionOptions,
): () => void {
    const pointerId = event.pointerId;
    let ended = false;
    try {
        element.setPointerCapture(pointerId);
    } catch {
        // a synthetic event without an active pointer: the window listeners still follow it
    }
    const view = element.ownerDocument.defaultView ?? window;
    const onMove = (move: PointerEvent) => {
        if (move.pointerId === pointerId) {
            options.onMove(move);
        }
    };
    const finish = (last: PointerEvent | null) => {
        if (ended) {
            return;
        }
        ended = true;
        view.removeEventListener("pointermove", onMove);
        view.removeEventListener("pointerup", onUp);
        view.removeEventListener("pointercancel", onUp);
        element.removeEventListener("lostpointercapture", onLost);
        try {
            if (element.hasPointerCapture(pointerId)) {
                element.releasePointerCapture(pointerId);
            }
        } catch {
            // already released
        }
        options.onEnd(last);
    };
    const onUp = (up: PointerEvent) => {
        if (up.pointerId === pointerId) {
            finish(up);
        }
    };
    const onLost = (lost: Event) => finish(lost as PointerEvent);
    // the window hears the captured element's events as they bubble
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", onUp);
    view.addEventListener("pointercancel", onUp);
    element.addEventListener("lostpointercapture", onLost);
    return () => finish(null);
}
