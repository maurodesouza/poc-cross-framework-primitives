# Five frameworks, ten components: the comparison (Epics E, G)

React, Vue, Svelte, Solid and Angular each have the ten components of the POC: the six mandatory
ones (Dialog, Popover, Menu with submenus, Combobox, Tabs, the calendar family: Calendar,
RangeCalendar, DatePicker, DateRangePicker) and the four extras (Select, Tooltip, Checkbox with
CheckboxGroup, Slider). Each is written from scratch per framework with **no shared component
core**. The five share only `@poc/dom` (framework-free DOM utilities), the `spec/`, `@poc/styles`
(Tailwind recipes) and the conformance suite.

- Data: [`data/`](data/) (`pnpm metrics --framework <name>`). All five were regenerated on
  2026-11-21 (Epic G), after a full local run of the suite on all six projects. Per-framework
  reports: [react](react.md), [vue](vue.md), [svelte](svelte.md), [solid](solid.md),
  [angular](angular.md). The checkpoint after Vue is in [checkpoint](checkpoint.md), and the
  verdict in [final](final.md).
- The per-framework reports keep their tables as of their own Epic. The numbers here are the
  current ones.

## The answer

**Yes, the model works for all five, on all ten components.** One spec, one DOM toolkit, one
styling layer and one test suite produced five implementations:

- They behave the same and look the same to the pixel.
- They pass the 17 tests where Base UI and React Aria leave the specs.
- No conformance test was changed for any port.

Porting cost was in the same band as the first implementation for the six mandatory components.
For the extras it fell to **0.4–0.9 of React's**. Solid and Angular were the most expensive
targets in Epics D and E, and the drop was largest for them. Once the port checklist mapped a
framework's rendering model, the cost of a new component was mostly translation.

## 1. Same behaviour without a shared core: confirmed

| project | behaviour | contract | visual |
| --- | --- | --- | --- |
| `react` | 140 / 140 | 24 / 24 | 24 / 24 (the golden set, made in CI) |
| `vue` | 140 / 140 | 24 / 24 | 24 / 24 |
| `svelte` | 140 / 140 | 24 / 24 | 24 / 24 |
| `solid` | 140 / 140 | 24 / 24 | 24 / 24 |
| `angular` | 140 / 140 | 24 / 24 | 24 / 24 |
| `baseline` (Base UI 1.9, React Aria) | 123 / 140, 17 expected failures | not run | not run |

The local data files record the visual layer as skipped: it runs in CI (`VISUAL=1` locally).

- React made the golden set in CI: the six mandatory components in Epic B, the extras in Epic F.
- Vue matched it in Epics C and F.
- Svelte, Solid and Angular matched it on the six in Epics D and E, and on the extras in the
  Epic G pull request's CI.
- Before that CI run, each Epic G port also matched React screenshots made on the same machine,
  in a scratch folder, with the committed goldens untouched.

## 2. Same UI from one styling layer: confirmed

Every port's 24 screens match React's golden screenshots. The recipes in `@poc/styles` select the
spec's `data-*` attributes only, so they never changed for a port. What did need care was the
**DOM itself**: pixel equality needs the same elements and the same text-node runs.

| framework | what the fixture had to match |
| --- | --- |
| Vue | a template merges `{label} settings` into one text node; JSX makes two (`kit/text-runs.ts`). Extras: each label glued to its checkbox |
| Svelte | whitespace between tags becomes text nodes: markup glued as JSX renders it, `{#each}` for runs. Extras: the same gluing; the checkbox indicator drawn through the `child` snippet |
| Solid | nothing: JSX, like React (its portal adds two empty text nodes, which do not render) |
| Angular | a component's host element: attribute selectors so the host is one of React's elements; one `<ng-container>` per text run. Extras: hidden inputs created by the directives next to their anchor, so no template element is added |

These are fixture concerns (how a consumer writes markup), not library bugs. A real app styled by
the recipes gets the same UI in every framework. The extras added one new kind of element, the
**hidden form input**. In every framework it is structural only
(`VISUALLY_HIDDEN_INPUT_STYLE` from `@poc/dom`), and it changed no pixel.

## 3. Sustainable porting: yes, and cheaper once the model is mapped

Agent minutes from commit timestamps: a proxy, not human time.

