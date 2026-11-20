const locks = new WeakMap<Document, { count: number; restore: () => void }>();

/**
 * Stops the page from scrolling while an overlay is open (spec/dialog.md), keeping the scrollbar's
 * gutter so the layout does not shift. Nested locks are counted. Returns the unlock.
 */
export function lockScroll(doc: Document): () => void {
    const existing = locks.get(doc);
    if (existing !== undefined) {
        existing.count += 1;
    } else {
        const root = doc.documentElement;
        const previous = {
            overflow: root.style.overflow,
            gutter: root.style.scrollbarGutter,
        };
        const hasScrollbar = root.scrollHeight > root.clientHeight;
        root.style.overflow = "hidden";
        if (hasScrollbar) {
            root.style.scrollbarGutter = "stable";
        }
        locks.set(doc, {
            count: 1,
            restore: () => {
                root.style.overflow = previous.overflow;
                root.style.scrollbarGutter = previous.gutter;
            },
        });
    }
    let released = false;
    return () => {
        if (released) {
            return;
        }
        released = true;
        const lock = locks.get(doc);
        if (lock === undefined) {
            return;
        }
        lock.count -= 1;
        if (lock.count === 0) {
            lock.restore();
            locks.delete(doc);
        }
    };
}
