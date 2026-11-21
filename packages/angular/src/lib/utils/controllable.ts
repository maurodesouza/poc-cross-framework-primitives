import {
    computed,
    type OutputEmitterRef,
    type Signal,
    signal,
    untracked,
} from "@angular/core";

export interface Controllable<T, Details> {
    value: Signal<T>;
    set: (next: T, details: Details) => void;
}

/**
 * A value given as an input with its `*Change` output (spec/README.md, API mapping: Angular):
 * controlled when the consumer binds it (`[(open)]` or a one-way `[open]`), which it only reports
 * through the output; its own otherwise, seeded once by `fallback()` (the `default*` input, read on
 * first use, after the inputs are set). Not a `model()`: a model writes its own value on change,
 * so a one-way binding, or a consumer keeping the old value, would lose control.
 */
export function controllable<T, Details>(
    bound: Signal<T | undefined>,
    change: Pick<OutputEmitterRef<T>, "emit">,
    fallback: () => T,
    onChange: (value: T, details: Details) => void,
): Controllable<T, Details> {
    let seed: { value: T } | null = null;
    const own = signal<{ value: T } | null>(null);
    const value = computed(() => {
        const given = bound();
        if (given !== undefined) {
            return given;
        }
        const local = own();
        if (local !== null) {
            return local.value;
        }
        seed ??= { value: untracked(fallback) };
        return seed.value;
    });
    return {
        value,
        set: (next, details) => {
            if (Object.is(untracked(value), next)) {
                return;
            }
            if (untracked(bound) === undefined) {
                own.set({ value: next });
            }
            change.emit(next);
            onChange(next, details);
        },
    };
}
