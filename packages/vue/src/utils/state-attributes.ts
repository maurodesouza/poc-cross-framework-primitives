/**
 * `data-*` attributes from a state record (spec/README.md, "State attributes"): `true` gives an
 * empty attribute, `false`, `null` and `undefined` give none (never `"false"`), strings are values.
 */
export function stateAttributes(
    state: Record<string, boolean | string | null | undefined>,
): Record<string, string> {
    const attributes: Record<string, string> = {};
    for (const [key, value] of Object.entries(state)) {
        if (value === true) {
            attributes[`data-${key}`] = "";
        } else if (typeof value === "string") {
            attributes[`data-${key}`] = value;
        }
    }
    return attributes;
}
