/**
 * A `data-*` value for a host binding (spec/README.md, "State attributes"): `true` gives an empty
 * attribute, `false`, `null` and `undefined` give none (`null` removes it, never `"false"`),
 * strings are values.
 */
export function dataValue(
    value: boolean | string | null | undefined,
): string | null {
    if (value === true) {
        return "";
    }
    return typeof value === "string" ? value : null;
}

/** The same for a whole state record: `[attr.data-open]="data().open"`. */
export function dataValues<K extends string>(
    state: Record<K, boolean | string | null | undefined>,
): Record<K, string | null> {
    const values = {} as Record<K, string | null>;
    for (const key of Object.keys(state) as K[]) {
        values[key] = dataValue(state[key]);
    }
    return values;
}
