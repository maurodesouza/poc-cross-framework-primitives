import { createSignal } from "solid-js";

/**
 * Controlled when `value()` is defined (it only reports changes), uncontrolled otherwise, seeded
 * by `initial()` (spec/README.md, "Normalized API names").
 */
export function createControllable<T, Details>(
    value: () => T | undefined,
    initial: () => T,
    onChange: (value: T, details: Details) => void,
): [() => T, (next: T, details: Details) => void] {
    const [own, setOwn] = createSignal<T>(() => initial());
    const current = () => {
        const controlled = value();
        return controlled !== undefined ? controlled : own();
    };
    const set = (next: T, details: Details) => {
        if (Object.is(current(), next)) {
            return;
        }
        if (value() === undefined) {
            setOwn(() => next);
        }
        onChange(next, details);
    };
    return [current, set];
}
