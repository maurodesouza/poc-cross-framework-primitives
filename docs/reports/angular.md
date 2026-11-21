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

## Extras (Epic G)

Select, Tooltip, Checkbox, CheckboxGroup and Slider ported to Angular (#41), on the `@poc/dom`
modules of Epic F (`createTypeahead` and `menuKeyTarget`, `createHoverIntent`,
`createDelayGroup`, `trackHoverBridge`, `startDrag`, the range math and `sliderKeyTarget`,
`bridgeForm`, the hidden input's style). The numbers of `pnpm metrics` (lines, the `@poc/dom`
share, sizes against Angular CDK / Aria) are in [`data/angular.md`](data/angular.md), regenerated
with the five frameworks in #42. Raw file lines of the directives:

| component | `@poc/angular` (lines) |
| --- | --- |
| select | 665 |
| tooltip | 427 |
| checkbox | 294 |
| checkbox-group | 101 |
| slider | 472 |

plus `lib/utils/hidden-input.ts` (51 lines), shared by Select and Checkbox.

- **Conformance**: `pnpm e2e --project angular` passes behaviour and contract for all ten
  components (164 passed, the visual layer skipped locally), with no test changed and no snapshot
  of its own. The visual layer matched React pixel for pixel on the same machine: React's
  screenshots written to a scratch folder (`VISUAL=1`), then Angular compared against them, 24 of
  24, the 8 extras' included. CI compares against the golden set.
- **API**: inputs with their `*Change` outputs, never `model()`: `[(value)]` (Select,
  CheckboxGroup, Slider), `[(checked)]` (Checkbox), `[(open)]` (Select, Tooltip), with
  `(valueChangeDetails)`, `(checkedChangeDetails)`, `(openChangeDetails)` and Slider's
  `(valueCommit)`. Roots without an element of their own (`selectRoot`, `tooltipRoot`,
  `tooltipProvider`) sit on `<ng-container>`; the parts that render only in some states are
  structural (`*selectPortal`, `*tooltipPortal`, `*selectItemIndicator`, `*checkboxIndicator`),
  and an indicator reads its state through the root (`#box="checkboxRoot"`).
- **Forms: hidden inputs, no `ControlValueAccessor`.** A follow-up for a production version:
  Angular forms (`formControlName`, `ngModel`) need a CVA on the roots, which is out of this POC's
  scope (the native `<form>` path is what the suite checks).
- **Part hooks: none.** As in React and Vue, every part injects its root (or its item, or its
  checkbox); no extra needed a new `inject*` function.
- **Effort**: about 10 minutes of agent time from the worktree to the suite green (08:11:54 to
  08:21, 2026-11-21): the directives in 6 minutes, the fixture in 2, and no failing test to fix.
  Epic E's seven components took about 34 minutes, the spike included. The port checklist
  (AGENTS.md, "Porting a framework") was applied up front: `injectFlush` on key- and drag-driven
  renders, fixture text against its tags, consumer ids kept, structural parts for elements that
  come and go.

### Port log (extras)

| part | finding | fixed in |
| --- | --- | --- |
| hidden inputs | a root on `<ng-container>` has no element to render its input in, and a part on the consumer's own `<button>` cannot add a sibling from a template: the directive creates the input itself (`createHiddenInput`), right after its anchor (the container's comment, or the checkbox's button, so the label's text stays after it as in React), and removes it on destroy. The Slider's `type="hidden"` inputs are appended to its root | `@poc/angular` (`lib/utils/hidden-input.ts`) |
| a form reset (late) | `bridgeForm` reports the reset after the browser reset the controls; a state that did not change does not re-run the input's effect, so the reset writes the state back onto the input (`value`, `checked`) itself, for a CheckboxGroup child too | `@poc/angular` |
| the delay group | closing the previous member renders at once (`setOpen` flushes), which an effect must not do (`ApplicationRef.tick()` during change detection): a tooltip joins its group in `show()`, an event, and an effect only reports its close | `@poc/angular` |
| zoneless timing | the select's highlight, a slider key and every drag move render within their event (`injectFlush`), so a quick second key or the next pointer move meets the rendered state (checklist item 8; the Epic's "slider pointer capture" risk did not fail) | `@poc/angular` (from the start) |
| ids | the consumer's `id` wins (the label's `for` points at the Select trigger): triggers and checkboxes take a generated id only when they have none, after the first render, and the list's `aria-labelledby` reads the trigger's id at render | `@poc/angular` |
| `*indicator` alone | a structural directive's input is `""` when written bare, which `booleanAttribute` reads as `true`: the indicators' `keepMounted` takes only `true` | `@poc/angular` |
| fixture | template references named after a signal shadow it (`#terms` hid `terms.set`): the references are `termsBox`, ... | `fixtures/angular` |

