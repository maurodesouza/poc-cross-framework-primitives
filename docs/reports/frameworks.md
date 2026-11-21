# Five frameworks: the POC's answer (Epic E)

React, Vue, Svelte, Solid and Angular each have the six mandatory components (Dialog, Popover,
Menu with submenus, Combobox, Tabs, the calendar family), written from scratch per framework with
**no shared component core**. The five share only `@poc/dom` (framework-free DOM utilities), the
`spec/`, `@poc/styles` (Tailwind recipes) and the conformance suite.

- Data: [`data/`](data/) (`pnpm metrics --framework <name>`, all five regenerated on 2026-11-20
  after the last port). Per-framework reports: [react](react.md), [vue](vue.md),
  [svelte](svelte.md), [solid](solid.md), [angular](angular.md); the checkpoint after Vue:
  [checkpoint](checkpoint.md).
- The React and Vue reports keep their tables as of Epics B and C; the numbers here are the
  current ones (after D1 moved the overlay session and key maps into `@poc/dom`).

## The answer

**Yes, the model works for all five.** One spec, one DOM toolkit, one styling layer and one test
suite produced five implementations that behave the same, look the same to the pixel, and pass
tests that Base UI and React Aria fail, with no conformance test changed for any port. Porting
cost stays in the same band as the first implementation, not a fraction of it, and the cost is
driven by how far the framework's rendering model is from React's.

## 1. Same behaviour without a shared core: confirmed

| project | behaviour | contract | visual |
| --- | --- | --- | --- |
| `react` | 90 / 90 | 16 / 16 | 16 / 16 (the golden set, made in CI) |
| `vue` | 90 / 90 | 16 / 16 | 16 / 16 |
| `svelte` | 90 / 90 | 16 / 16 | 16 / 16 |
| `solid` | 90 / 90 | 16 / 16 | 16 / 16 |
| `angular` | 90 / 90 | 16 / 16 | 16 / 16 |
| `baseline` (Base UI 1.9, React Aria) | 79 / 90, 11 expected failures | not run | not run |

Visual results: React made the golden set in CI; Vue, Svelte and Solid passed against it in
their pull requests' CI; Angular passed against React's screenshots on the same machine
(`VISUAL=1`), and against the golden set in the Epic E pull request's CI. The local data files
record the visual layer as skipped.

## 2. Same UI from one styling layer: confirmed

Every port's 16 screens match React's golden screenshots. The recipes in `@poc/styles` select the
spec's `data-*` attributes only, so they never changed. What did need care was the **DOM itself**:
pixel equality needs the same elements and the same text-node runs.

| framework | what the fixture had to match |
| --- | --- |
| Vue | a template merges `{label} settings` into one text node; JSX makes two (`kit/text-runs.ts`) |
| Svelte | whitespace between tags becomes text nodes: markup glued as JSX renders it, `{#each}` for runs |
| Solid | nothing: JSX, like React (its portal adds two empty text nodes, which do not render) |
| Angular | a component's host element: attribute selectors so the host is one of React's elements; one `<ng-container>` per text run |

These are fixture concerns (how a consumer writes markup), not library bugs: a real app styled by
the recipes gets the same UI whatever the framework.

## 3. Sustainable porting: yes, but not "a fraction"

| | React | Vue | Svelte | Solid | Angular |
| --- | --- | --- | --- | --- | --- |
| agent minutes for the six components | ~17.7 | ~11 | ~12.8 | ~29 | ~34 |
| relative to React | 1.0 | 0.6 | 0.7 | 1.6 | 1.9 |
| component lines | 3298 | 3474 | 3265 | 3205 | 3291 |
| shared infrastructure lines | 372 | 419 | 332 | 387 | 524 |

Commit timestamps of agent runs: a proxy, not human time. React's run includes designing every
pattern; Angular's includes its spike.

- Vue and Svelte are cheap: their rendering is close to React's (a component tree, children
  functions as slots or snippets), and the port is a translation.
- Solid 2.0 and Angular cost more than React: **the framework's runtime model** is what a port
  pays for, not the components. Solid 2.0 is a new major whose rendering details (memo children,
  static `dynamic`, parent-first effects) had to be discovered; zoneless Angular renders state in
  a later task, and parts are directives on the consumer's elements instead of components.
- Lines barely move (3205–3474 per framework): the component logic has the same size everywhere,
  and the hard parts (`@poc/dom`, 1111 lines) are written once.

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
| any | `conformance/` | **nothing** (only `implementations.ts` registers each project) |

**Bugs fixed once**, in `@poc/dom` or the spec: every key map, the combobox stepping, the
submenu's safe area, the overlay lifecycle, the date math and the spec corrections of Epic A. No
port met a bug that also existed in React.

**Fixed N times**, because each lives in framework rendering, not in shared logic:

