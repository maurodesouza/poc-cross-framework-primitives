### Lines of code (vue)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 272 | 233 | 46% |
| popover | 366 | 417 | 53% |
| menu | 780 | 471 | 38% |
| combobox | 591 | 334 | 36% |
| tabs | 416 | 79 | 16% |
| calendar | 792 | 271 | 25% |
| date-picker | 305 | 294 | 49% |

Shared framework infrastructure (hooks, utils): 419 lines. All of @poc/dom: 973 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 3.5 kB | 11.6 kB |
| popover | 10.9 kB | 22.1 kB |
| menu | 12.3 kB | 28.0 kB |
| combobox | 11.1 kB | 31.6 kB |
| tabs | 2.4 kB | 7.9 kB |
| calendar | 4.5 kB | 22.3 kB |
| date-picker | 10.2 kB | 38.7 kB |

### Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
| baseline | behaviour | 79 | 0 | 11 | 0 |
| react | behaviour | 90 | 0 | 0 | 0 |
| react | contract | 16 | 0 | 0 | 0 |
| react | visual | 0 | 0 | 0 | 16 |
| vue | behaviour | 90 | 0 | 0 | 0 |
| vue | contract | 16 | 0 | 0 | 0 |
| vue | visual | 0 | 0 | 0 | 16 |

### Effort (commits per component folder)

| component | commits | first | last |
| --- | --- | --- | --- |
| dialog | 1 | 2026-11-20T20:06:07-03:00 | 2026-11-20T20:06:07-03:00 |
| popover | 1 | 2026-11-20T20:06:07-03:00 | 2026-11-20T20:06:07-03:00 |
| menu | 1 | 2026-11-20T20:06:07-03:00 | 2026-11-20T20:06:07-03:00 |
| combobox | 1 | 2026-11-20T20:11:34-03:00 | 2026-11-20T20:11:34-03:00 |
| tabs | 1 | 2026-11-20T20:11:34-03:00 | 2026-11-20T20:11:34-03:00 |
| calendar | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T20:11:50-03:00 |
| date-picker | 1 | 2026-11-20T20:11:34-03:00 | 2026-11-20T20:11:34-03:00 |
