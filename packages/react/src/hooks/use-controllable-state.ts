import { useCallback, useRef, useState } from "react";

/**
 * Controlled when `value` is given (it only reports changes), uncontrolled otherwise, seeded by
 * `defaultValue` (spec/README.md, "Normalized API names").
 */
export function useControllableState<T, Details>(
    value: T | undefined,
    defaultValue: T,
    onChange: ((value: T, details: Details) => void) | undefined,
): [T, (next: T, details: Details) => void] {
    const [own, setOwn] = useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : own;
    const latest = useRef({ current, onChange, controlled });
    latest.current = { current, onChange, controlled };
    const set = useCallback((next: T, details: Details) => {
        const {
            current: before,
            onChange: callback,
            controlled: isControlled,
        } = latest.current;
        if (Object.is(before, next)) {
            return;
        }
        if (!isControlled) {
            setOwn(next);
        }
        callback?.(next, details);
    }, []);
    return [current, set];
}
