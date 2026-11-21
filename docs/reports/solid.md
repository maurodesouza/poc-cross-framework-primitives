# Solid report (Epic D)

The third port: `@poc/solid`, the six mandatory components written from scratch for **Solid 2.0**
(`solid-js` 2.0.3, `@solidjs/web` 2.0.3; released on 2026-11-17, the maintainer's exception to the
seven-day rule) on the same spec, `@poc/dom` and `@poc/styles`, measured with the same suite.

- Data: [`data/solid.json`](data/solid.json), tables: [`data/solid.md`](data/solid.md), from
  `pnpm metrics --framework solid` (2026-11-20). The visual layer only runs in CI or with
  `VISUAL=1`, so the local data records it as skipped; its result above comes from those runs.

## Conformance

| layer | passed | failed | note |
| --- | --- | --- | --- |
| behaviour | 90 | 0 | the 11 tests the baseline fails included |
| contract | 16 | 0 | |
| visual | 16 / 16 | 0 | pixel-identical to React's screenshots on the same machine (`VISUAL=1`, 2026-11-20); in CI against the golden set, on the Epic D pull request |

No conformance test was changed for Solid. Opening the 19 scenarios in the dev build by hand,
Solid's development diagnostics stayed silent (a manual observation, not recorded data).

## Lines of code

| component | React | Vue | Svelte | Solid | `@poc/dom` Solid uses |
| --- | --- | --- | --- | --- | --- |
| dialog | 278 | 273 | 272 | 269 | 214 |
| popover | 368 | 353 | 360 | 342 | 381 |
| menu | 743 | 778 | 717 | 687 | 456 |
| combobox | 542 | 589 | 557 | 539 | 315 |
| tabs | 347 | 396 | 366 | 357 | 67 |
| calendar | 755 | 792 | 710 | 757 | 448 |
| date-picker | 265 | 293 | 283 | 254 | 258 |
| **components** | **3298** | **3474** | **3265** | **3205** | |
| shared infrastructure | 372 | 419 | 332 | 387 | |

Solid's calendar counts 448 `@poc/dom` lines where the others count 271: it imports the date
picker's context (to know when it sits in a closing picker), and the metric follows that import
into the positioning modules the calendar itself never runs.

Solid's shared infrastructure: `renderPart` (the `render` prop, `class` / `style` as a value or a
function of the state), `mergeProps`, state attributes, and the `create*` primitives (controllable
state, presence, overlay root, positioner).

## Bundle size (minified + gzip, Solid external)

| component | `@poc/solid` | Kobalte 0.13.14 |
| --- | --- | --- |
| Dialog | 4.1 kB | 9.6 kB |
| Popover | 12.1 kB | 19.4 kB |
| Menu (DropdownMenu) | 14.0 kB | 30.4 kB |
| Combobox | 12.5 kB | 32.8 kB |
| Tabs | 2.9 kB | 11.5 kB |
| Calendar + RangeCalendar | 5.0 kB | none |
| DatePicker + DateRangePicker | 11.4 kB | none |

**Indicative only**: Kobalte 0.13 targets Solid 1.9 (its Solid 2 line is an alpha), and it has no
calendar or date picker. Both sides are built with Vite library mode and the Solid plugin, so the
numbers compare with Svelte's, not exactly with the React and Vue tables (esbuild).

## Port log

| part of the port | finding | fixed in |
| --- | --- | --- |
| build | tsdown has no Solid 2 JSX transform; the package builds with Vite library mode and `@solidjs/vite-plugin` (the Solid 2 compiler, no Babel) | `@poc/solid` |
| every part | `<Dynamic component={tag}>` rebuilt the element whenever the part's merged props changed; parts use `dynamic(() => tag, { static: true })` | `@poc/solid` (`renderPart`) |
| every part | a part returning a bare function was called again, and rebuilt, each time a parent re-resolved its children (the dialog trigger lost focus); parts return a memo | `@poc/solid` (`renderPart`) |
| presence | `data-starting-style` set in an effect came one pass late: focusing the popup styled it first and the enter animation ran backwards (sub-pixel screenshot diffs); it now derives from `open` in the same pass | `@poc/solid` |
| effect order | Solid runs effects parent first (React runs a child's layout effects first): the Combobox list waits for every option to register before highlighting, and a calendar inside a closing picker takes no pending focus | `@poc/solid` |
| attributes | `aria-*={false}` removes the attribute instead of writing `"false"`; ARIA values are passed as strings | `@poc/solid` |
| uncontrolled state | `createSignal(() => initial())` is a derived signal in Solid 2: it reset when a `default*` prop changed; every seed reads `initial` once through `untrack`, as React's `useState` (found in review) | `@poc/solid` |
| Combobox | a controlled `inputValue` the consumer keeps unchanged does not re-run the binding, so the typed text stayed; the input puts the accepted text back after `flush()` (found in review) | `@poc/solid` |
| element refs | Solid refs are never called with `null`: the root keeps a closed popup's detached element until the next one registers. Effects guard on `open`, and the new element registers before they run, so it is left as is | |
| API mapping | `open={open()}`, ref callbacks, focus targets as a getter (`initialFocus={() => el}`) | `spec/README.md` (Solid column) |
| portal | Solid's `Portal` adds two empty text nodes and the components add comment markers; no element, and the screenshots match | |

Nothing changed in `@poc/dom` or in a spec's behaviour; only the API mapping table gained its
Solid column. Reads lagging writes and props that cannot be destructured were manageable.

## Effort

| step | from | to | minutes (agent run) |
| --- | --- | --- | --- |
| Dialog, Popover, Menu and the Solid fixture | 21:22:17 | 21:41:06 | 18.8 |
| Tabs, Combobox, calendar family | 21:41:06 | 21:51:17 | 10.2 |

About 29 minutes, the most of any port so far (React ~17.7, Vue ~11, Svelte ~12.8). Most of it
went into Solid 2.0 itself: a fresh major whose rendering details (memo children, `dynamic`, effect
order) the port had to discover, which a Solid 1.9 port would not have paid. Commit timestamps of
agent runs: a proxy for effort, not human time.
