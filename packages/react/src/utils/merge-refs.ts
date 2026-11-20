import type { Ref, RefCallback } from "react";

/** One ref callback that sets every given ref (React 19: `ref` is a plain prop). */
export function mergeRefs<T>(
    ...refs: readonly (Ref<T> | undefined)[]
): RefCallback<T> {
    return (value) => {
        const cleanups = refs.map((ref) => {
            if (typeof ref === "function") {
                return ref(value);
            }
            if (ref != null) {
                ref.current = value;
            }
            return undefined;
        });
        return () => {
            refs.forEach((ref, index) => {
                const cleanup = cleanups[index];
                if (typeof cleanup === "function") {
                    cleanup();
                } else if (typeof ref === "function") {
                    ref(null);
                } else if (ref != null) {
                    ref.current = null;
                }
            });
        };
    };
}
