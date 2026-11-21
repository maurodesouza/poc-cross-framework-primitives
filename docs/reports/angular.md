# Angular report (Epic E)

The fourth port and the most different target: `@poc/angular`, the six mandatory components
written from scratch for **Angular 22** (standalone directives, signals, zoneless) on the same
spec, `@poc/dom` and `@poc/styles`, measured with the same suite. The mapping (a directive per
part on the consumer's own element) is in [`packages/angular/README.md`](../../packages/angular/README.md)
and in `spec/README.md`'s Angular column.

- Data: [`data/angular.json`](data/angular.json), tables: [`data/angular.md`](data/angular.md),
  from `pnpm metrics --framework angular` (2026-11-20). The visual layer only runs in CI or with
  `VISUAL=1`, so the local data records it as skipped; its result below comes from those runs.

## Conformance

| layer | passed | failed | note |
| --- | --- | --- | --- |
| behaviour | 90 | 0 | the 11 tests the baseline fails included |
| contract | 16 | 0 | |
| visual | 16 / 16 | 0 | pixel-identical to React's screenshots on the same machine (`VISUAL=1`, 2026-11-20); CI against the golden set runs on the Epic E pull request |

No conformance test was changed for Angular, and none looked wrong for it.

## Lines of code

| component | React | Angular | `@poc/dom` Angular uses |
| --- | --- | --- | --- |
| dialog | 278 | 264 | 219 |
| popover | 368 | 333 | 386 |
| menu | 743 | 701 | 461 |
| combobox | 542 | 529 | 320 |
| tabs | 347 | 375 | 72 |
| calendar | 755 | 756 | 453 |
| date-picker | 265 | 333 | 263 |
| **components** | **3298** | **3291** | |
| shared infrastructure | 372 | 524 | |

Angular's shared infrastructure is the largest (`lib/utils` and `lib/inject`): the structural
portal, the synchronous flush, host-element and label-id helpers, and the seven `inject*` part
hooks, which no other package has. Its calendar counts the date picker's positioning modules, for
the same reason as Solid's (it reads the picker's context).

## Bundle size (minified + gzip, Angular external)

| component | `@poc/angular` | Angular CDK / Angular Aria 22.2.7 |
| --- | --- | --- |
| Dialog | 4.4 kB | 16.0 kB (CDK `Dialog`) |
| Popover | 12.4 kB | 14.2 kB (CDK `CdkConnectedOverlay`) |
| Menu | 14.5 kB | 8.0 kB (Aria `menu`) |
| Combobox | 13.0 kB | 8.6 kB (Aria `combobox` + `listbox`) |
| Tabs | 3.0 kB | 5.5 kB (Aria `tabs`) |
| Calendar + RangeCalendar | 5.4 kB | none |
| DatePicker + DateRangePicker | 11.9 kB | none |

**Indicative only**: the CDK's Dialog and Overlay are services with their own container and
styles, and Angular Aria's Menu and Combobox carry no positioning, layer stack or presence (ours
include `@floating-ui/dom` and the overlay session), which is why they come out smaller. Both
sides are built with Vite and `@analogjs/vite-plugin-angular`, so the numbers compare with each
other, not exactly with the esbuild tables of React and Vue.

## Port log

The full log, with the reason of each finding, is in
[`packages/angular/README.md`](../../packages/angular/README.md#port-log). In short:

| part of the port | finding | fixed in |
| --- | --- | --- |
| the mapping (spike, Dialog) | parts are attribute directives on the consumer's element; roots sit on `<ng-container>` and are found by injection; an input with its `*Change` output plus `(…ChangeDetails)`; structural portals; `inject*` functions as the part hooks | `@poc/angular`, `spec/README.md` |
| fixture DOM | a component's host element is not in React's tree: scenario components use attribute selectors so their host is one of React's elements | `fixtures/angular` |
| fixture text | whitespace and text runs: text written against its tags, one `<ng-container>` per JSX text run | `fixtures/angular` |
| zoneless timing | a state change renders in a later task: two quick ArrowDowns both reached the menu trigger, and a calendar key that changes the month left focus on `body`. Open changes and calendar keys render at once (`injectFlush`, `ApplicationRef.tick()`) | `@poc/angular`, `AGENTS.md` (port checklist item 8) |
| submenu portal | destroying the parent's view left the nodes the submenu's portal moved to `body`; the portal removes them itself | `@poc/angular` |
| disabled item | the consumer's `(click)` is on the item's own element: a capturing listener stops a disabled item's click first | `@poc/angular` |
| Tabs panel | an attribute directive cannot remove its own element: the panel is structural (`*tabsPanel`) | `@poc/angular`, `spec/README.md` |
| typed values | one root for both calendar modes would not type-check `[(value)]` under strict templates: two directives each over a shared state | `@poc/angular` |
| controlled state (found in review) | the first version used `model()`, which writes its own value on change: a one-way `[open]`, or a consumer keeping the old value, lost control. Roots take an input and a `*Change` output instead, and the Combobox input puts back a controlled `inputValue` the consumer kept | `@poc/angular` |
| calendar in a picker | the closing picker's pending focus, as in Solid | `@poc/angular` |
| workspace | `pnpm-workspace.yaml`: `allowBuilds: false` for `@parcel/watcher`, `lmdb`, `msgpackr-extract`, and a `packageExtensions` entry so the Analog plugin sees TypeScript 6.0.3 (both as in Dockable) | root |

## Effort

| step | from | to | minutes (agent run) |
| --- | --- | --- | --- |
| the spike (Dialog, mapping, fixture) with Popover and Menu | 22:08:23 | 22:29:27 | 21.1 |
| Tabs, Combobox, calendar family | 22:29:27 | 22:42:13 | 12.8 |

About 34 minutes from the Epic's worktree to the last component, the most of the ports (React ~18,
Vue ~11, Svelte ~13, Solid ~29), and the spike is inside it. The two first issues were committed
together, so the split between Dialog and Popover/Menu is not measured. Commit timestamps of agent
runs: a proxy for effort, not human time.
