import { type Context, useContext } from "react";

/** Reads a part's root context, failing with the part's name outside its root. */
export function useRequiredContext<T>(
    context: Context<T | null>,
    part: string,
): T {
    const value = useContext(context);
    if (value === null) {
        throw new Error(`<${part}> must be inside its Root.`);
    }
    return value;
}
