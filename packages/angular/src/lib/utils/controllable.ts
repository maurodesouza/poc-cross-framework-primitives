import {
    computed,
    type ModelSignal,
    type Signal,
    untracked,
} from "@angular/core";

export interface Controllable<T, Details> {
    value: Signal<T>;
    set: (next: T, details: Details) => void;
}

/**
 * A value bound with `model()` (spec/README.md, API mapping: Angular): the bound value when the
 * consumer gives one (`[(open)]`, `[open]`), its own otherwise, seeded once by `fallback()` (the
 * `default*` input, read on first use, after the inputs are set). A change sets the model, which
 * emits its `*Change` output, and reports the details.
 */
export function controllable<T, Details>(
    model: ModelSignal<T | undefined>,
    fallback: () => T,
    onChange: (value: T, details: Details) => void,
): Controllable<T, Details> {
    let seed: { value: T } | null = null;
    const value = computed(() => {
        const bound = model();
        if (bound !== undefined) {
            return bound;
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
            model.set(next);
            onChange(next, details);
        },
    };
}
