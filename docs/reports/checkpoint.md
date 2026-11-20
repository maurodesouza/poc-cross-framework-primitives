# Checkpoint: after React and Vue (Epic C)

**Recommendation: continue as planned (Svelte and Solid next, then Angular), with three
adjustments** listed at the end. The data says the model works for two frameworks: the same spec,
utilities, styles and suite produced two independent implementations that behave and look the
same, and the second one cost about 60% of the first.

What the maintainer decides from this page:

1. Go on with Epics D (Svelte, Solid) and E (Angular), outlined below, or stop here.
2. Solid 1.9 or 2.0 for Epic D (2.0 shipped on 2026-11-17; its stable Vite plugin was not ready
   when the plan was made).
3. Whether part hooks (the contract's lower layer, deferred so far) become part of the POC.
4. Whether to run the screen reader spot check now (it needs a person; checklist in
   [`react.md`](react.md)).

## The question

Can headless UI primitives written from scratch for each framework share **no component core**,
only DOM utilities, a spec, a styling layer and a conformance suite, and still deliver the same
behaviour and the same UI, at a sustainable porting cost, with quality close to Base UI and React
Aria? Data: [`react.md`](react.md), [`vue.md`](vue.md), [`data/`](data/).

## Results by hypothesis

### 1. Same behaviour without a shared core: confirmed for two frameworks

| project | behaviour | contract | visual |
| --- | --- | --- | --- |
| `react` | 90 / 90 | 16 / 16 | 16 / 16 (CI, golden set) |
| `vue` | 90 / 90 | 16 / 16 | 16 / 16 (against the golden set) |
| `baseline` (Base UI, React Aria) | 79 / 90, 11 expected failures | not run | not run |

Vue passed every test with **no conformance test changed**. Both pass the 11 behaviour tests the
baseline fails (its recorded deviations from the APG-based specs).

### 2. Same UI from one styling layer: confirmed

All 16 screens of the visual layer are pixel-identical between React and Vue (same machine), and
Vue passes against the golden set React made in CI. The recipes in `@poc/styles` select state
through `data-*` only: neither fixture needed a `className` function of the state.

### 3. Sustainable porting: yes, about 60% of the first implementation

| | React (first) | Vue (port) |
| --- | --- | --- |
| component code (7 folders) | 3,334 lines | 3,522 lines (+6%) |
| shared framework infrastructure | 372 lines | 419 lines |
| `@poc/dom` reused | 973 lines in all | the same 973 |
| agent time for the components | ~17.7 min | ~11 min (~62%) |

Per component (lines in the framework package / `@poc/dom` it uses):

| component | React | Vue | `@poc/dom` | share in `@poc/dom` |
| --- | --- | --- | --- | --- |
| dialog | 272 | 272 | 233 | 46% |
| popover | 376 | 366 | 417 | 53% |
| menu | 750 | 780 | 471 | 38% |
| combobox | 543 | 591 | 334 | 36–38% |
| tabs | 366 | 416 | 63–79 | 15–16% |
| calendar | 755 | 792 | 271 | 25–26% |
| date-picker | 272 | 305 | 294 | 49–52% |

The port is cheaper because the hard parts were decided once: the spec, the `@poc/dom` behaviours
and the suite's verdict. The framework code itself is about the same size in both: **each port
rewrites ~3,500 lines**, and that is the cost to watch for five frameworks.

### 4. Bounded duplication: yes, with a known residue

What the Vue port needed outside `@poc/vue`:

| where | change | when |
| --- | --- | --- |
| `@poc/dom` | the calendar's key map and the combobox's stepping moved in (`calendarKeyTarget`, `stepThroughNone`) | before the port, from the React report |
| `spec/README.md` | Vue focus targets also take a getter (a template unwraps refs) | during the port |
| `conformance/` | nothing | |

Bugs: the port met three Vue-specific issues (a ref on a functional component, ref unwrapping in
templates, `h()` children normalization) and **no bug that also existed in React**, so nothing was
fixed twice. What is still rewritten per framework, by design, is the component logic the
boundary keeps there: state, lifecycle, the overlay wiring (layer, presence, focus return) in five
overlays, and focus-after-render in the calendar.

### 5. Quality: on the spec's terms, above the baseline

Both implementations pass the 11 tests where Base UI and React Aria leave the spec. Bundles are
3–5 times smaller than Base UI's and Reka UI's for the same components, but they implement only the
specs' scope ([react.md](react.md#bundle-size-minified--gzip-react-external)). The screen reader
check is still pending a human run.

## Size against the established libraries

| component | `@poc/react` | Base UI / React Aria | `@poc/vue` | Reka UI |
| --- | --- | --- | --- | --- |
| Dialog | 3.4 kB | 23.4 kB | 3.5 kB | 11.6 kB |
| Popover | 10.8 kB | 40.2 kB | 10.9 kB | 22.1 kB |
| Menu | 12.3 kB | 60.2 kB | 12.3 kB | 28.0 kB |
| Combobox | 11.1 kB | 50.9 kB | 11.1 kB | 31.6 kB |
| Tabs | 2.4 kB | 13.3 kB | 2.4 kB | 7.9 kB |
| Calendar + RangeCalendar | 4.4 kB | 25.8 kB | 4.5 kB | 22.3 kB |
| DatePicker + DateRangePicker | 10.1 kB | 34.4 kB | 10.2 kB | 38.7 kB |

(minified + gzip, the framework external.)

## API ergonomics

- **React**: namespaces of parts, `render`, `className`/`style` functions. It reads like Base UI;
  the styled layer is one line per part.
- **Vue**: the same namespaces work in templates (`<Dialog.Popup>`), `v-model:open` /
  `v-model:value` and `@open-change` read natively, scoped slots replace children functions
  (`v-slot="{ week }"`). Two things differ from React and are now in the spec: a focus target is
  better given as a getter, and refs through wrappers need stateful components.
- In both, the consumer never needed the part's state in code: `data-*` was enough for styling.

## Boundary pressure (`@poc/dom`)

1. Resolved: pure key maps (calendar, combobox stepping) and the submenu's safe-area geometry
   moved to `@poc/dom`.
2. Remaining, by design: the overlay wiring repeats in five components per framework (React shares
   it through hooks, Vue through composables). A further step would be a framework-free "overlay
   session" in `@poc/dom` (layer + focus return + focus-out as one function of elements and
   callbacks). It stays within the boundary (no component state), and would cut each port.
