/** What a scenario prints outside the component, as `key: value` lines (spec/README.md). */
export function Output({
    values,
}: {
    values: Record<string, string | number | boolean | null | undefined>;
}) {
    const lines = Object.entries(values).map(
        ([key, value]) => `${key}: ${value ?? "none"}`,
    );
    return (
        <pre
            data-testid="output"
            className="mt-4 rounded-md bg-palette-soft p-2 text-xs"
        >
            {lines.join("\n")}
        </pre>
    );
}
