import type { SelectItemData } from "@poc/angular";

/** The items of the select scenarios (spec/select.md): value = label in lower case. */
export const FRUIT_ITEMS: readonly SelectItemData[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "cherry", label: "Cherry" },
    { value: "grape", label: "Grape" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange", disabled: true },
];
