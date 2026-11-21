### Lines of code (svelte)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 272 | 214 | 44% |
| popover | 362 | 381 | 51% |
| menu | 719 | 456 | 39% |
| combobox | 560 | 315 | 36% |
| tabs | 369 | 67 | 15% |
| calendar | 710 | 271 | 28% |
| date-picker | 285 | 258 | 48% |
| select | 595 | 404 | 40% |
| tooltip | 395 | 280 | 41% |
| checkbox | 232 | 45 | 16% |
| checkbox-group | 136 | 0 | 0% |
| slider | 466 | 195 | 30% |

Shared framework infrastructure (hooks, utils): 344 lines. All of @poc/dom: 1479 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 4.7 kB | 16.6 kB |
| popover | 12.8 kB | 32.2 kB |
| menu | 14.9 kB | 40.1 kB |
| combobox | 13.3 kB | 36.3 kB |
| tabs | 3.4 kB | 8.0 kB |
| calendar | 5.8 kB | 26.3 kB |
| date-picker | 12.0 kB | 64.6 kB |
| select | 14.2 kB | 36.9 kB |
| tooltip | 12.1 kB | 33.7 kB |
| checkbox | 2.8 kB | 7.7 kB |
| checkbox-group | 1.5 kB | - |
| slider | 4.3 kB | 11.1 kB |

### Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
| angular | behaviour | 140 | 0 | 0 | 0 |
| angular | contract | 24 | 0 | 0 | 0 |
| angular | visual | 0 | 0 | 0 | 24 |
| baseline | behaviour | 123 | 0 | 17 | 0 |
| react | behaviour | 140 | 0 | 0 | 0 |
| react | contract | 24 | 0 | 0 | 0 |
| react | visual | 0 | 0 | 0 | 24 |
| solid | behaviour | 140 | 0 | 0 | 0 |
| solid | contract | 24 | 0 | 0 | 0 |
| solid | visual | 0 | 0 | 0 | 24 |
| svelte | behaviour | 140 | 0 | 0 | 0 |
| svelte | contract | 24 | 0 | 0 | 0 |
| svelte | visual | 0 | 0 | 0 | 24 |
| vue | behaviour | 140 | 0 | 0 | 0 |
| vue | contract | 24 | 0 | 0 | 0 |
| vue | visual | 0 | 0 | 0 | 24 |

### Effort (commits per component folder)

| component | commits | first | last |
| --- | --- | --- | --- |
| dialog | 2 | 2026-11-20T21:17:13-03:00 | 2026-11-20T21:22:17-03:00 |
| popover | 3 | 2026-11-20T21:17:13-03:00 | 2026-11-21T08:42:59-03:00 |
| menu | 3 | 2026-11-20T21:17:13-03:00 | 2026-11-21T08:42:59-03:00 |
| combobox | 3 | 2026-11-20T21:22:17-03:00 | 2026-11-21T08:42:59-03:00 |
| tabs | 2 | 2026-11-20T21:22:17-03:00 | 2026-11-21T08:42:59-03:00 |
| calendar | 1 | 2026-11-20T21:22:17-03:00 | 2026-11-20T21:22:17-03:00 |
| date-picker | 2 | 2026-11-20T21:22:17-03:00 | 2026-11-21T08:42:59-03:00 |
| select | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
| tooltip | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
| checkbox | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
| checkbox-group | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
| slider | 1 | 2026-11-21T08:36:03-03:00 | 2026-11-21T08:36:03-03:00 |
