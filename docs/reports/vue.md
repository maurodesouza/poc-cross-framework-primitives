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
