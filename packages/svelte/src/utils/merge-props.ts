// Merges a part's props with the consumer's (AGENTS.md, the primitive contract), for Svelte:
// `on*` handlers compose (the part's first), `class` joins (Svelte's clsx arrays), `style` strings
// concatenate (the consumer's last, so it wins), attachments (symbol keys) are all kept, other
// consumer props win.

type Props = Record<string | symbol, unknown>;

/** Props to spread on an element: Svelte types each element's attributes, attachments included. */
// biome-ignore lint/suspicious/noExplicitAny: a spread target for any element's attribute types
export type SpreadProps = Record<string | symbol, any>;

export function mergeProps(internal: Props, external: Props): SpreadProps {
    const merged: SpreadProps = { ...internal };
    for (const key of Reflect.ownKeys(external)) {
        const value = external[key];
        const own = internal[key];
        if (typeof key === "symbol") {
            merged[key] = value;
            continue;
        }
        if (
            /^on[a-z]/.test(key) &&
            typeof value === "function" &&
            typeof own === "function"
        ) {
            merged[key] = (...args: unknown[]) => {
                (own as (...a: unknown[]) => void)(...args);
                (value as (...a: unknown[]) => void)(...args);
            };
        } else if (
            key === "class" &&
            own !== undefined &&
            value !== undefined
        ) {
            merged[key] = [own, value];
        } else if (
            key === "style" &&
            typeof own === "string" &&
            typeof value === "string"
        ) {
            merged[key] = `${own};${value}`;
        } else if (value !== undefined) {
            merged[key] = value;
        }
    }
    // symbol keys of the part's own props are copied by the spread above only if enumerable
    for (const key of Object.getOwnPropertySymbols(internal)) {
        if (!(key in merged)) {
            merged[key] = internal[key];
        }
    }
    return merged;
}