| | React | Vue | Svelte | Solid | Angular |
| --- | --- | --- | --- | --- | --- |
| the six mandatory components (Epics B–E) | ~17.7 | ~11 | ~12.8 | ~29 | ~34 |
| relative to React | 1.0 | 0.6 | 0.7 | 1.6 | 1.9 |
| the extras (Epics F, G) | ~16 | ~6 | ~7 (+3 dev-mode check) | ~14 | ~10 |
| relative to React | 1.0 | 0.4 | 0.4 | 0.9 | 0.6 |
| component lines, all ten | 5123 | 5336 | 5101 | 4934 | 5007 |
| of which the extras | 1825 | 1859 | 1824 | 1729 | 1716 |
| shared infrastructure lines | 377 | 424 | 344 | 400 | 569 |

- **React's extras include designing them**: `@poc/dom`'s new modules, the `@poc/styles` recipes
  and the patterns the other four copied. Each later column is a port.
- **The Svelte, Solid and Angular extras ran as three agents at the same time**, each in its own
  worktree, on one machine. Their minutes are each agent's own, from its first change to a green
  suite. Contention could only have made them slower.

**Did Solid and Angular get cheaper?** Yes, clearly. This was item 5 of the Epic E report's "What
remains".

- **Solid** went from 1.6× React to 0.9×. Epic D's lessons were applied from the first line:
  memo parts, static `dynamic()`, `untrack` seeding and `flush()` after writes. Every extra
  passed the suite on its first run. Its one real bug, in the slider, was caught by Solid 2's
  own dev diagnostics, not by the suite (`EFFECT_WRITES_OWN_SOURCE`, [solid.md](solid.md)).
- **Angular** went from 1.9× to 0.6×. The checklist covered what cost most in Epic E:
  - `injectFlush` for key- and drag-driven renders, which also handled slider pointer capture in
    zoneless Angular, the risk the Epic named;
  - inputs plus `*Change` outputs instead of `model()`;
  - structural portals.

  No test failed on the first run.

**What a port still pays for** is the framework's runtime model, as in Epic E. It is now paid
once per framework, in the checklist, instead of once per component.

