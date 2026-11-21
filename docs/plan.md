# POC plan

Decided on 2026-11-20. Status at the end of this page.

## The question

Can headless UI primitives written **from scratch for each framework** share **no component
core**, only DOM utilities, a spec, a Tailwind styling layer and a conformance suite, and still
deliver the same behaviour and the same UI in React, Vue, Angular, Svelte and Solid?

If yes, Fragiola can offer its UI (today React-only, on Base UI) in every framework, with
primitives of its own that fill the gaps Base UI leaves (a date picker first of all).

## Hypotheses

1. **Same behaviour without a shared core.** A written spec plus a shared conformance suite keep
   five independent implementations equivalent (keyboard, focus, ARIA).
2. **Same UI from one styling layer.** One set of Tailwind recipes keyed on the spec's `data-*`
   attributes gives pixel-identical results in every framework.
3. **Sustainable porting.** Once a component exists in one framework, porting it costs a fraction
   of the first implementation, because the hard parts live in `@poc/dom` and in the spec.
4. **Bounded duplication.** The behaviour that has to be fixed N times (once per framework) stays
   small; most bugs are fixed once, in `@poc/dom`.
5. **Quality.** The result is close to Base UI and React Aria on accessibility and edge cases.

## Components

| component | why it is in | phase |
| --- | --- | --- |
| Dialog | focus trap, return focus, scroll lock, `inert`, portal, Escape | mandatory |
| Popover | positioning, layer stack (a popover in a dialog), outside press, non-trapping focus | mandatory |
| Menu (with submenu) | roving focus, typeahead, submenu and its safe hover area, item collections | mandatory |
| Combobox | virtual focus (`aria-activedescendant`), consumer filtering, a positioned list | mandatory |
| Tabs | the simple baseline: activation modes, orientation, RTL | mandatory |
| Calendar, RangeCalendar, DatePicker | 2D grid navigation, ranges, dates and locale, composed with Popover | mandatory |
| Select | forms (hidden input), listbox, item aligned with the trigger | extra |
| Tooltip | hover intent, delay groups, touch, `aria-describedby` | extra |
| Checkbox, CheckboxGroup | forms, indeterminate, controlled and uncontrolled | extra |
| Slider | pointer capture, several thumbs, steps, RTL | extra |

Toast is out (it needs a global store: a different problem).

## Frameworks

React 19, Vue 3.5, Angular 22 (standalone, signals, zoneless), Svelte 5 (runes), Solid 1.9.

## Shared pieces

- `spec/`: the source of truth for every component.
- `packages/dom` (`@poc/dom`): framework-free DOM behaviours and pure math, never component state
  (AGENTS.md rule 2).
- `packages/styles` (`@poc/styles`): the Tailwind v4 theme with the Fragiola palette roles, and a
  class recipe per part. Each fixture applies them through thin styled wrappers, as a per-framework
  Fragiola UI would.
- `conformance/`: the Playwright suite (behaviour, contract, visual), run against every fixture,
  and its behaviour layer against the baseline.

## Phases

