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

None of the findings was a bug that also existed in React. The subtlest React bug of Epic B
(focusing a calendar cell that mounts one render after the keyboard moved to it) was avoided in
Vue by design: the knowledge carried over, the code did not.

## Effort

| step | from | to | minutes (agent run) |
| --- | --- | --- | --- |
| Dialog, Popover, Menu and the Vue fixture | 20:00:35 | 20:06:07 | 5.5 |
| Tabs, Combobox, calendar family | 20:06:07 | 20:11:34 | 5.5 |

Commit timestamps of agent runs: a proxy for effort, not human time.
