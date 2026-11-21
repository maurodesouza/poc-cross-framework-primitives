### Lines of code (svelte)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 272 | 214 | 44% |
| popover | 362 | 381 | 51% |
| menu | 719 | 456 | 39% |
| combobox | 1260 | 750 | 37% |
| tabs | 369 | 67 | 15% |
| calendar | 710 | 271 | 28% |
| date-picker | 285 | 258 | 48% |
| select | 614 | 561 | 48% |
| tooltip | 395 | 280 | 41% |
| checkbox | 246 | 202 | 45% |
| checkbox-group | 136 | 0 | 0% |
| slider | 491 | 352 | 42% |
| field | 388 | 175 | 31% |

Shared framework infrastructure (hooks, utils): 446 lines. All of @poc/dom: 1926 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 4.7 kB | 16.6 kB |
| popover | 12.8 kB | 32.2 kB |
| menu | 14.9 kB | 40.1 kB |
| combobox | 17.9 kB | 36.3 kB |
| tabs | 3.4 kB | 8.0 kB |
| calendar | 5.8 kB | 26.3 kB |
| date-picker | 12.0 kB | 64.6 kB |
| select | 14.8 kB | 36.9 kB |
| tooltip | 12.1 kB | 33.7 kB |
| checkbox | 3.3 kB | 7.7 kB |
| checkbox-group | 1.5 kB | - |
| slider | 5.0 kB | 11.1 kB |
| field | 4.1 kB | - |

### Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
| angular | behaviour | 181 | 0 | 0 | 0 |
| angular | contract | 34 | 0 | 0 | 0 |
| angular | visual | 0 | 0 | 0 | 31 |
| baseline | behaviour | 162 | 0 | 19 | 0 |
| react | behaviour | 181 | 0 | 0 | 0 |
| react | contract | 34 | 0 | 0 | 0 |
| react | visual | 0 | 0 | 0 | 31 |
| solid | behaviour | 181 | 0 | 0 | 0 |
| solid | contract | 34 | 0 | 0 | 0 |
| solid | visual | 0 | 0 | 0 | 31 |
| svelte | behaviour | 181 | 0 | 0 | 0 |
| svelte | contract | 34 | 0 | 0 | 0 |
| svelte | visual | 0 | 0 | 0 | 31 |
| vue | behaviour | 181 | 0 | 0 | 0 |
| vue | contract | 34 | 0 | 0 | 0 |
| vue | visual | 0 | 0 | 0 | 31 |

### Effort (commits per component folder)

| component | commits | first | last |
| --- | --- | --- | --- |
| dialog | 2 | 2026-11-20T21:17:13-03:00 | 2026-11-20T21:22:17-03:00 |
| popover | 3 | 2026-11-20T21:17:13-03:00 | 2026-11-21T08:42:59-03:00 |
| menu | 3 | 2026-11-20T21:17:13-03:00 | 2026-11-21T08:42:59-03:00 |
| combobox | 5 | 2026-11-20T21:22:17-03:00 | 2026-11-21T14:18:43-03:00 |
| tabs | 2 | 2026-11-20T21:22:17-03:00 | 2026-11-21T08:42:59-03:00 |
| calendar | 1 | 2026-11-20T21:22:17-03:00 | 2026-11-20T21:22:17-03:00 |
| date-picker | 2 | 2026-11-20T21:22:17-03:00 | 2026-11-21T08:42:59-03:00 |
| select | 3 | 2026-11-21T08:36:03-03:00 | 2026-11-21T12:59:26-03:00 |
| tooltip | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
| checkbox | 2 | 2026-11-21T08:36:03-03:00 | 2026-11-21T12:43:25-03:00 |
| checkbox-group | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
| slider | 3 | 2026-11-21T08:36:03-03:00 | 2026-11-21T12:43:25-03:00 |
| field | 1 | 2026-11-21T12:43:25-03:00 | 2026-11-21T12:43:25-03:00 |
