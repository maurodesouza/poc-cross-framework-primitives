/**
 * Every implementation the suite runs against: one Playwright project each. A new framework
 * registers here (its fixture package, a free port, and the layers it must pass).
 */
export type Layer = "behaviour" | "contract" | "visual";

export interface Implementation {
    /** The Playwright project name (`pnpm e2e --project <name>`). */
    name: string;
    /** The fixture's package name (`fixtures/<dir>/package.json`). */
    fixture: string;
    port: number;
    layers: readonly Layer[];
}

export const IMPLEMENTATIONS: readonly Implementation[] = [
    // Base UI 1.9 (Dialog, Popover, Menu, Combobox, Tabs) and React Aria Components (the
    // calendar family): the yardstick. Its own state attributes differ from the spec, so it runs
    // the behaviour layer only.
    {
        name: "baseline",
        fixture: "fixture-baseline-react",
        port: 5310,
        layers: ["behaviour"],
    },
    // @poc/react (Epic B): the reference implementation; its screenshots are the golden set.
    {
        name: "react",
        fixture: "fixture-react",
        port: 5320,
        layers: ["behaviour", "contract", "visual"],
    },
    // @poc/vue (Epic C): the first port; it compares against React's golden screenshots.
    {
        name: "vue",
        fixture: "fixture-vue",
        port: 5330,
        layers: ["behaviour", "contract", "visual"],
    },
    // @poc/svelte (Epic D)
    {
        name: "svelte",
        fixture: "fixture-svelte",
        port: 5340,
        layers: ["behaviour", "contract", "visual"],
    },
    // @poc/solid (Epic D): Solid 2.0
    {
        name: "solid",
        fixture: "fixture-solid",
        port: 5350,
        layers: ["behaviour", "contract", "visual"],
    },
];

/** The project names given with `--project` on the command line, if any. */
export function selectedProjects(argv: readonly string[]): string[] {
    const names: string[] = [];
    argv.forEach((arg, index) => {
        if (arg === "--project") {
            const next = argv[index + 1];
            if (next !== undefined) {
                names.push(next);
            }
        } else if (arg.startsWith("--project=")) {
            names.push(arg.slice("--project=".length));
        }
    });
    return names;
}