| Epic | content | status |
| --- | --- | --- |
| A (#4) | foundation: monorepo, rules, specs of the six mandatory components, conformance suite, Base UI / React Aria baseline | done |
| B (#10) | React reference: `@poc/dom`, `@poc/styles`, `@poc/react`, golden screenshots, metrics script, React report | done |
| C (#14) | Vue port of the six components, then **the checkpoint report** | done |
| checkpoint | the maintainer decides from `docs/reports/checkpoint.md`: continue, pivot (for example a Zag-like shared state core) or stop | continue (2026-11-20) |
| D (#24) | Svelte and Solid (2.0) ports | done |
| E (#29) | Angular port and the five-framework report | done |
| F (#38) | the extras' yardstick (specs, tests, Base UI baseline), React and Vue | done |
| G (#43) | the extras in Svelte, Solid and Angular, and the final report | done |
| manual | the screen reader spot check (`docs/reports/screen-readers.md`): needs a person | pending |

Nothing after Epic C was planned or started before the checkpoint decision.

## Metrics

Collected by `pnpm metrics --framework <name>` (Epic B on) into `docs/reports/data/<name>.json`,
and written up in `docs/reports/<name>.md`:

- **Lines of code** per component: the share in `@poc/dom` (the modules the component imports)
  and the share in the framework package.
- **Porting time** per component and framework, from commit timestamps. These are agent runs: a
  proxy, not human time.
- **Changes the port needed** in `@poc/dom` or in a spec, each with its reason.
- **Bugs** fixed once (in `@poc/dom` or the spec) vs fixed N times (once per framework).
- **Conformance**: pass rate per layer (behaviour, contract, visual) and implementation.
- **Bundle size** per component (minified and gzipped, framework external), against Base UI
  (React), Reka UI (Vue), Bits UI (Svelte), Kobalte (Solid) and Angular CDK / Angular Aria where
  they have an equivalent.
- **Screen readers**: a manual spot check (VoiceOver or NVDA) on Dialog, Menu, Combobox,
  Calendar, Select and Slider, as a checklist with findings.
- **API ergonomics**: does the API read natively in each framework?
- **Boundary pressure**: every time component logic wanted to move into `@poc/dom`.

## Out of scope

SSR beyond a hydration smoke test, a docs site, npm publishing, Toast, the segmented date field,
and the event calendar (a display calendar in Fragiola UI and the `@fragiola/calendar` library
are separate, later projects).

## Status

- 2026-11-20: plan decided; Epics A (#4), B (#10) and C (#14) published.
- 2026-11-20: Epic A done. The behaviour layer (90 tests) passes on the baseline, with 9 recorded
  deviations (3 in Base UI's Dialog and Popover, 2 in its Combobox, 4 in React Aria's calendar).
  Writing the tests corrected the first draft of the specs where it had left the APG (disabled
  items stay focusable in menus, tabs and listboxes; combobox arrows return to the input).
- 2026-11-20: Epic B done. `@poc/react` passes the behaviour (90) and contract (16) layers for the
  six components, the 11 tests the baseline fails included. Report: `docs/reports/react.md`.
- 2026-11-20: Epic C done. `@poc/vue` passes every layer with no test changed, pixel-identical to
  React, at about 60% of React's effort. **Checkpoint**: `docs/reports/checkpoint.md` recommends
  continuing with adjustments; nothing after Epic C starts before the maintainer decides.
- 2026-11-20: checkpoint decided: continue with Epics D (#24) and E (#29), Solid 2.0, part hooks
  only where a framework's API needs them, the screen reader check stays a manual spot check.
- 2026-11-20: Epic D done. `@poc/svelte` and `@poc/solid` pass every layer with no test changed,
  pixel-identical to React. Before them, the overlay lifecycle and the Tabs and Menu key maps
  moved into `@poc/dom` (`openOverlaySession`, `tabsKeyTarget`, `menuKeyTarget`). Reports:
  `docs/reports/svelte.md`, `docs/reports/solid.md`.
- 2026-11-20: Epic E done. `@poc/angular` (Angular 22, zoneless, a directive per part) passes
  every layer with no test changed, pixel-identical to React. Reports: `docs/reports/angular.md`
  and `docs/reports/frameworks.md` (the five frameworks against the five hypotheses).
- 2026-11-21: Epic F done. A rejected controlled value is now tested (Vue and Svelte needed a
  re-assert in `Combobox.Input`). Select, Tooltip, Checkbox and CheckboxGroup, and Slider are
  specified, tested against Base UI 1.9 (6 recorded deviations), and built in React (the golden
  screenshots) and Vue (pixel-identical), with five new `@poc/dom` folders' worth of behaviour
  (`pointer/` drag and hover bridge, `hover/`, `range/`, `form/`). No part hook was needed.
  Svelte, Solid and Angular mark the extras as pending until Epic G. Reports: the "Extras"
  sections of `docs/reports/react.md` and `docs/reports/vue.md`.
- 2026-11-21: Epic G (#43) done. `@poc/svelte`, `@poc/solid` and `@poc/angular` have the extras,
  pass every layer for all ten components with no test changed for a port, and match React's
  golden screenshots. Before them, the tooltip's hover tracking moved into `@poc/dom`
  (`trackHoverBridge`), React and Vue moved onto it. The extras cost 0.4–0.9 of React's effort
  (Solid 0.9 and Angular 0.6, down from 1.6 and 1.9). Svelte's dev-mode update loop in Tabs is
  fixed (#44), and the flaky baseline Select test waits for each highlight. Reports:
  `docs/reports/frameworks.md` (the final comparison), `docs/reports/final.md` (the verdict and a
  recommendation for Fragiola). **Remaining**: the screen reader spot check, which needs a person
  (`docs/reports/screen-readers.md`), then the maintainer's decision.