- **Lines barely move** (4934–5336 for ten components). The component logic has the same size
  everywhere, and the hard parts are written once in `@poc/dom` (1479 lines, up from 1111 with
  the extras' modules).
- **The `@poc/dom` share per component is the same in every framework**, since all five import
  the same modules. For example, Select is about 40%, Tooltip 41–44% and Slider 30% (the
  data files' "share in @poc/dom").

## 4. Bounded duplication: yes, with the residue now known

Every change a port made outside its own package and fixture:

| port | where | change |
| --- | --- | --- |
| Vue | `@poc/dom` | calendar key map, combobox stepping (`calendarKeyTarget`, `stepThroughNone`), React moved onto them |
| Vue | `spec/README.md` | focus targets also take a getter |
| before Svelte (D1) | `@poc/dom` | the overlay session and the Tabs and Menu key maps (`openOverlaySession`, `tabsKeyTarget`, `menuKeyTarget`, `submenuKeys`), React and Vue moved onto them |
| Svelte | `spec/README.md` | element references are attachments (`{@attach}`) |
| Solid | `spec/README.md` | the Solid column (value `open`, ref callbacks, getters) |
| Angular | `spec/README.md` | the Angular column, the portal row, getters for every framework |
| Angular | `AGENTS.md` | port checklist item 8: a key that moves focus renders before the next key |
| Angular | `pnpm-workspace.yaml` | build-script and TypeScript 6.0.3 settings for the Angular toolchain |
| Vue (F) | `conformance/` helpers | axe and the Select geometry wait for running animations (every implementation) |
| before Svelte (G) | `@poc/dom` | the tooltip's hover tracking (`trackHoverBridge`), React and Vue moved onto it |
| Svelte, Solid, Angular (G) | anything shared | **nothing** |
| any | `conformance/` tests | **nothing** for a port. Epic G made the Select typeahead test wait for each highlight, because the baseline was flaky (see below) |

**Boundary pressure in the extras.** Epic F flagged one candidate before Epic G: the tooltip's
hover tracking, about 25 lines in each package.

- **It moved into `@poc/dom`** as `trackHoverBridge(trigger, popup, { inside, outside })`, before
  the three ports.
  - It is a listener that reports each pointer move as inside or outside the hover bridge, and
    returns its cleanup.
  - It holds no open state and decides nothing. The framework maps inside/outside onto its hover
    intent, so the function stays inside the boundary (AGENTS.md rule 2).
  - React and Vue use it too. Each Epic G port then wrote three lines instead of twenty-five.
- **The Escape listener stays** in each package (about 12 lines). It closes this tooltip with a
  reason, and that is component behaviour. The same listener stays in every overlay of the POC.
- **Two candidates stay in the framework packages, by the boundary rule:**
  - CheckboxGroup's membership and parent state is component state;
  - the slider's number-or-array value shape is API.

  Both are now written five times. They are small (CheckboxGroup is 83–136 lines; the slider's
  value shape is a few lines of its root) and they never needed a fix after React.
- **No Epic G port needed a `@poc/dom` change.**

**Bugs fixed once**, in `@poc/dom` or the spec:

- every key map, the combobox stepping, the submenu's safe area, the overlay lifecycle, the date
  math and the spec corrections of Epic A;
- for the extras: the range math (steps, `minStepsBetweenValues`, pushing between thumbs), the
  drag session, hover intent and the delay group, and the form bridge.

No port met a bug that also existed in React.

**Fixed N times**, because each lives in framework rendering, not in shared logic:

| issue | where it was fixed |
| --- | --- |
| focusing a calendar cell that mounts after the key moved to it | React, Vue (by design), Angular (`injectFlush`) |
| a calendar inside a closing picker taking focus back from the trigger | Solid, Angular (their effect order) |
| a controlled `inputValue` the consumer keeps unchanged (#34) | Vue, Svelte (re-assert); Solid, Angular had it already; React natively |
| a controlled value a one-way binding keeps (Angular's `model()` wrote its own) | Angular |
| **late form reset**: `bridgeForm` reports a reset after the browser restored the controls; a state that is already the default does not re-run the binding, so the component writes its state back onto the hidden input | React, Vue (Epic F), Svelte, Solid, Angular (Epic G): five times, a few lines each |
| an effect that reads the state it writes: Svelte's Tabs (`effect_update_depth_exceeded`, #44), Svelte's CheckboxGroup ids and slider thumbs, Solid's slider thumbs (caught by its dev diagnostics) | Svelte, Solid |
| `VISUALLY_HIDDEN_INPUT_STYLE` in the framework's style format (CSS text in Svelte, CSS names in Solid, an element created by the directive in Angular) | Svelte, Solid, Angular |

**The suite's blind spot: dev-mode diagnostics.** The suite serves production builds, which do
not raise these dev-mode errors and warnings:

- Svelte's `effect_update_depth_exceeded` (#44) and `assignment_value_stale`;
- Solid's `EFFECT_WRITES_OWN_SOURCE`.

Epic G fixed them all by loading every route in `vite` dev mode, but nothing guards against them
coming back. A production version needs a dev-mode smoke run that fails on any console error.

## 5. Quality: on the spec's terms, above the baseline

All five pass the 17 tests where Base UI and React Aria leave the APG-based specs (11 in the six
mandatory components, 6 in the extras; each is recorded in its spec's "Baseline deviations").

**The flaky baseline test.** "select / basic › typeahead, Home and End" failed once in each of
PR #46's two CI runs, then passed on retry.

- **Cause:** Base UI settles its open highlight (the selected option) a frame late, so a Home sent
  before then was overridden.
- **Fix:** the test now waits for the highlighted option (`data-highlighted`) after the
  typeahead, on open and after Home. That is an extra assertion for every implementation, not a
  weaker one for the baseline.
- **Verification:**
  - the fixed test passed `--repeat-each 20` on baseline, React and Vue;
  - the old test never failed locally (400 runs on 48 workers, and 80 runs at 25× CPU
    throttling), so CI is where the fix is confirmed.

Sizes, minified and gzipped with the framework external, against each framework's reference
library:

| component | React | Base UI / RAC | Vue | Reka UI | Svelte | Bits UI | Solid | Kobalte | Angular | CDK / Aria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dialog | 3.6 | 23.4 | 3.7 | 11.6 | 4.7 | 16.6 | 4.1 | 9.6 | 4.4 | 16.0 |
| Popover | 10.9 | 40.2 | 11.1 | 22.1 | 12.8 | 32.2 | 12.1 | 19.4 | 12.4 | 14.2 |
| Menu | 12.6 | 60.2 | 12.6 | 28.0 | 14.9 | 40.1 | 14.0 | 30.4 | 14.5 | 8.0 |
| Combobox | 11.3 | 50.9 | 11.4 | 31.6 | 13.3 | 36.3 | 12.5 | 32.8 | 13.0 | 8.6 |
| Tabs | 2.5 | 13.3 | 2.4 | 7.9 | 3.4 | 8.0 | 2.9 | 11.5 | 3.0 | 5.5 |
| Calendar + Range | 4.5 | 25.8 | 4.5 | 22.3 | 5.8 | 26.3 | 5.0 | – | 5.4 | – |
| DatePicker + Range | 10.3 | 34.4 | 10.3 | 38.7 | 12.0 | 64.6 | 11.4 | – | 11.9 | – |
| Select | 11.8 | 44.5 | 11.9 | 29.3 | 14.2 | 36.9 | 13.4 | 30.9 | 13.8 | 8.6 |
| Tooltip | 10.4 | 33.3 | 10.4 | 20.5 | 12.1 | 33.7 | 11.5 | 16.0 | 11.9 | – |
| Checkbox | 1.9 | 8.1 | 1.9 | 9.2 | 2.8 | 7.7 | 2.6 | 4.8 | 3.0 | – |
| CheckboxGroup | 1.1 | 4.2 | 0.9 | 4.6 | 1.5 | – | 1.3 | – | 1.1 | – |
| Slider | 3.4 | 14.4 | 3.2 | 7.8 | 4.3 | 11.1 | 3.8 | 9.0 | 3.7 | – |

(kB.) Notes on the measurements:

- **Tools.** React and Vue are measured with esbuild. Svelte, Solid and Angular are measured with
  Vite and the framework's plugin, on both sides. Compare within a column pair.
- **Not like for like.** The reference libraries carry more options.
  - Kobalte targets Solid 1.9.
  - Angular Aria's Menu, Combobox and Select have no positioning or layer stack, which is why they
    come out smaller than ours. Its Select is its Combobox in read-only mode over a Listbox.
  - Angular CDK and Aria have no tooltip, checkbox or slider.
- **Bits UI's group** is part of its Checkbox namespace (`Checkbox.Group`), measured with the
  checkbox. Kobalte has no checkbox group.
- **Angular's Checkbox entry** imports every `Checkbox*` directive, so it includes the group
  directive (1.1 kB).

**Pending:** the manual screen reader spot check, on Dialog, Menu, Combobox, Calendar, Select and
Slider. The checklist is ready for a person in [screen-readers.md](screen-readers.md).

## Ergonomics

| framework | how a consumer writes it | reads natively? |
| --- | --- | --- |
| React | `<Dialog.Popup render={…} className={(state) => …}>`; `<Select.Root items value onValueChange>` | yes, like Base UI |
| Vue | `<Dialog.Popup>`, `v-model:open`, `@open-change`, scoped slots for children functions; `v-model:value`, `v-model:checked` | yes |
| Svelte | `<Dialog.Popup>`, `bind:open`, `{#snippet child({ props, state })}`, `{@attach}` for elements; `bind:value`, `bind:checked`, function bindings for a refused value | yes |
| Solid | `<Dialog.Popup>`, `open={open()}`, `render={(props, state) => …}`, ref callbacks; `value` / `onValueChange` | yes, like Kobalte |
| Angular | `<div dialogPopup #popup="dialogPopup">` on the consumer's own element, `[(open)]`, `(openChangeDetails)`, `*dialogPortal`, `@for` over `body.weeks()`; structural indicators (`*checkboxIndicator`, `*selectItemIndicator`) | yes, like Angular Aria and the CDK; it is a different shape from the four others |

In every framework the consumer styled the components through `data-*` alone. A consumer never
needed a part's state in code.

**Forms** work the same way in all five, through hidden inputs and `FormData`, `required` and
reset included. Angular is the outlier by design: a directive per part is its `render`, so the
anatomy is the same but the call site is not. A `ControlValueAccessor`, so the Angular components
work with Angular forms, is a follow-up for a production version.

**Part hooks.** None was needed in any framework, for any of the ten components.

- Every part reads its root's context (or its item's).
- Angular's `inject*` functions are the only lower layer, and only because a directive cannot
  receive a context the way a child component does.
- Epic G added no part hook.

## What remains

1. **The screen reader spot check**, which needs a person. It is ready in
   [screen-readers.md](screen-readers.md).
2. **A dev-mode smoke run** that fails on any console error (section 4).
3. **Angular forms integration** (`ControlValueAccessor`).
4. **The maintainer's decision**, for which the evidence is in [final.md](final.md).
