import type { FunctionalComponent } from "vue";

/**
 * Renders each string as its own text node, as JSX does for `{label} settings`. A Vue template
 * merges an interpolation and the text around it into one node, and a different split shifts the
 * glyphs by a fraction of a pixel: the screenshots then differ from React's (docs/reports/vue.md).
 */
export const TextRuns: FunctionalComponent<{ runs: readonly string[] }> = (
    props,
) => [...props.runs];
TextRuns.props = ["runs"];
