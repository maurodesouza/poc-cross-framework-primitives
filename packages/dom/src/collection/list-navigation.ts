export interface NavigationOptions {
    /** Wrap from the last item to the first, and back (default `true`). */
    loop?: boolean;
    /** Items the navigation passes over (default: none). */
    skip?: (index: number) => boolean;
}

/**
 * The index `delta` steps from `current` in a list of `count` items (spec: menus, tabs). From no
 * item (`current` -1), +1 goes to the first and -1 to the last. Returns `current` when there is
 * nowhere to go.
 */
export function stepIndex(
    count: number,
    current: number,
    delta: 1 | -1,
    options: NavigationOptions = {},
): number {
    const { loop = true, skip = () => false } = options;
    if (count === 0) {
        return -1;
    }
    let index = current;
    for (let tries = 0; tries < count; tries++) {
        if (index === -1) {
            index = delta === 1 ? 0 : count - 1;
        } else {
            index += delta;
            if (index < 0 || index >= count) {
                if (!loop) {
                    return current;
                }
                index = (index + count) % count;
            }
        }
        if (!skip(index)) {
            return index;
        }
    }
    return current;
}

/** The first (or last) index not skipped, or -1. */
export function edgeIndex(
    count: number,
    edge: "first" | "last",
    skip: (index: number) => boolean = () => false,
): number {
    const order = Array.from({ length: count }, (_, index) =>
        edge === "first" ? index : count - 1 - index,
    );
    return order.find((index) => !skip(index)) ?? -1;
}
