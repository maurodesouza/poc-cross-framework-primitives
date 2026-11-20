import { type InjectionKey, inject } from "vue";

/** Reads a part's root context, failing with the part's name outside its root. */
export function useRequiredContext<T>(key: InjectionKey<T>, part: string): T {
    const value = inject(key, null);
    if (value === null) {
        throw new Error(`<${part}> must be inside its Root.`);
    }
    return value;
}
