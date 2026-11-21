/** A scenario's query parameters (spec/README.md, "Scenarios and fixtures"). */
export interface ScenarioQuery {
    locale?: string;
    dir?: "ltr" | "rtl";
}

export interface Scenario {
    /** The component, as in `spec/<component>.md`. */
    component: string;
    /** The scenario's name, as in its route. */
    scenario: string;
    /** The route every fixture serves it at: `/<component>/<scenario>`. */
    path: string;
    /** The query the spec gives it (`/calendar/rtl?locale=he-IL&dir=rtl`), if any. */
    query: ScenarioQuery;
}

function scenario(path: string, query: ScenarioQuery = {}): Scenario {
    const [, component = "", name = ""] = path.split("/");
    return { component, scenario: name, path, query };
}

/**
 * Every scenario of the specs, in the fixtures' order. `tests/playground-manifest.test.ts` keeps it
 * equal to every fixture's routes: a scenario added to the fixtures is added here too.
 */
export const SCENARIOS: readonly Scenario[] = [
    scenario("/dialog/basic"),
    scenario("/dialog/initial-focus"),
    scenario("/dialog/nested-popover"),
    scenario("/dialog/controlled"),
    scenario("/popover/basic"),
    scenario("/popover/placement"),
    scenario("/popover/rtl", { dir: "rtl" }),
    scenario("/popover/arrow"),
    scenario("/menu/basic"),
    scenario("/menu/submenu"),
    scenario("/menu/groups"),
    scenario("/combobox/basic"),
    scenario("/combobox/controlled"),
    scenario("/tabs/automatic"),
    scenario("/tabs/manual"),
    scenario("/tabs/vertical"),
    scenario("/calendar/single"),
    scenario("/calendar/min-max"),
    scenario("/calendar/unavailable"),
    scenario("/calendar/locale", { locale: "de-DE" }),
    scenario("/calendar/rtl", { locale: "he-IL", dir: "rtl" }),
    scenario("/calendar/two-months"),
    scenario("/calendar/range"),
    scenario("/date-picker/basic"),
    scenario("/date-picker/range"),
];

/** The components, in the manifest's order. */
export function componentsOf(scenarios: readonly Scenario[]): string[] {
    return [...new Set(scenarios.map((entry) => entry.component))];
}
