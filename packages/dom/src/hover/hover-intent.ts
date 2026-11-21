export interface HoverIntent {
    /** Calls `open` after `delay` ms (at once for 0), cancelling a pending close. */
    enter(delay: number): void;
    /** Calls `close` after `delay` ms (at once for 0), cancelling a pending open. */
    leave(delay: number): void;
    /** Cancels whatever is pending. */
    cancel(): void;
}

/**
 * The timers of hover intent (spec/tooltip.md, "Pointer"): an open after a delay that a leave
 * cancels, and a close after a delay that a return cancels. It holds no open state: `open` and
 * `close` report to the framework, which decides.
 */
export function createHoverIntent(callbacks: {
    open: () => void;
    close: () => void;
}): HoverIntent {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => {
        if (timer !== undefined) {
            clearTimeout(timer);
            timer = undefined;
        }
    };
    const after = (delay: number, run: () => void) => {
        cancel();
        if (delay <= 0) {
            run();
            return;
        }
        timer = setTimeout(() => {
            timer = undefined;
            run();
        }, delay);
    };
    return {
        enter: (delay) => after(delay, callbacks.open),
        leave: (delay) => after(delay, callbacks.close),
        cancel,
    };
}
