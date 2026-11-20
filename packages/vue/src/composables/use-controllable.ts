import { computed, shallowRef } from "vue";

/**
 * Controlled when `get()` gives a value (it only reports changes), uncontrolled otherwise, seeded
 * by `initial` (spec/README.md, "Normalized API names").
 */
export function useControllable<T, Details>(
    get: () => T | undefined,
    initial: T,
    onChange: (value: T, details: Details) => void,
) {
    const own = shallowRef(initial);
    const value = computed(() => {
        const controlled = get();
        return controlled !== undefined ? controlled : own.value;
    });
    function set(next: T, details: Details) {
        if (Object.is(next, value.value)) {
            return;
        }
        if (get() === undefined) {
            own.value = next;
        }
        onChange(next, details);
    }
    return { value, set };
}
