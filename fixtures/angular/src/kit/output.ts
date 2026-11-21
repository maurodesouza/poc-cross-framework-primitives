import { Component, computed, input, ViewEncapsulation } from "@angular/core";

/**
 * What a scenario prints outside the component, as `key: value` lines (spec/README.md). The
 * component is the `<pre>` itself (an attribute selector), so the DOM matches React's.
 */
@Component({
    selector: "pre[fixtureOutput]",
    encapsulation: ViewEncapsulation.None,
    host: {
        "data-testid": "output",
        class: "mt-4 rounded-md bg-palette-soft p-2 text-xs",
    },
    template: "{{ text() }}",
})
export class Output {
    readonly values =
        input.required<
            Record<string, string | number | boolean | null | undefined>
        >();
    protected readonly text = computed(() =>
        Object.entries(this.values())
            .map(([key, value]) => `${key}: ${value ?? "none"}`)
            .join("\n"),
    );
}
