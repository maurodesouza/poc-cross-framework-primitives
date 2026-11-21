# poc-cross-framework-primitives

A proof of concept: headless UI primitives written from scratch for React, Vue, Angular, Svelte
and Solid, with **no shared component core**. They share a spec, framework-free DOM utilities, one
Tailwind styling layer and one conformance suite. The question is whether that is enough to give
the same behaviour and the same UI in every framework, at a sustainable cost.

- The rules: [`AGENTS.md`](AGENTS.md)
- The plan, phases and metrics: [`docs/plan.md`](docs/plan.md)
- The results: `docs/reports/` (from Epic B on)

## Getting started

```sh
pnpm install
pnpm check      # Biome and the source layout check
pnpm typecheck
pnpm test
pnpm e2e        # the conformance suite (from Epic A's conformance issue on)
```

Requires Node 24 or later and pnpm (the version is pinned in `package.json`).

## Playground

Every scenario of every component, running live in every framework:

```sh
pnpm playground                         # React, Vue, Svelte, Solid and Angular, then http://localhost:5300
pnpm playground --framework vue,solid   # only those fixtures (plus the playground)
pnpm playground --baseline              # adds the Base UI / React Aria baseline
```

`scripts/playground.ts` starts each fixture's Vite dev server (with HMR) on its conformance suite
port (`conformance/src/implementations.ts`: baseline 5310, React 5320, Vue 5330, Svelte 5340,
Solid 5350, Angular 5360), then the playground app (`playground/`) on 5300. Each server's output
is prefixed with its name, and Ctrl+C stops every server it started.

The app has a sidebar of components and scenarios, and two views:

- **Side by side**: one frame per implementation, each tall enough for its overlays (Dialog, Menu,
  DatePicker) to open inside it;
- **One at a time**: one implementation, full size, with a switcher.

The `dir` and `locale` controls override the scenario's own query (`/calendar/rtl` is
`?locale=he-IL&dir=rtl`). Each frame can be reloaded or opened in a new tab, and an
implementation whose server does not answer shows "not running" until it does. The selection
lives in the URL (`?path=/menu/submenu&view=single&impl=vue&dir=rtl`), so a view can be shared.

The scenarios come from `playground/src/scenarios/scenarios.ts`; `tests/playground-manifest.test.ts`
fails when a fixture adds or drops a route the manifest does not list.