| issue | where it was fixed |
| --- | --- |
| focusing a calendar cell that mounts after the key moved to it | React, Vue (by design), Angular (`injectFlush`) |
| a calendar inside a closing picker taking focus back from the trigger | Solid, Angular (their effect order) |
| a controlled `inputValue` the consumer keeps unchanged | Solid, Angular (React re-asserts natively) |
| a controlled value a one-way binding keeps (Angular's `model()` wrote its own) | Angular |

The last one is a gap in the suite, not only a fix: no conformance test rejects an input change,
so Vue and Svelte were not checked for it. It belongs in the suite before the extras.

## 5. Quality: on the spec's terms, above the baseline

All five pass the 11 tests where Base UI and React Aria leave the APG-based specs. Sizes, minified
and gzipped with the framework external, against each framework's reference library:

| component | React | Base UI / RAC | Vue | Reka UI | Svelte | Bits UI | Solid | Kobalte | Angular | CDK / Aria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dialog | 3.6 | 23.4 | 3.7 | 11.6 | 4.7 | 16.6 | 4.1 | 9.6 | 4.4 | 16.0 |
| Popover | 10.9 | 40.2 | 11.1 | 22.1 | 12.8 | 32.2 | 12.1 | 19.4 | 12.4 | 14.2 |
| Menu | 12.6 | 60.2 | 12.6 | 28.0 | 14.9 | 40.1 | 14.0 | 30.4 | 14.5 | 8.0 |
| Combobox | 11.3 | 50.9 | 11.3 | 31.6 | 13.3 | 36.3 | 12.5 | 32.8 | 13.0 | 8.6 |
| Tabs | 2.5 | 13.3 | 2.4 | 7.9 | 3.3 | 8.0 | 2.9 | 11.5 | 3.0 | 5.5 |
| Calendar + Range | 4.5 | 25.8 | 4.5 | 22.3 | 5.8 | 26.3 | 5.0 | – | 5.4 | – |
| DatePicker + Range | 10.3 | 34.4 | 10.3 | 38.7 | 12.0 | 64.6 | 11.4 | – | 11.9 | – |

(kB.) React and Vue are measured with esbuild; Svelte, Solid and Angular with Vite and the
framework's plugin on both sides, so compare within a column pair. Not like for like: the
reference libraries carry more options; Kobalte targets Solid 1.9; Angular Aria's Menu and
Combobox have no positioning or layer stack, which is why they come out smaller than ours.

Pending: the manual screen reader spot check (VoiceOver or NVDA on Dialog, Menu, Combobox and
Calendar) has not been run by a person yet.

## Ergonomics

| framework | how a consumer writes it | reads natively? |
| --- | --- | --- |
| React | `<Dialog.Popup render={…} className={(state) => …}>` | yes, like Base UI |
| Vue | `<Dialog.Popup>`, `v-model:open`, `@open-change`, scoped slots for children functions | yes |
| Svelte | `<Dialog.Popup>`, `bind:open`, `{#snippet child({ props, state })}`, `{@attach}` for elements | yes |
| Solid | `<Dialog.Popup>`, `open={open()}`, `render={(props, state) => …}`, ref callbacks | yes, like Kobalte |
| Angular | `<div dialogPopup #popup="dialogPopup">` on the consumer's own element, `[(open)]`, `(openChangeDetails)`, `*dialogPortal`, `@for` over `body.weeks()` | yes, like Angular Aria and the CDK; it is a different shape from the four others |

In every framework the consumer styled through `data-*` alone and never needed a part's state in
code. Angular is the outlier by design: a directive per part is its `render`, so the anatomy is
the same but the call site is not.

## What remains for the extras (Epics F, G)

1. ~~Add a conformance test for a controlled value the consumer rejects (combobox input, then the
   extras' inputs), and check Vue and Svelte against it.~~ **Done in Epic F (#34)**:
   `/combobox/rejected-input` and `/dialog/rejected-close` (spec/README.md). React re-asserts a
   controlled `<input value>` natively; Solid (after `flush()`) and Angular (`controllable()`)
   already had their fix; Vue needed a re-assert after `nextTick` and Svelte a synchronous one in
   `Combobox.Input`. A kept `open: true` worked in all five, and in Base UI (no deviation). The
   Angular fixture's `FruitCombobox` took `inputValue` as an input and its change output, since
   `model()` writes its own value.
2. Run the screen reader spot check.
3. Part hooks for React and Vue (Angular has `inject*`; Svelte and Solid needed none so far).
4. The extras (Select, Tooltip, Checkbox, Slider) in all five, which test forms (hidden inputs),
   hover intent and pointer capture: areas the six components did not reach.
5. Watch the cost of the two expensive targets: the next Solid and Angular components should be
   cheaper now that their rendering model is mapped (`AGENTS.md` port checklist).