3. Remaining, by design: Tabs and Menu key handling (which key goes where) could become pure maps
   like the calendar's (`tabsKeyTarget`, `menuKeyTarget`).

## What Headless UI teaches

Headless UI keeps React and Vue packages with no shared core, the closest precedent to this POC.
In its current repository the React package has dozens of components (button, checkbox, field,
input, select, textarea, tooltip, menu sections, ...) and the Vue package 13: the second framework
fell behind. It has no shared spec and no shared suite. This POC's answer to that drift is the
referee: a port is done when it passes the same suite, so it cannot quietly lag.

## Caveats

- Effort comes from the commit timestamps of agent runs: a proxy, not human time. The React
  numbers include designing the patterns; any port benefits from them.
- The POC's components implement the specs' scope only, which is smaller than a production
  library's.
- Angular is the most different target (attribute directives on the consumer's elements instead
  of `render`, injection instead of context, `ng-packagr`); Vue's ease says little about it.
- The screen reader check and part hooks are pending.

## Adjustments to the plan

1. **Before Epic D, extend `@poc/dom`** with the overlay session and the Tabs/Menu key maps
   (boundary pressure 2 and 3): less code per port, still no component state in `@poc/dom`.
2. **A port checklist** in `AGENTS.md`, from the Vue log: focus targets as getters where the
   framework unwraps refs, wrappers that keep element refs, children normalization, the calendar's
   focus after render.
3. **Angular gets a short spike first** (Dialog only) inside Epic E, to settle the directive
   mapping before porting the rest.

## Next Epics (outline, not published)

| Epic | content | depends on |
| --- | --- | --- |
| D | `@poc/dom` overlay session and key maps; `@poc/svelte` (Svelte 5 runes, snippets, `bind:`) and `@poc/solid` (1.9 or 2.0) with their fixtures; both pass the suite against the golden set | the checkpoint decision |
| E | Angular spike (Dialog as attribute directives, signals, zoneless), then `@poc/angular` for the six components with its fixture (Vite + Analog), TypeScript 6.0.3 pinned | D |
| F | the extras' specs (Select, Tooltip, Checkbox / CheckboxGroup, Slider) and React + Vue implementations | E (or in parallel) |
| G | the extras in Svelte, Solid and Angular, and the final report | F |
