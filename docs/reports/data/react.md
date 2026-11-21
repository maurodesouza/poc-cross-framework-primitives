### Lines of code (react)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 278 | 214 | 43% |
| popover | 368 | 381 | 51% |
| menu | 743 | 456 | 38% |
| combobox | 542 | 315 | 37% |
| tabs | 347 | 67 | 16% |
| calendar | 755 | 271 | 26% |
| date-picker | 265 | 258 | 49% |

Shared framework infrastructure (hooks, utils): 372 lines. All of @poc/dom: 1111 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 3.6 kB | 23.4 kB |
| popover | 10.9 kB | 40.2 kB |
| menu | 12.6 kB | 60.2 kB |
| combobox | 11.3 kB | 50.9 kB |
| tabs | 2.5 kB | 13.3 kB |
| calendar | 4.5 kB | 25.8 kB |
| date-picker | 10.3 kB | 34.4 kB |

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
| dialog | 2 | 2026-11-20T19:37:49-03:00 | 2026-11-20T21:09:33-03:00 |
| popover | 2 | 2026-11-20T19:37:49-03:00 | 2026-11-20T21:09:33-03:00 |
| menu | 3 | 2026-11-20T19:37:49-03:00 | 2026-11-20T21:09:33-03:00 |
| combobox | 3 | 2026-11-20T19:47:04-03:00 | 2026-11-20T21:09:33-03:00 |
| tabs | 2 | 2026-11-20T19:47:04-03:00 | 2026-11-20T21:09:33-03:00 |
| calendar | 3 | 2026-11-20T19:47:04-03:00 | 2026-11-20T20:11:50-03:00 |
| date-picker | 2 | 2026-11-20T19:47:04-03:00 | 2026-11-20T21:09:33-03:00 |
