/** What a scenario prints outside the component, as `key: value` lines (spec/README.md). */
export function Output(props: {
    values: Record<string, string | number | boolean | null | undefined>;
}) {
    const text = () =>
        Object.entries(props.values)
            .map(([key, value]) => `${key}: ${value ?? "none"}`)
            .join("\n");
    return (
        <pre
            data-testid="output"
            class="mt-4 rounded-md bg-palette-soft p-2 text-xs"
        >
            {text()}
        </pre>
    );
}
