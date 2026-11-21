# Vue report (Epic C)

The first port: `@poc/vue`, the six mandatory components written from scratch for Vue 3.5 on the
same spec, `@poc/dom` and `@poc/styles`, measured against React with the same suite.

- Data: [`data/vue.json`](data/vue.json), tables: [`data/vue.md`](data/vue.md), from
  `pnpm metrics --framework vue` (2026-11-20). The comparison with React is in
  [`checkpoint.md`](checkpoint.md).
- The data files were regenerated in Epic E, after D1 moved code into `@poc/dom`; the tables on
  this page are as of this report. Current numbers: [`frameworks.md`](frameworks.md).

## Conformance

| layer | passed | failed | note |
| --- | --- | --- | --- |
| behaviour | 90 | 0 | the 11 tests the baseline fails included |
| contract | 16 | 0 | |
| visual | 16 / 16 | 0 | pixel-identical to React's screenshots on the same machine; in CI against the golden set |

No conformance test was changed for Vue.

## Lines of code

| component | `@poc/vue` (its folder) | `@poc/dom` it uses | share in `@poc/dom` |
| --- | --- | --- | --- |
| dialog | 272 | 233 | 46% |
| popover | 366 | 417 | 53% |
| menu | 780 | 471 | 38% |
| combobox | 591 | 334 | 36% |
| tabs | 416 | 79 | 16% |
| calendar | 792 | 271 | 25% |
| date-picker | 305 | 294 | 49% |

Plus 419 lines of Vue infrastructure shared by every component: `renderPart`, the composables
(controllable state, presence, overlay root, positioner), the portal and the title, description
and close factories.

## Bundle size (minified + gzip, Vue external)

| component | `@poc/vue` | Reka UI 2.11 (closest parts) |
| --- | --- | --- |
| Dialog | 3.5 kB | 11.6 kB |
| Popover | 10.9 kB | 22.1 kB |
| Menu | 12.3 kB | 28.0 kB |
| Combobox | 11.1 kB | 31.6 kB |
| Tabs | 2.4 kB | 7.9 kB |
| Calendar + RangeCalendar | 4.5 kB | 22.3 kB |
| DatePicker + DateRangePicker | 10.2 kB | 38.7 kB |

As with React, this is not like for like: Reka UI carries more options, and its calendar and date
picker carry `@internationalized/date`.

## Port log

