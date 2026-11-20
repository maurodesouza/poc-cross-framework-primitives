export interface Fruit {
    value: string;
    label: string;
    disabled?: boolean;
}

/** The items of the combobox scenarios (spec/combobox.md). */
export const FRUITS: readonly Fruit[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "cherry", label: "Cherry" },
    { value: "grape", label: "Grape" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange", disabled: true },
];

/** The scenarios' filter: a case-insensitive "contains" on the label. */
export function filterFruits(query: string): Fruit[] {
    const needle = query.trim().toLowerCase();
    return FRUITS.filter((fruit) => fruit.label.toLowerCase().includes(needle));
}
