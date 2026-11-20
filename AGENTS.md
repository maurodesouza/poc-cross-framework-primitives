# POC: cross-framework primitives

A proof of concept that answers one question:

> Can headless UI primitives written **from scratch for each framework** (React, Vue, Angular,
> Svelte, Solid) share **no component core**, only DOM utilities, a spec, a Tailwind styling layer
> and a conformance suite, and still deliver **the same behaviour and the same UI** in every
> framework, at a sustainable porting cost, with quality close to Base UI and React Aria?

The plan, the phases and the metrics are in [`docs/plan.md`](docs/plan.md). The results go in
`docs/reports/`.

| workspace | name | contains | depends on |
| --- | --- | --- | --- |
| `spec/` | (docs) | the source of truth: one spec per component (anatomy, API, states, keyboard, focus, scenarios) | |
| `packages/dom` | `@poc/dom` | framework-free DOM behaviours and pure math (positioning, layers, focus, scroll lock, inert, collection navigation, typeahead, presence, ids, direction, dates) | `@floating-ui/dom` only |
| `packages/styles` | `@poc/styles` | the Tailwind v4 theme (palette roles) and one class recipe per component part, keyed on `data-*` | none |
| `packages/<framework>` | `@poc/<framework>` | the primitives, written for that framework | `@poc/dom`; peer the framework |
| `fixtures/<implementation>` | private | one app per implementation (and `baseline-react` on Base UI / React Aria), rendering every spec scenario at `/<component>/<scenario>` | the implementation, `@poc/styles` |
| `conformance` | private | the Playwright suite: behaviour, contract and visual layers, run against every fixture | |

## Non-negotiable rules

These are the decisions of the planning (2026-11-20, Epics #4, #10, #14). Changing one is a
decision for the maintainer, not an implementation detail.

1. **No shared component core.** Each framework package owns its components' state, lifecycle and
   API. What is shared is the spec, `@poc/dom`, `@poc/styles` and the conformance suite. This is
   the hypothesis under test: never work around it by moving component logic into a shared
   package.
2. **The `@poc/dom` boundary.** `@poc/dom` holds framework-free DOM behaviours and pure math only:
   functions and small classes that take elements and options, and return values or a cleanup.
   - It never holds a component's open/selected/value state, its lifecycle or its API.
   - It never imports a framework (a guard test enforces it).
   - Its only runtime dependency is `@floating-ui/dom`.
   - When an implementation needs something that would cross the boundary, keep it in the
     framework package and **record the pressure** in the Epic's report: it is the key data of the
     checkpoint.
3. **The spec is the source of truth.** `spec/<component>.md` defines the anatomy, the API, the
   states, the keyboard, the focus and the scenarios. A change in behaviour starts as a spec
   change (with its reason), then the tests, then the implementations.
4. **The conformance suite is the referee.** The same tests run against every implementation.
   - **Behaviour** layer: roles, accessible names, ARIA, keyboard, focus, dismissal, axe. It also
     runs against the baseline (Base UI, and React Aria for the calendar).
   - **Contract** layer: the part and state attributes of the spec.
   - **Visual** layer: one golden set of screenshots, made by React; every other framework
     compares against it, pixel for pixel. Fix the implementation's DOM, never the snapshots.
   - A test is never weakened for one implementation. A deviation of the baseline is recorded in
     the spec and marked on that test for the baseline only.
5. **The primitive contract** (Fragiola guidelines, `components/primitives.md`):
   - one namespace per component (`Dialog.Root`, `Dialog.Trigger`, ...), part hooks as the lower
     layer;
   - `render`, never `asChild`: `render={<section />}` merges the primitive's props into the
     element, `render={(props, state) => ...}` receives them plus the state (each framework
     expresses this as the spec's API mapping table says);
   - `ref` is a plain prop (React 19); arbitrary props are forwarded, handlers compose internal
     first, then the consumer's;
   - `className` and `style` take a value or a function of the state;
   - inline style is structural only (position, size, `display`, transforms for positioning);
     nothing cosmetic;
   - state only through `data-*` and ARIA; a boolean `data-*` is present or absent, never
     `"false"`;
   - every element carries its part attribute, `data-<component>-part` (`data-dialog-part="popup"`,
     `data-menu-part="item"`, `data-calendar-part="cell"`);
   - **no text and no accessible names**: primitives render only their children and set no
     `aria-label` of their own. The one recorded exception is the calendar's locale data (month,
     weekday and date names from `Intl`), which the consumer can still replace
     (`spec/README.md`);
   - sides are logical (`start`/`end`), never `left`/`right`.
6. **No Fragiola model API.** Primitives use controlled and uncontrolled props
   (`value`/`defaultValue`/`on<Value>Change` in React, `v-model` in Vue, `model()` in Angular,
   `$bindable` in Svelte, props and callbacks in Solid), as the spec's API mapping table says.
7. **No core + adapters.** The Fragiola rule that every non-rendering piece of logic lives in a
   framework-free core does not apply here, by design (rule 1).
8. **Dates** are a plain `{ year, month, day }` value with no time zone. No external date
   library: the date math lives in `@poc/dom` (`date/`), the locale comes from `Intl`.
9. **References are read, not vendored.** The upstream repositories under
   `~/organizations/fragiola/references/` (base-ui, radix-ui, react-aria-ui, wai-aria-practices,
   floating-ui, headlessui, zag, ark, reka-ui, bits-ui, next-gen (Melt), kobalte,
   angular-components, spartan, webawesome) inspire freely. Code ported near-verbatim starts with
   a header naming the project, the upstream file and its licence:
   `// Adapted from <project> (<repo path>), <licence>.`. Code reused from a Fragiola project
   carries `// Adapted from <project> (fragiola/<repo>, <path>), same author and licence.`
10. **Nothing is published.** The packages are private workspaces: no npm release, no docs site.

## Source layout

From the Fragiola guidelines (`repository.md#source-layout`). `pnpm check` runs `check:layout`
(`scripts/check-layout.ts`, tested by `tests/check-layout.test.ts`), which fails on a tracked name
that is not kebab-case and on a non-entry file at the root of a package's `src/`.

- **Every file and folder name is kebab-case**, whatever it exports: `dialog-popup.tsx`,
  `use-controllable-state.ts`, `menu-item.vue`. The file name is the kebab-case of its main export
  (`DialogPopup` → `dialog-popup`). Tool suffixes stay (`.test.ts`, `.d.ts`, `.directive.ts`). The
  only exceptions are names a tool fixes (`README.md`, `AGENTS.md`, `LICENSE`, `index.html`,
  `package.json`, ...).
- **A package's `src/` is never flat.** Its root holds only its entry (`index.ts`, or
  `public-api.ts` in Angular). Everything else lives in a folder named after what it holds:

  | package | folders |
  | --- | --- |
  | `dom` | one folder per responsibility: `positioning/`, `layers/`, `focus/`, `scroll-lock/`, `inert/`, `collection/`, `presence/`, `pointer/`, `id/`, `direction/`, `date/` |
  | `styles` | `recipes/`, `theme/` |
  | `react`, `solid` | `components/<component>/`, `hooks/`, `utils/` |
  | `vue` | `components/<component>/`, `composables/`, `utils/` |
  | `svelte` | `components/<component>/`, `utils/` |
  | `angular` | `lib/directives/<component>/`, `lib/inject/`, `lib/utils/` |

