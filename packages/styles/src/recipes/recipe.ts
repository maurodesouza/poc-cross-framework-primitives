/** A component's classes, one string per part of its spec (`data-<component>-part`). */
export type Recipe<Part extends string> = Readonly<Record<Part, string>>;

/** Joins class strings, dropping empty ones. */
export function classes(
    ...values: readonly (string | false | null | undefined)[]
): string {
    return values.filter(Boolean).join(" ");
}
