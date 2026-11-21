// Merges the props a part computes with the consumer's (AGENTS.md, the primitive contract), for
// Solid: `on*` handlers compose (the part's first), `class` values join (Solid takes an array),
// `style` objects merge and strings concatenate (the consumer's last, so it wins), every other
// consumer prop wins.

export type Props = Record<string, unknown>;

type Handler = (...args: unknown[]) => void;

function isHandler(key: string, value: unknown): value is Handler {
    return /^on[A-Z]/.test(key) && typeof value === "function";
}

function mergeStyle(own: unknown, value: unknown): unknown {
    if (typeof own === "string" && typeof value === "string") {
        return `${own};${value}`;
    }
    if (own && value && typeof own === "object" && typeof value === "object") {
        return { ...own, ...value };
    }
    return value;
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
            key === "class" &&
            own !== undefined &&
            value !== undefined
        ) {
            merged[key] = [own, value];
        } else if (
            key === "style" &&
            own !== undefined &&
            value !== undefined
        ) {
            merged[key] = mergeStyle(own, value);
        } else if (value !== undefined) {
            merged[key] = value;
        }
    }
    return merged;
}
