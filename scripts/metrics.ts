// `pnpm metrics --framework <name>`: the POC's numbers for one framework (docs/plan.md, "Metrics"),
// written to docs/reports/data/<name>.json and docs/reports/data/<name>.md (the tables).
// Run the conformance suite first (`pnpm e2e`): its JSON report feeds the conformance table.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { conformanceResults } from "./metrics/conformance.ts";
import { effortOf } from "./metrics/effort.ts";
import { type Metrics, renderTables } from "./metrics/report.ts";
import { bundleSize, viteBundleSize } from "./metrics/size.ts";
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
        /** The Vite plugin that compiles the package's source; esbuild bundles it when absent. */
        plugin?: { name: string; factory: string };
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
    vue: {
        fixture: "fixtures/vue",
        external: ["vue"],
        ours: (namespace) => `export { ${namespace} } from "@poc/vue";`,
        // Reka UI, with the parts closest to each spec's scope (resolved from the repository root)
        baseline: {
            fixture: ".",
            imports: {
                dialog: 'export { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from "reka-ui";',
                popover:
                    'export { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow, PopoverClose } from "reka-ui";',
                menu: 'export { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "reka-ui";',
                combobox:
                    'export { ComboboxRoot, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxItem, ComboboxEmpty } from "reka-ui";',
                tabs: 'export { TabsRoot, TabsList, TabsTrigger, TabsIndicator, TabsContent } from "reka-ui";',
                calendar:
                    'export { CalendarRoot, CalendarHeader, CalendarHeading, CalendarPrev, CalendarNext, CalendarGrid, CalendarGridHead, CalendarGridBody, CalendarGridRow, CalendarHeadCell, CalendarCell, CalendarCellTrigger, RangeCalendarRoot, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarPrev, RangeCalendarNext, RangeCalendarGrid, RangeCalendarGridHead, RangeCalendarGridBody, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarCell, RangeCalendarCellTrigger } from "reka-ui";',
                "date-picker":
                    'export { DatePickerRoot, DatePickerTrigger, DatePickerContent, DatePickerCalendar, DateRangePickerRoot, DateRangePickerTrigger, DateRangePickerContent, DateRangePickerCalendar } from "reka-ui";',
            },
        },
    },
    svelte: {
        fixture: "fixtures/svelte",
        external: ["svelte"],
        plugin: { name: "@sveltejs/vite-plugin-svelte", factory: "svelte" },
        ours: (namespace) => `export { ${namespace} } from "@poc/svelte";`,
        // Bits UI 2.21 (resolved from the root through the fixture, which has the Svelte plugin)
        baseline: {
            fixture: "fixtures/svelte",
            imports: {
                dialog: 'export { Dialog } from "bits-ui";',
                popover: 'export { Popover } from "bits-ui";',
                menu: 'export { DropdownMenu } from "bits-ui";',
                combobox: 'export { Combobox } from "bits-ui";',
                tabs: 'export { Tabs } from "bits-ui";',
                calendar: 'export { Calendar, RangeCalendar } from "bits-ui";',
                "date-picker":
                    'export { DatePicker, DateRangePicker } from "bits-ui";',
            },
        },
    },
    solid: {
        fixture: "fixtures/solid",
        external: ["solid-js", "@solidjs/web"],
        plugin: { name: "@solidjs/vite-plugin", factory: "default" },
        ours: (namespace) => `export { ${namespace} } from "@poc/solid";`,
        // Kobalte 0.13 targets Solid 1.9 (its compiled build; `solid-js` external): indicative
        // only. It has no calendar or date picker.
        baseline: {
            fixture: "fixtures/solid",
            imports: {
                dialog: 'export { Dialog } from "@kobalte/core/dialog";',
                popover: 'export { Popover } from "@kobalte/core/popover";',
                menu: 'export { DropdownMenu } from "@kobalte/core/dropdown-menu";',
                combobox: 'export { Combobox } from "@kobalte/core/combobox";',
                tabs: 'export { Tabs } from "@kobalte/core/tabs";',
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
        const measure = (code: string, dir: string) =>
            config.plugin
                ? viteBundleSize(code, dir, config.external, config.plugin)
                : bundleSize(code, dir, config.external);
        const ours = await measure(
            config.ours(NAMESPACES[component] ?? component),
            join(root, config.fixture),
        );
        const baselineCode = config.baseline?.imports[component];
        const baseline = baselineCode
            ? await measure(
                  baselineCode,
                  join(root, config.baseline?.fixture ?? ""),
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
