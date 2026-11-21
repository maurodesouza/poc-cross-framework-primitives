import { getContext, setContext } from "svelte";

/** A typed context: `provide` in a root, `use` in its parts (failing with the part's name). */
export function createContext<T>(name: string) {
    const key = Symbol(name);
    return {
        provide: (value: T) => setContext(key, value),
        use: (part: string): T => {
            const value = getContext<T | undefined>(key);
            if (value === undefined) {
                throw new Error(`<${part}> must be inside its Root.`);
            }
            return value;
        },
        maybe: (): T | undefined => getContext<T | undefined>(key),
    };
}