No `@poc/dom` change was needed: the hover tracking moved there before this port
(`trackHoverBridge`), and Angular used it as React and Vue do. The rest of the boundary pressure is
React's: CheckboxGroup's membership and the slider's value shape stay component state, written a
fourth time.

In dev mode (`vite`), the twelve extras' scenarios log no error or warning while opened, chosen,
toggled, moved by a key, hovered and reset.

## Field (Epic H)

The Field layer (spec/field.md) ported to Angular (#53): Field Root, Label, Control,
Description and Error, and Checkbox, Select and Slider inside a field, on `@poc/dom`'s field
helpers (`validateField`, `validatesOnChange`, `shownAfterChange`, `fieldErrorShown`,
`fieldStateAttributes`, `fieldDescribedBy`, `onSubmitAttempt`, `UNVALIDATED`).

| part | Angular (lines) | React (lines) |
| --- | --- | --- |
| `lib/directives/field/` (five directives) | 550 | 429 (`components/field/`) |
| `lib/utils/field-control.ts`, `own-attribute.ts`, `lib/inject/inject-field.ts` | 170 | 119 (`hooks/use-field-control.ts`) |
| integration (Checkbox, Select, Slider; `git diff --stat`) | +133 / −21 in 6 files | +68 / −7 in 7 files |
| fixture (three scenarios, routes) and `implementations.ts` | +232 / −2 in 8 files | |

- **API**: `<div fieldRoot [name]="'email'" [validate]="fn" [validationMode]="'onBlur'">`,
  `<label fieldLabel>`, `<input fieldControl>` (`[(value)]`, `(valueChangeDetails)`, every native
  attribute on the consumer's own input), `<p fieldDescription>`, and the structural
  `<div *fieldError="'valueMissing'">` (`*fieldError` alone: while invalid; `*fieldError="true"`:
  always). The controls read the field through `injectField()`, an optional injection of the
  enclosing `[fieldRoot]` (`null` outside).
- **Conformance**: `--project=angular` 186 passed, 28 skipped (the visual layer, local), 0 failed,
  the 22 Field behaviour and contract tests included, all green on the first run. The visual
  layer matched React's screenshots made on this machine, 11 of 11 (field, checkbox, select,
  slider). No test, snapshot or spec changed.
- **Boundary pressure on `@poc/dom`**: none. The field's state, its control registration and the
  message list stay in `FieldRoot`, as in React.

### Port log (Field)

| part | finding | fixed in |
| --- | --- | --- |
| Field.Error with no children | Angular has no `children ?? fallback`: the Error is structural (rendered only while shown, like `*tabsPanel`), and when its element has no child nodes of its own the directive writes the messages into it (one text node, or `ul > li`), so the DOM is React's. `*fieldError="let errors"` gives the messages (a signal) to a template that renders them itself | `@poc/angular` |
| reporting the value | React reports a change in `useEffect`, after the DOM holds it; a directive's `effect` runs before its host bindings and the hidden inputs' effects. The control side reports from `afterRenderEffect`, so `validateField` reads the native validity of the rendered value | `@poc/angular` (`lib/utils/field-control.ts`) |
| `aria-describedby` | `fieldDescribedBy` reads each element's `id`; a description's `[attr.id]` host binding lands after the control read the list. The description (and the error) writes its id on the element first, then registers it, so the list recomputes with the id | `@poc/angular` |
| a consumer's own ARIA | a host binding to `null` removes the attribute: outside a field, `[attr.aria-labelledby]` would remove a consumer's own. The controls fall back to the consumer's static attribute (`HostAttributeToken`), which is also how a Slider.Thumb with its own `aria-label` keeps the field's label off | `@poc/angular` (`lib/utils/own-attribute.ts`) |
| Field.Control's value | `[value]` cannot be a host binding of a directive on any element under `typeCheckHostBindings`: an effect writes the value on the input | `@poc/angular` |
| ids | Checkbox and Select.Trigger take their generated id after the first render (the consumer's wins); they register it with the field then, and the label's `for` follows | `@poc/angular` |
| fixture | an attribute that names a directive input is still written on the element (`validationmode="onChange"` on the root's `<div>`): the fixture binds the root's inputs (`[name]="'email'"`), so the root carries no attribute React's has not | `fixtures/angular` |

Zoneless timing (checklist item 8) needed nothing new: a submission attempt, a blur and a change
render in the next task, which the suite's polling assertions meet, and the slider's key and the
select's choice already flush. In dev mode (`vite`), the three scenarios log no error or warning
while submitted, typed into, toggled, chosen and moved by a key.
