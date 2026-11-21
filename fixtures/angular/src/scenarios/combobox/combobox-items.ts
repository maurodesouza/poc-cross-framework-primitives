/** The items of `/combobox/filtered`, `/combobox/objects`, `/combobox/groups` and `/combobox/form`. */
export const CITIES: readonly string[] = [
    "Bogotá",
    "Brasília",
    "Kraków",
    "Málaga",
    "Montréal",
    "São Paulo",
    "Zürich",
];

export interface Country {
    code: string;
    name: string;
}

export const COUNTRIES: readonly Country[] = [
    { code: "AR", name: "Argentina" },
    { code: "BR", name: "Brazil" },
    { code: "DE", name: "Germany" },
    { code: "JP", name: "Japan" },
    { code: "SE", name: "Sweden" },
];

/** The scenario's filter: the code equals the query, or the name contains it. */
export function matchCountry(country: Country, query: string): boolean {
    const needle = query.toLowerCase();
    return (
        country.code.toLowerCase() === needle ||
        country.name.toLowerCase().includes(needle)
    );
}

export interface Produce {
    value: string;
    label: string;
}

export interface ProduceGroup {
    label: string;
    items: readonly Produce[];
}

const produce = (label: string): Produce => ({
    value: label.toLowerCase(),
    label,
});

export const PRODUCE: readonly ProduceGroup[] = [
    { label: "Fruits", items: ["Apple", "Banana", "Cherry"].map(produce) },
    {
        label: "Vegetables",
        items: ["Carrot", "Celery", "Potato"].map(produce),
    },
];

export const TOPPINGS: readonly Produce[] = ["Cream", "Nuts", "Syrup"].map(
    produce,
);
