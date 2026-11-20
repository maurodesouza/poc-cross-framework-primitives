/** Runs `callback` on the next animation frame of the element's window. Returns the cancel. */
export function nextFrame(element: Element, callback: () => void): () => void {
    const view = element.ownerDocument.defaultView;
    if (view === null) {
        callback();
        return () => {};
    }
    const id = view.requestAnimationFrame(() => callback());
    return () => view.cancelAnimationFrame(id);
}

/**
 * Resolves when every animation and transition running on the element has finished, or at once
 * when there is none (spec/dialog.md, "Animation": unmount after the exit animation).
 */
export async function waitForAnimations(element: Element): Promise<void> {
    const animations =
        typeof element.getAnimations === "function"
            ? element.getAnimations()
            : [];
    await Promise.allSettled(animations.map((animation) => animation.finished));
}
