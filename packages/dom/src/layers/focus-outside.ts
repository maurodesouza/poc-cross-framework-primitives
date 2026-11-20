/**
 * Calls `onFocusOutside` when focus moves to an element outside every element of `elements()`
 * (spec/popover.md: a non-modal overlay closes when focus leaves it). Returns the cleanup.
 */
export function watchFocusOutside(
    doc: Document,
    elements: () => readonly (Element | null | undefined)[],
    onFocusOutside: (event: FocusEvent) => void,
): () => void {
    const onFocusIn = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) {
            return;
        }
        if (!elements().some((element) => element?.contains(target) === true)) {
            onFocusOutside(event);
        }
    };
    doc.addEventListener("focusin", onFocusIn);
    return () => doc.removeEventListener("focusin", onFocusIn);
}
