// `pnpm metrics --framework <name>`: the POC's numbers for one framework (docs/plan.md, "Metrics"),
// written to docs/reports/data/<name>.json and docs/reports/data/<name>.md (the tables).
// Run the conformance suite first (`pnpm e2e`): its JSON report feeds the conformance table.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { conformanceResults } from "./metrics/conformance.ts";
import { effortOf } from "./metrics/effort.ts";
import { type Metrics, renderTables } from "./metrics/report.ts";
import { bundleSize } from "./metrics/size.ts";
import {
    COMPONENTS,
    componentLoc,
    locOf,
    sourceFiles,
} from "./metrics/sources.ts";

const root = join(import.meta.dirname, "..");

/** Per framework: the fixture that resolves the package, the externals, and the comparison library. */
const FRAMEWORKS: Record<
    string,
    {
        fixture: string;
        external: string[];
        ours: (namespace: string) => string;
        baseline?: {
            fixture: string;
            imports: Partial<Record<string, string>>;
        };
    }
> = {
    react: {
        fixture: "fixtures/react",
        external: ["react", "react-dom", "react/jsx-runtime"],
        ours: (namespace) => `export { ${namespace} } from "@poc/react";`,
        baseline: {
            fixture: "fixtures/baseline-react",
            imports: {
                dialog: 'export { Dialog } from "@base-ui/react/dialog";',
                popover: 'export { Popover } from "@base-ui/react/popover";',
                menu: 'export { Menu } from "@base-ui/react/menu";',
                combobox: 'export { Combobox } from "@base-ui/react/combobox";',
                tabs: 'export { Tabs } from "@base-ui/react/tabs";',
                calendar:
                    'export { Calendar, RangeCalendar } from "react-aria-components";',
                "date-picker":
                    'export { DatePicker, DateRangePicker } from "react-aria-components";',
            },
        },
    },
};

const NAMESPACES: Record<string, string> = {
    dialog: "Dialog",
    popover: "Popover",
    menu: "Menu",
    combobox: "Combobox",
    tabs: "Tabs",
    calendar: "Calendar, RangeCalendar",
    "date-picker": "DatePicker, DateRangePicker",
};

function parseFramework(argv: readonly string[]): string {
    const index = argv.indexOf("--framework");
    const value =
        index === -1
            ? argv.find((arg) => arg.startsWith("--framework="))?.split("=")[1]
            : argv[index + 1];
    if (value === undefined || !(value in FRAMEWORKS)) {
        throw new Error(
            `usage: pnpm metrics --framework <${Object.keys(FRAMEWORKS).join("|")}>`,
        );
    }
    return value;
}

async function main(): Promise<void> {
    const framework = parseFramework(process.argv.slice(2));
    const config = FRAMEWORKS[framework] as (typeof FRAMEWORKS)[string];
    const loc = componentLoc(root, framework);
    const sizes = [];
    for (const component of COMPONENTS) {
        const ours = await bundleSize(
            config.ours(NAMESPACES[component] ?? component),
            join(root, config.fixture),
            config.external,
        );
        const baselineCode = config.baseline?.imports[component];
        const baseline = baselineCode
            ? await bundleSize(
                  baselineCode,
                  join(root, config.baseline?.fixture ?? ""),
                  config.external,
              )
            : null;
        sizes.push({ component, ours, baseline });
    }
    const effort = Object.fromEntries(
        COMPONENTS.map((component) => [
            component,
            effortOf(root, `packages/${framework}/src/components/${component}`),
        ]),
    );
    const metrics: Metrics = {
        framework,
        generatedAt: new Date().toISOString(),
        loc: {
            ...loc,
            domTotal: locOf(sourceFiles(join(root, "packages/dom/src"))),
        },
        sizes,
        conformance: conformanceResults(
            join(root, "conformance/test-results/results.json"),
        ),
        effort,
    };
    const dir = join(root, "docs/reports/data");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
        join(dir, `${framework}.json`),
        `${JSON.stringify(metrics, null, 4)}\n`,
    );
    writeFileSync(join(dir, `${framework}.md`), renderTables(metrics));
    console.log(renderTables(metrics));
}

if (import.meta.main) {
    await main();
}
