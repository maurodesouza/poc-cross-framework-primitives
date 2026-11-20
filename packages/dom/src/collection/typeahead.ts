/**
 * Typeahead for lists (spec/menu.md): characters typed within `timeout` ms accumulate; repeating
 * one character cycles through the items starting with it.
 */
export function createTypeahead(timeout = 500) {
    let buffer = "";
    let last = 0;
    return {
        /** The index of the item to move to for `key`, or -1. `labels[i]` is item i's text. */
        match(
            key: string,
            labels: readonly string[],
            current: number,
            now = Date.now(),
        ): number {
            if (key.length !== 1 || labels.length === 0) {
                return -1;
            }
            buffer = now - last > timeout ? key : buffer + key;
            last = now;
            const lower = buffer.toLowerCase();
            const repeated = [...lower].every(
                (character) => character === lower[0],
            );
            const query = repeated ? (lower[0] ?? "") : lower;
            const start =
                repeated || buffer.length === 1
                    ? current + 1
                    : Math.max(current, 0);
            for (let offset = 0; offset < labels.length; offset++) {
                const index = (start + offset) % labels.length;
                if (
                    (labels[index] ?? "").trim().toLowerCase().startsWith(query)
                ) {
                    return index;
                }
            }
            return -1;
        },
        reset() {
            buffer = "";
            last = 0;
        },
    };
}
