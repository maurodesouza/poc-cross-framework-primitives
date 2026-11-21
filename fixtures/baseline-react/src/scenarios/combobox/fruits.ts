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

/** How the output prints a value: its `value`, joined with `,`; `none` for nothing. */
export function printValues(
    value: { value: string } | readonly { value: string }[] | null,
): string {
    const list = value === null ? [] : Array.isArray(value) ? value : [value];
    return list.length === 0
        ? "none"
        : list.map((entry: { value: string }) => entry.value).join(",");
}
