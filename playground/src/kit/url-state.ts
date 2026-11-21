import type { Scenario } from "../scenarios/scenarios.ts";

export type View = "grid" | "single";

/**
 * What the playground shows, kept in its URL (`?path=/menu/basic&view=single&impl=vue&dir=rtl`)
 * so a view can be shared and reloaded.
 */
export interface PlaygroundState {
    /** The scenario's route. */
    path: string;
    view: View;
    /** The implementation of the single view. */
    impl: string;
    /** Overrides the scenario's own `dir`, when set. */
    dir?: "ltr" | "rtl";
    /** Overrides the scenario's own `locale`, when set. */
    locale?: string;
}

/** Reads the state from a URL's search, falling back to the first scenario and implementation. */
export function readState(
    search: string,
    scenarios: readonly Scenario[],
    implementations: readonly string[],
): PlaygroundState {
    const params = new URLSearchParams(search);
    const path = params.get("path");
    const impl = params.get("impl");
    const dir = params.get("dir");
    const locale = params.get("locale")?.trim();
    const state: PlaygroundState = {
        path: scenarios.some((entry) => entry.path === path)
            ? (path as string)
            : (scenarios[0]?.path ?? "/"),
        view: params.get("view") === "single" ? "single" : "grid",
        impl:
            impl !== null && implementations.includes(impl)
                ? impl
                : (implementations[0] ?? ""),
    };
    if (dir === "ltr" || dir === "rtl") {
        state.dir = dir;
    }
    if (locale !== undefined && locale !== "") {
        state.locale = locale;
    }
    return state;
}

/** The URL search for a state (the inverse of {@link readState}). */
export function writeState(state: PlaygroundState): string {
    const params = new URLSearchParams({ path: state.path, view: state.view });
    if (state.view === "single") {
        params.set("impl", state.impl);
    }
    if (state.dir !== undefined) {
        params.set("dir", state.dir);
    }
    if (state.locale !== undefined) {
        params.set("locale", state.locale);
    }
    return `?${params}`;
}

/**
 * The URL of a scenario in one fixture: its route, with the scenario's own query, overridden by the
 * playground's `dir` and `locale` controls. `ltr` and `en-US` are the fixtures' defaults, so they
 * are left out.
 */
export function frameUrl(
    origin: string,
    scenario: Scenario,
    state: Pick<PlaygroundState, "dir" | "locale">,
): string {
    const locale = state.locale ?? scenario.query.locale;
    const dir = state.dir ?? scenario.query.dir;
    const params = new URLSearchParams();
    if (locale !== undefined && locale !== "en-US") {
        params.set("locale", locale);
    }
    if (dir === "rtl") {
        params.set("dir", dir);
    }
    const search = params.size > 0 ? `?${params}` : "";
    return `${origin}${scenario.path}${search}`;
}
