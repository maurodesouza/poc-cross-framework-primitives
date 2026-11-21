export interface DelayGroup {
    /** Whether a member opening now skips its delay: one is open, or one closed within `timeout`. */
    isInstant(now?: number): boolean;
    /** A member opened; the previously open one is asked to close (`close` is how). */
    opened(close: () => void): void;
    /** A member closed (`close` is the callback it registered). */
    closed(close: () => void, now?: number): void;
}

/**
 * The coordination of a tooltip delay group (spec/tooltip.md, "Delay group"): at most one member
 * open, and the instant hand-off. It knows the open member's close callback and the time of the
 * last close, never a member's open state: each member keeps its own and reports here.
 */
export function createDelayGroup(options: { timeout: number }): DelayGroup {
    let current: (() => void) | null = null;
    let lastClosed = Number.NEGATIVE_INFINITY;
    return {
        isInstant(now = Date.now()) {
            return current !== null || now - lastClosed <= options.timeout;
        },
        opened(close) {
            const previous = current;
            current = close;
            if (previous !== null && previous !== close) {
                previous();
            }
        },
        closed(close, now = Date.now()) {
            if (current === close) {
                current = null;
            }
            lastClosed = now;
        },
    };
}