| part of the port | finding | fixed in |
| --- | --- | --- |
| before porting | the calendar's key → date map and the combobox's highlight stepping are pure; they moved to `@poc/dom` (`calendarKeyTarget`, `stepThroughNone`), React uses them too | `@poc/dom` (once) |
| Dialog `initialFocus` | a template unwraps a ref at render time, before the popup's content exists, so the target was `null`; focus targets also take a getter (`:initial-focus="() => cancel"`) | `@poc/vue`, `spec/README.md` |
| fixture kit | a template ref on a functional component is `null` (no instance): the styled wrapper became a stateful component | `fixtures/vue` |
| Calendar header | in `h()`, an element's children given as one vnode read as a slots object and rendered nothing; `renderPart` now always passes an array | `@poc/vue` |
| visual layer in CI | two Tabs screens differed from React's by 5 and 9 pixels inside a glyph: a JSX `{label} settings` makes two text nodes, a Vue template merges them into one, and with CI's font the split shifts glyphs by a fraction of a pixel. The fixture now renders the same text runs (`kit/text-runs.ts`); same machine, the screens were already identical | `fixtures/vue` |
| everything else | Dialog, Popover, Menu (submenus, safe area), Tabs, Combobox, the calendar family and the pickers passed on their first run once these were fixed | |
| rejected controlled value (Epic F, #34) | an `inputValue` the consumer refused left the user's text in the input: a prop that does not change does not re-render, and the browser had already written the `<input>`. `Combobox.Input` re-asserts the kept value after `nextTick` (the consumer's update has rendered by then). A kept `open: true` already worked (`/dialog/rejected-close`) | `@poc/vue` |

None of the findings was a bug that also existed in React. The subtlest React bug of Epic B
(focusing a calendar cell that mounts one render after the keyboard moved to it) was avoided in
Vue by design: the knowledge carried over, the code did not.

## Effort

| step | from | to | minutes (agent run) |
| --- | --- | --- | --- |
| Dialog, Popover, Menu and the Vue fixture | 20:00:35 | 20:06:07 | 5.5 |
| Tabs, Combobox, calendar family | 20:06:07 | 20:11:34 | 5.5 |

Commit timestamps of agent runs: a proxy for effort, not human time.

## Extras (Epic F)

The React extras ported to Vue (#37), on the same `@poc/dom` modules. Current numbers:
[`data/vue.md`](data/vue.md).

| component | framework package | @poc/dom used | bundle (gzip) | Reka UI 2.11 |
| --- | --- | --- | --- | --- |
| select | 630 | 404 | 11.9 kB | 29.3 kB |
| tooltip | 415 | 272 | 10.3 kB | 20.5 kB |
| checkbox | 242 | 61 | 1.9 kB | 9.2 kB |
| checkbox-group | 102 | 0 | 0.9 kB | 4.6 kB |
| slider | 477 | 211 | 3.2 kB | 7.8 kB |

- **Conformance**: Vue passes every layer for the extras with no test changed for it, against
  React's golden screenshots (no snapshot of its own).
- **API**: `v-model:value` (Select, CheckboxGroup, Slider), `v-model:checked` (Checkbox),
  `v-model:open` (Select, Tooltip), with `@value-change`, `@checked-change`, `@open-change` and
  `@value-commit` carrying the details.
- **Composables: none.** As in React, every part injects its root's context; no extra needed a
  lower layer.
- **Effort**: the Vue port took about 6 minutes of agent time after React's 16 (`@poc/dom`,
  `@poc/styles` and `@poc/react` together): the logic was already in `@poc/dom`, and the React
  findings carried over as knowledge, not code.

### Port log (extras)

| part | finding | fixed in |
| --- | --- | --- |
| a rejected controlled value (#34) | see above: `Combobox.Input` re-asserts a kept `inputValue` after `nextTick` | `@poc/vue` |
| listeners | `h()` turns `onPointerEnter` into a `pointer-enter` listener: Vue parts use `onPointerenter`, `onPointerleave`, `onPointerdown` | `@poc/vue` (from the start) |
| fixture | text nodes as JSX makes them: each label glued to its checkbox (`<Checkbox.Root />Accept terms`), an item's label next to its indicator | `fixtures/vue` |
| conformance | Vue's Select opened fast enough for axe to run during the popup's enter transition (a half-faded popup fails color contrast) and for the geometry check to measure it scaled: the shared helpers now wait for running animations, for every implementation | `conformance/src/axe.ts`, the Select test |

The boundary pressure is React's (above): the tooltip's hover tracking and CheckboxGroup's
membership were written a second time.

## Field (Epic H)

The Field layer ported to Vue (#50), on the same `@poc/dom` helpers as React (`validateField`,
`validatesOnChange`, `shownAfterChange`, `fieldErrorShown`, `fieldStateAttributes`,
`fieldDescribedBy`, `onSubmitAttempt`).

| part | `@poc/vue` | `@poc/react` |
| --- | --- | --- |
| `components/field/` (Root, Label, Control, Description, Error, context, namespace) | 482 | 429 |
| `composables/use-field-control.ts` (the control's side of the contract) | 125 | 119 |
| integration into Checkbox, Select, Slider (`git diff --stat`) | +77 / −9 | +68 / −7 |
| fixture (three scenarios, validators, kit wrapper) | 166 | 208 |

- **Conformance**: the whole `vue` project passes (186 passed, 28 skipped: the visual layer runs
  only in CI), the Field tests included. Visual layer on this machine: the four Field screens and
  the Checkbox, Select and Slider screens are pixel-identical to React's. No test, snapshot or spec
  was changed for Vue.
- **API**: `v-model:value` on `Field.Control` (as Select and Slider), with `@value-change`;
  `:validate` and `validation-mode` on `Field.Root`; `Field.Error`'s content is its default slot.
  The parts are render-function components (`.ts`), as every other Vue part.
- **Boundary pressure on `@poc/dom`: none.** The port writes the field's state, its lifecycle and
  the Vue API only.

### Port log (Field)

| part | finding | fixed in |
| --- | --- | --- |
| `useFieldControl` | Checkbox's `state` computed is defined after the composable's call (its `disabled` reads the field). A `watch` on the value created during the call ran its getter at once, hit the temporal dead zone, and Vue swallowed the error: the watch tracked nothing, so checking the checkbox never revalidated. The value watch now starts in `onMounted`, as React's effect does | `@poc/vue` |
| `Field.Error` `match` | a prop typed `[Boolean, String]` is cast to `false` when absent unless it has a `default`; `default: undefined` keeps "no match" distinct from `match: false`, and a bare `match` reads as `true` | `@poc/vue` (from the start) |
| fixture | each error and description text on one line inside its part: a template's condensed whitespace would add a leading and trailing space to the text node JSX trims | `fixtures/vue` (from the start) |
| everything else | the three scenarios passed on the second run, the visual layer on the first | |

## Combobox parity (Epic I)

The new Combobox (Fragiola UI parity, #57) ported to Vue: every part of the spec (Root, InputGroup,
Input, Trigger, Clear, Chips, Chip, ChipRemove, Value, Status, Portal, Positioner, Popup, Empty,
List, Group, GroupLabel, Separator, Item, ItemIndicator), on the same `@poc/dom` helpers as React
(`filterItems`, `containsFilter`, `queryIsLabel`, `itemLabel`, `itemFormValue`, `includesItem`,
`toggleItem`, `chipKeyTarget`, `chipArrows`, `stepThroughNone`, `openOverlaySession`,
`bridgeForm`). The old Vue Combobox was rewritten, not extended.

| part | `@poc/vue` | `@poc/react` |
| --- | --- | --- |
| `components/combobox/` (22 files: 20 parts, the context, the namespace in `parts.ts`) | 1479 | 1382 |
| of which the Root | 336 | 408 |
| fixture (nine scenarios, their helpers and items, kit wrapper) | 516 | 734 |

- **Conformance**: the whole `vue` project passes (214 passed, 31 skipped: the visual layer runs
  only in CI), the 42 Combobox behaviour and contract tests included. Visual layer on this
  machine: the five Combobox screens are pixel-identical to React's, on the first run. No test,
  snapshot or spec was changed for Vue.
- **API**: `v-model:value`, `v-model:input-value` and `v-model:open`, with `@value-change`,
  `@input-value-change` and `@open-change` for the details. The List's render function is its
  default scoped slot, `v-slot="{ entry, index }"`, called once per matching entry when the Root
  has `items`; without `items`, the slot is the List's content, as before. Value's is its default
  scoped slot, `v-slot="{ value }"`. `value`, `defaultValue` and Item's `value` take any type
  (`type: null`); `filter`, `isItemEqualToValue`, `itemToStringLabel` and `itemToStringValue` are
  function props. The four new change reasons (`input-press`, `input-clear`, `clear-press`,
  `chip-remove-press`) are in the Vue `ChangeReason`.
- **Boundary pressure on `@poc/dom`: none.** The port writes the combobox's state, its lifecycle
  and the Vue API only.

### Port log (Combobox parity)

| part | finding | fixed in |
| --- | --- | --- |
| selection | the first e2e run failed 5 of 42 tests: no item was `aria-selected` when the value came from the fixture. A value held in the consumer's `ref` is its reactive proxy, and the default `isItemEqualToValue` (`Object.is`) compared that proxy with the raw item of `items`. The default equality compares `toRaw` of both; a consumer's `isItemEqualToValue` gets the items as they are | `@poc/vue` |
| the pending highlight | the List's post-flush watcher runs before its Items' registration watchers (Vue orders post jobs by component uid, parent first), so ArrowDown would have consumed the pending "first" / "selected" highlight with no item registered. The watcher waits until every rendered `option` has registered | `@poc/vue` (from the start) |
| chip keys | React removes the chip inside `flushSync` before moving focus; Vue removes it and focuses the target after `nextTick`, still within the keydown's microtasks, so the next key reaches the right chip (AGENTS.md, "Porting" rule 8) | `@poc/vue` (from the start) |
| form reset | the browser resets the visible Input and the hidden input after the Root's state, and Vue does not re-patch a value that did not change in the state: after the reset, the Root writes the text and the form value back once rendered (`nextTick`) | `@poc/vue` (from the start) |
| any-type props | `PropType<unknown>` on `value` and `defaultValue` made vue-tsc type the fixtures' `v-model:value` as `undefined`; `type: null` (any type) fixes it | `@poc/vue` |
| fixture | text nodes as JSX makes them: an item's label glued to its ItemIndicator, a chip's label to its ChipRemove, each button's text on one line; the shared items and `printValues` are React's files as they are | `fixtures/vue` (from the start) |

A finding outside Vue: `pnpm test` fails one test on the Epic branch,
`packages/styles/tests/spec-coverage.test.ts` › `combobox.md`: the spec's `hidden-input` part has
no recipe in `@poc/styles` (`combobox.ts`). It fails the same way without this port's changes,
which touch neither `spec/` nor `@poc/styles`.
