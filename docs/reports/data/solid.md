### Lines of code (solid)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 269 | 214 | 44% |
| popover | 342 | 381 | 53% |
| menu | 687 | 456 | 40% |
| combobox | 539 | 315 | 37% |
| tabs | 357 | 67 | 16% |
| calendar | 757 | 448 | 37% |
| date-picker | 254 | 258 | 50% |

Shared framework infrastructure (hooks, utils): 387 lines. All of @poc/dom: 1111 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 4.1 kB | 9.6 kB |
| popover | 12.1 kB | 19.4 kB |
| menu | 14.0 kB | 30.4 kB |
| combobox | 12.5 kB | 32.8 kB |
| tabs | 2.9 kB | 11.5 kB |
| calendar | 5.0 kB | - |
| date-picker | 11.4 kB | - |

### Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
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
| dialog | 1 | 2026-11-20T21:41:06-03:00 | 2026-11-20T21:41:06-03:00 |
| popover | 1 | 2026-11-20T21:41:06-03:00 | 2026-11-20T21:41:06-03:00 |
| menu | 1 | 2026-11-20T21:41:06-03:00 | 2026-11-20T21:41:06-03:00 |
| combobox | 1 | 2026-11-20T21:51:17-03:00 | 2026-11-20T21:51:17-03:00 |
| tabs | 1 | 2026-11-20T21:51:17-03:00 | 2026-11-20T21:51:17-03:00 |
| calendar | 1 | 2026-11-20T21:51:17-03:00 | 2026-11-20T21:51:17-03:00 |
| date-picker | 1 | 2026-11-20T21:51:17-03:00 | 2026-11-20T21:51:17-03:00 |
