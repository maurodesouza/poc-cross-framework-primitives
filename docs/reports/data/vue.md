### Lines of code (vue)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 273 | 214 | 44% |
| popover | 353 | 381 | 52% |
| menu | 778 | 456 | 37% |
| combobox | 589 | 315 | 35% |
| tabs | 396 | 83 | 17% |
| calendar | 792 | 271 | 25% |
| date-picker | 293 | 258 | 47% |

Shared framework infrastructure (hooks, utils): 419 lines. All of @poc/dom: 1111 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 3.7 kB | 11.6 kB |
| popover | 11.1 kB | 22.1 kB |
| menu | 12.6 kB | 28.0 kB |
| combobox | 11.3 kB | 31.6 kB |
| tabs | 2.4 kB | 7.9 kB |
| calendar | 4.5 kB | 22.3 kB |
| date-picker | 10.3 kB | 38.7 kB |

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
| dialog | 2 | 2026-11-20T20:06:07-03:00 | 2026-11-20T21:09:33-03:00 |
| popover | 2 | 2026-11-20T20:06:07-03:00 | 2026-11-20T21:09:33-03:00 |
| menu | 2 | 2026-11-20T20:06:07-03:00 | 2026-11-20T21:09:33-03:00 |
| combobox | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T21:09:33-03:00 |
| tabs | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T21:09:33-03:00 |
| calendar | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T20:11:50-03:00 |
| date-picker | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T21:09:33-03:00 |
