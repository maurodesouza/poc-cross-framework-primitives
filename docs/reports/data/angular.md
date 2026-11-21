### Lines of code (angular)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 270 | 219 | 45% |
| popover | 339 | 386 | 53% |
| menu | 701 | 461 | 40% |
| combobox | 525 | 320 | 38% |
| tabs | 374 | 72 | 16% |
| calendar | 750 | 453 | 38% |
| date-picker | 327 | 263 | 45% |

Shared framework infrastructure (hooks, utils): 500 lines. All of @poc/dom: 1111 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 4.3 kB | 16.0 kB |
| popover | 12.4 kB | 14.2 kB |
| menu | 14.4 kB | 8.0 kB |
| combobox | 12.9 kB | 8.6 kB |
| tabs | 3.0 kB | 5.5 kB |
| calendar | 5.4 kB | - |
| date-picker | 11.8 kB | - |

### Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
| angular | behaviour | 90 | 0 | 0 | 0 |
| angular | contract | 16 | 0 | 0 | 0 |
| angular | visual | 0 | 0 | 0 | 16 |
| baseline | behaviour | 79 | 0 | 11 | 0 |
| react | behaviour | 90 | 0 | 0 | 0 |
| react | contract | 16 | 0 | 0 | 0 |
| react | visual | 0 | 0 | 0 | 16 |
| solid | behaviour | 90 | 0 | 0 | 0 |
| solid | contract | 16 | 0 | 0 | 0 |
| solid | visual | 0 | 0 | 0 | 16 |
| svelte | behaviour | 90 | 0 | 0 | 0 |
| svelte | contract | 16 | 0 | 0 | 0 |
| svelte | visual | 0 | 0 | 0 | 16 |
| vue | behaviour | 90 | 0 | 0 | 0 |
| vue | contract | 16 | 0 | 0 | 0 |
| vue | visual | 0 | 0 | 0 | 16 |

### Effort (commits per component folder)

| component | commits | first | last |
| --- | --- | --- | --- |
| dialog | 1 | 2026-11-20T22:28:42-03:00 | 2026-11-20T22:28:42-03:00 |
| popover | 1 | 2026-11-20T22:29:27-03:00 | 2026-11-20T22:29:27-03:00 |
| menu | 1 | 2026-11-20T22:29:27-03:00 | 2026-11-20T22:29:27-03:00 |
| combobox | 1 | 2026-11-20T22:42:13-03:00 | 2026-11-20T22:42:13-03:00 |
| tabs | 1 | 2026-11-20T22:42:13-03:00 | 2026-11-20T22:42:13-03:00 |
| calendar | 1 | 2026-11-20T22:42:13-03:00 | 2026-11-20T22:42:13-03:00 |
| date-picker | 1 | 2026-11-20T22:42:13-03:00 | 2026-11-20T22:42:13-03:00 |
