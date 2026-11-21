# Svelte report (Epic D)

The second port: `@poc/svelte`, the six mandatory components written from scratch for Svelte 5
(runes) on the same spec, `@poc/dom` and `@poc/styles`, measured with the same suite.

- Data: [`data/svelte.json`](data/svelte.json), tables: [`data/svelte.md`](data/svelte.md), from
  `pnpm metrics --framework svelte` (2026-11-20). The visual layer only runs in CI or with
  `VISUAL=1`, so the local data records it as skipped; its result above comes from those runs.

## Conformance

| layer | passed | failed | note |
| --- | --- | --- | --- |
| behaviour | 90 | 0 | the 11 tests the baseline fails included |
| contract | 16 | 0 | |
| visual | 16 / 16 | 0 | pixel-identical to React's screenshots on the same machine (`VISUAL=1`, 2026-11-20); in CI against the golden set, on the Epic D pull request |

No conformance test was changed for Svelte.

## Lines of code

Lines in each component's folder, per framework (after D1 moved the overlay session and the
Tabs and Menu key maps into `@poc/dom`, which React and Vue use too):

| component | React | Vue | Svelte | `@poc/dom` Svelte uses |
| --- | --- | --- | --- | --- |
| dialog | 278 | 273 | 272 | 214 |
| popover | 368 | 353 | 360 | 381 |
| menu | 743 | 778 | 717 | 456 |
| combobox | 542 | 589 | 557 | 315 |
| tabs | 347 | 396 | 366 | 67 |
| calendar | 755 | 792 | 710 | 271 |
| date-picker | 265 | 293 | 283 | 258 |
| **components** | **3298** | **3474** | **3265** | |
| shared infrastructure | 372 | 419 | 332 | |

Svelte's shared infrastructure: `mergeProps`, the element-ref attachment, the `Controllable`,
`Presence` and `OverlayRoot` state classes, the positioner effect, context helpers and the portal.

## Bundle size (minified + gzip, Svelte external)

| component | `@poc/svelte` | Bits UI 2.21 |
| --- | --- | --- |
| Dialog | 4.7 kB | 16.6 kB |
| Popover | 12.8 kB | 32.2 kB |
| Menu (DropdownMenu) | 14.9 kB | 40.1 kB |
| Combobox | 13.3 kB | 36.3 kB |
| Tabs | 3.3 kB | 8.0 kB |
| Calendar + RangeCalendar | 5.8 kB | 26.3 kB |
| DatePicker + DateRangePicker | 12.0 kB | 64.6 kB |

Both sides are compiled the same way: Vite library mode with the Svelte plugin (`.svelte` files
cannot go through esbuild), so these numbers compare with each other but not exactly with the
React and Vue tables (esbuild). Not like for like either: Bits UI carries more options, and its
date picker includes a segmented date field and `@internationalized/date`.

## Port log

| part of the port | finding | fixed in |
| --- | --- | --- |
| before porting (D1) | the overlay lifecycle (layer, outside press, Escape, focus out, return focus) was written three times; it became `openOverlaySession` in `@poc/dom`, with the Tabs and Menu key maps (`tabsKeyTarget`, `menuKeyTarget`, `submenuKeys`). React and Vue were refactored onto it and stayed green | `@poc/dom` (once) |
| every part | `props` and `state` as local names clash with the runes (`$props`, `$state`): the parts use `partProps` / `partState` | `@poc/svelte` |
| `mergeProps` | attachments are symbol keys; the merged object is typed `Record<string \| symbol, any>` (`SpreadProps`) so they survive | `@poc/svelte` |
| roots | seeding uncontrolled state from a prop read it once and warned (`state_referenced_locally`); the seed reads through `untrack` on purpose | `@poc/svelte` |
| fixture | Svelte keeps the whitespace between tags as text nodes, which shifted the visual layer; the fixture's markup is glued as JSX renders it, and text runs use `{#each}` to make the same text nodes | `fixtures/svelte` |
| everything else | Dialog, Popover, Menu (submenus, safe area), Tabs, Combobox, the calendar family and the pickers passed once these were fixed | |

Nothing changed in a spec or in `@poc/dom` during the port itself (D1 was planned before it).

## Effort

| step | from | to | minutes (agent run) |
| --- | --- | --- | --- |
| Dialog, Popover, Menu and the Svelte fixture | 21:09:33 | 21:17:13 | 7.7 |
| Tabs, Combobox, calendar family | 21:17:13 | 21:22:17 | 5.1 |

About 12.8 minutes, against React's ~17.7 and Vue's ~11. Commit timestamps of agent runs: a proxy
for effort, not human time.
