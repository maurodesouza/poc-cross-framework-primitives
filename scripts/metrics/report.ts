import type { LayerResult } from "./conformance.ts";
import type { SizeEntry } from "./size.ts";
import type { ComponentLoc } from "./sources.ts";

export interface Metrics {
    framework: string;
    generatedAt: string;
    loc: { components: ComponentLoc[]; shared: number; domTotal: number };
    sizes: { component: string; ours: SizeEntry; baseline: SizeEntry | null }[];
    conformance: Record<string, Record<string, LayerResult>>;
    effort: Record<
        string,
        { commits: number; first: string | null; last: string | null }
    >;
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`;

/** The Markdown tables of a report, from the metrics. */
export function renderTables(metrics: Metrics): string {
    const lines: string[] = [];
    lines.push(`### Lines of code (${metrics.framework})`, "");
    lines.push(
        "| component | framework package | @poc/dom used | share in @poc/dom |",
        "| --- | --- | --- | --- |",
    );
    for (const row of metrics.loc.components) {
        const total = row.framework + row.dom;
        const share =
            total === 0 ? "-" : `${Math.round((row.dom / total) * 100)}%`;
        lines.push(
            `| ${row.component} | ${row.framework} | ${row.dom} | ${share} |`,
        );
    }
    lines.push(
        "",
        `Shared framework infrastructure (hooks, utils): ${metrics.loc.shared} lines. All of @poc/dom: ${metrics.loc.domTotal} lines.`,
        "",
    );
    lines.push("### Bundle size (minified + gzip, framework external)", "");
    lines.push("| component | ours | baseline |", "| --- | --- | --- |");
    for (const row of metrics.sizes) {
        const baseline = row.baseline ? kb(row.baseline.gzip) : "-";
        lines.push(`| ${row.component} | ${kb(row.ours.gzip)} | ${baseline} |`);
    }
    lines.push("", "### Conformance", "");
    lines.push(
        "| project | layer | passed | failed | expected failures | skipped |",
        "| --- | --- | --- | --- | --- | --- |",
    );
    for (const [project, layers] of Object.entries(
        metrics.conformance,
    ).sort()) {
        for (const [layer, counts] of Object.entries(layers).sort()) {
            lines.push(
                `| ${project} | ${layer} | ${counts.passed} | ${counts.failed} | ${counts.expectedFailures} | ${counts.skipped} |`,
            );
        }
    }
    lines.push("", "### Effort (commits per component folder)", "");
    lines.push(
        "| component | commits | first | last |",
        "| --- | --- | --- | --- |",
    );
    for (const [component, effort] of Object.entries(metrics.effort)) {
        lines.push(
            `| ${component} | ${effort.commits} | ${effort.first ?? "-"} | ${effort.last ?? "-"} |`,
        );
    }
    return `${lines.join("\n")}\n`;
}
