// Merges the props a primitive computes with the consumer's (AGENTS.md, the primitive contract):
// event handlers compose (internal first, then the consumer's), `className` joins, `style` merges
// (the consumer's values win), every other consumer prop wins.

type Props = Record<string, unknown>;

function isHandler(
    key: string,
    value: unknown,
): value is (...args: unknown[]) => void {
    return /^on[A-Z]/.test(key) && typeof value === "function";
}

export function mergeProps(internal: Props, external: Props): Props {
    const merged: Props = { ...internal };
    for (const [key, value] of Object.entries(external)) {
        const own = internal[key];
        if (isHandler(key, value) && isHandler(key, own)) {
            merged[key] = (...args: unknown[]) => {
                own(...args);
                value(...args);
            };
        } else if (
            key === "className" &&
            typeof own === "string" &&
            typeof value === "string"
        ) {
            merged[key] = `${own} ${value}`;
        } else if (
            key === "style" &&
            own &&
            value &&
            typeof own === "object" &&
            typeof value === "object"
        ) {
            merged[key] = { ...(own as object), ...(value as object) };
        } else if (value !== undefined) {
            merged[key] = value;
        }
    }
    return merged;
}
