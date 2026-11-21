import type { Implementation } from "../../../conformance/src/implementations.ts";
import { element } from "../kit/element.ts";
import { originOf } from "../kit/implementations.ts";
import {
    frameUrl,
    type PlaygroundState,
    readState,
    writeState,
} from "../kit/url-state.ts";
import { componentsOf, type Scenario } from "../scenarios/scenarios.ts";
import { createFrame, type Frame } from "./frame.ts";

/** Locales offered by the locale control (any BCP 47 tag can be typed). */
const LOCALES = ["en-US", "de-DE", "he-IL", "fr-FR", "ja-JP", "ar-EG"];

const BUTTON =
    "rounded border border-palette-line px-2 py-1 text-xs hover:bg-palette-soft aria-pressed:bg-palette-contrast aria-pressed:text-palette-base";

/**
 * The playground: a sidebar of components and scenarios, a toolbar (view, implementation, `dir`,
 * `locale`) and the frames, side by side (grid) or one at a time (single). Every change goes
 * through the URL (`history.pushState`), so the page never reloads and a view can be shared.
 */
export function mountShell(
    root: HTMLElement,
    scenarios: readonly Scenario[],
    implementations: readonly Implementation[],
): void {
    const names = implementations.map((implementation) => implementation.name);
    let frames: Frame[] = [];

    const sidebar = element("nav", {
        class: "w-56 shrink-0 overflow-y-auto border-e border-palette-line p-3 text-sm",
        "aria-label": "Scenarios",
    });
    const toolbar = element("div", {
        class: "flex flex-wrap items-center gap-3 border-b border-palette-line px-4 py-2",
    });
    const stage = element("main", {
        class: "min-h-0 flex-1 overflow-auto p-4",
    });
    root.replaceChildren(
        element(
            "div",
            { class: "flex h-screen" },
            sidebar,
            element(
                "div",
                { class: "flex min-w-0 flex-1 flex-col" },
                toolbar,
                stage,
            ),
        ),
    );

    function current(): PlaygroundState {
        return readState(window.location.search, scenarios, names);
    }

    function navigate(next: PlaygroundState): void {
        const search = writeState(next);
        if (search !== window.location.search) {
            history.pushState(null, "", search);
        }
        render();
    }

    function link(next: PlaygroundState, label: string, active: boolean) {
        const anchor = element(
            "a",
            {
                href: writeState(next),
                class: `block rounded px-2 py-1 hover:bg-palette-soft ${active ? "bg-palette-soft font-semibold" : ""}`,
                "aria-current": active ? "page" : undefined,
            },
            label,
        );
        anchor.addEventListener("click", (event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey) {
                return;
            }
            event.preventDefault();
            navigate(next);
        });
        return anchor;
    }

    function toggle(label: string, pressed: boolean, onClick: () => void) {
        const button = element(
            "button",
            {
                type: "button",
                class: BUTTON,
                "aria-pressed": pressed ? "true" : "false",
            },
            label,
        );
        button.addEventListener("click", onClick);
        return button;
    }

    function renderSidebar(state: PlaygroundState): void {
        sidebar.replaceChildren(
            element(
                "h1",
                { class: "mb-3 px-2 text-base font-semibold" },
                "Playground",
            ),
            ...componentsOf(scenarios).map((component) =>
                element(
                    "section",
                    { class: "mb-3" },
                    element(
                        "h2",
                        {
                            class: "px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-palette-accent/85",
                        },
                        component,
                    ),
                    element(
                        "ul",
                        {},
                        ...scenarios
                            .filter((entry) => entry.component === component)
                            .map((entry) =>
                                element(
                                    "li",
                                    {},
                                    link(
                                        { ...state, path: entry.path },
                                        entry.scenario,
                                        entry.path === state.path,
                                    ),
                                ),
                            ),
                    ),
                ),
            ),
        );
    }

    function renderToolbar(state: PlaygroundState, scenario: Scenario): void {
        const dir = element(
            "select",
            { class: BUTTON, "aria-label": "Direction" },
            element(
                "option",
                { value: "" },
                `dir: scenario (${scenario.query.dir ?? "ltr"})`,
            ),
            element("option", { value: "ltr" }, "dir: ltr"),
            element("option", { value: "rtl" }, "dir: rtl"),
        );
        dir.value = state.dir ?? "";
        dir.addEventListener("change", () => {
            const { dir: _, ...rest } = state;
            navigate(
                dir.value === "ltr" || dir.value === "rtl"
                    ? { ...rest, dir: dir.value }
                    : rest,
            );
        });

        const locale = element("input", {
            class: `${BUTTON} w-36`,
            "aria-label": "Locale",
            list: "playground-locales",
            placeholder: `locale: ${scenario.query.locale ?? "en-US"}`,
        });
        locale.value = state.locale ?? "";
        locale.addEventListener("change", () => {
            const { locale: _, ...rest } = state;
            const value = locale.value.trim();
            navigate(value === "" ? rest : { ...rest, locale: value });
        });

        const views = element(
            "div",
            { class: "flex gap-1", role: "group", "aria-label": "View" },
            toggle("Side by side", state.view === "grid", () =>
                navigate({ ...state, view: "grid" }),
            ),
            toggle("One at a time", state.view === "single", () =>
                navigate({ ...state, view: "single" }),
            ),
        );

        const switcher = element(
            "div",
            {
                class: "flex gap-1",
                role: "group",
                "aria-label": "Implementation",
            },
            ...implementations.map((implementation) =>
                toggle(
                    implementation.name,
                    state.impl === implementation.name,
                    () => navigate({ ...state, impl: implementation.name }),
                ),
            ),
        );
        switcher.hidden = state.view !== "single";

        toolbar.replaceChildren(
            element("code", { class: "text-sm font-semibold" }, scenario.path),
            views,
            switcher,
            element("span", { class: "flex-1" }),
            dir,
            locale,
            element(
                "datalist",
                { id: "playground-locales" },
                ...LOCALES.map((tag) => element("option", { value: tag })),
            ),
        );
    }

    function renderStage(state: PlaygroundState, scenario: Scenario): void {
        for (const frame of frames) {
            frame.dispose();
        }
        const shown =
            state.view === "single"
                ? implementations.filter(
                      (implementation) => implementation.name === state.impl,
                  )
                : implementations;
        frames = shown.map((implementation) => {
            const origin = originOf(implementation);
            return createFrame(
                implementation,
                origin,
                frameUrl(origin, scenario, state),
                // room for the overlays (Dialog, Menu, DatePicker) inside each frame
                state.view === "single" ? "h-full min-h-[640px]" : "h-[640px]",
            );
        });
        stage.replaceChildren(
            shown.length === 0
                ? element(
                      "p",
                      {},
                      "No implementation selected. Run `pnpm playground`.",
                  )
                : element(
                      "div",
                      {
                          class:
                              state.view === "single"
                                  ? "h-full"
                                  : "grid grid-cols-[repeat(auto-fill,minmax(440px,1fr))] gap-4",
                          "data-view": state.view,
                      },
                      ...frames.map((frame) => frame.element),
                  ),
        );
    }

    function render(): void {
        const state = current();
        const scenario =
            scenarios.find((entry) => entry.path === state.path) ??
            scenarios[0];
        if (scenario === undefined) {
            return;
        }
        document.title = `${scenario.path} · Playground`;
        renderSidebar(state);
        renderToolbar(state, scenario);
        renderStage(state, scenario);
    }

    window.addEventListener("popstate", render);
    render();
}
