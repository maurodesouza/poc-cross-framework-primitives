### Lines of code (react)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 272 | 233 | 46% |
| popover | 376 | 417 | 53% |
| menu | 750 | 457 | 38% |
| combobox | 545 | 277 | 34% |
| tabs | 366 | 49 | 12% |
| calendar | 788 | 232 | 23% |
| date-picker | 272 | 294 | 52% |

Shared framework infrastructure (hooks, utils): 372 lines. All of @poc/dom: 915 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 3.4 kB | 23.4 kB |
| popover | 10.8 kB | 40.2 kB |
| menu | 12.3 kB | 60.2 kB |
| combobox | 11.1 kB | 50.9 kB |
| tabs | 2.4 kB | 13.3 kB |
| calendar | 4.4 kB | 25.8 kB |
| date-picker | 10.1 kB | 34.4 kB |

### Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
| baseline | behaviour | 79 | 0 | 11 | 0 |
| react | behaviour | 90 | 0 | 0 | 0 |
| react | contract | 16 | 0 | 0 | 0 |
| react | visual | 0 | 0 | 0 | 16 |

### Effort (commits per component folder)

| component | commits | first | last |
| --- | --- | --- | --- |
| dialog | 1 | 2026-11-20T19:37:49-03:00 | 2026-11-20T19:37:49-03:00 |
| popover | 1 | 2026-11-20T19:37:49-03:00 | 2026-11-20T19:37:49-03:00 |
| menu | 1 | 2026-11-20T19:37:49-03:00 | 2026-11-20T19:37:49-03:00 |
| combobox | 1 | 2026-11-20T19:47:04-03:00 | 2026-11-20T19:47:04-03:00 |
| tabs | 1 | 2026-11-20T19:47:04-03:00 | 2026-11-20T19:47:04-03:00 |
| calendar | 1 | 2026-11-20T19:47:04-03:00 | 2026-11-20T19:47:04-03:00 |
| date-picker | 1 | 2026-11-20T19:47:04-03:00 | 2026-11-20T19:47:04-03:00 |