- **One public component, hook or function per file**, with its types beside it. A component's
  namespace lives in `components/<component>/parts.ts`.
- **A primitive has the same file name in every framework** (`dialog-popup.tsx`,
  `dialog-popup.vue`, `dialog-popup.svelte`, `dialog-popup.directive.ts`).
- **No barrel files inside the folders.** An entry imports each module directly.
- Internal helpers follow the `utils-implementation` conventions; the public API of `@poc/dom` is
  one tree-shakeable export per file.

## Toolchain

| tool | version |
| --- | --- |
| Node | >= 24 |
| pnpm | 12 (`packageManager` pinned) |
| TypeScript | 7 at the root (strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) |
| TypeScript 6.0.3 | pinned only in the workspaces whose tools need it: the Angular compiler (`>=6.0 <6.1`), vue-tsc, the Svelte tools; as Dockable and Splitter do |
| React | 19.3 |
| Vue | 3.5 |
| Angular | 22 (standalone, signals, zoneless) |
| Svelte | 5 (runes) |
| Solid | 1.9 (2.0 shipped on 2026-11-17, but the stable `vite-plugin-solid` still peers `solid-js ^1.7`) |
| Vite | 8 |
| Tailwind CSS | 4.3 (fixtures and `@poc/styles` only) |
| Vitest | 5 |
| Playwright | 1.65 (Chromium) |
| Biome | 2.6 |
| tsdown | packages build |

**Pin dependencies to exact versions published at least 7 days ago** (`npm view <pkg> time`), and
check the current version on the registry when installing.

## Scripts

| script | does |
| --- | --- |
| `pnpm check` | Biome lint and format check, then `check:layout` |
| `pnpm check:fix` | Biome with fixes |
| `pnpm typecheck` | the root's TypeScript (scripts, tests), then every workspace's `typecheck` |
| `pnpm test` | Vitest: the repo's own tests and every workspace with a Vitest config |
| `pnpm build` | every workspace's `build` |
| `pnpm e2e` | the conformance suite (`conformance/`) |

## CI

`.github/workflows/ci.yml` runs on pull requests and on a manual run:

- **Checks**: `pnpm check`, `typecheck`, `test`, `build`.
- **E2E** (from the conformance suite on): the Playwright suite in
  `mcr.microsoft.com/playwright:v<version>-noble`, `<version>` being the exact pinned
  `@playwright/test`. No `playwright install` in CI. `tests/ci-workflow.test.ts` ties the tag to
  the pinned version.

Pushing a change under `.github/workflows/` needs a token with the `workflow` scope, or a push
over SSH (this repository's `origin` uses SSH).

## Conventions

- Biome: 4-space indent, double quotes, LF, organized imports.
- Commits: gitmoji-conventional (`✨ feat(react): ...`, `🐛 fix(dom): ...`, `✅ test(conformance): ...`,
  `🔧 chore: ...`, `📝 docs(spec): ...`).
- Branches `<type>/epic-<n>-<short-description>`; worktrees under `.worktrees/`.
- Code, docs, issues, pull requests and commit messages in English.
- Every rule a reviewer would otherwise have to remember is a test (guard tests, contract tests).
