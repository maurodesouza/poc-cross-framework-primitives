### Lines of code (svelte)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 272 | 214 | 44% |
| popover | 360 | 381 | 51% |
| menu | 717 | 456 | 39% |
| combobox | 557 | 315 | 36% |
| tabs | 366 | 67 | 15% |
| calendar | 710 | 271 | 28% |
| date-picker | 283 | 258 | 48% |

Shared framework infrastructure (hooks, utils): 332 lines. All of @poc/dom: 1111 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 4.7 kB | 16.6 kB |
| popover | 12.8 kB | 32.2 kB |
| menu | 14.9 kB | 40.1 kB |
| combobox | 13.3 kB | 36.3 kB |
| tabs | 3.3 kB | 8.0 kB |
| calendar | 5.8 kB | 26.3 kB |
| date-picker | 12.0 kB | 64.6 kB |

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
| dialog | 2 | 2026-11-20T21:17:13-03:00 | 2026-11-20T21:22:17-03:00 |
| popover | 2 | 2026-11-20T21:17:13-03:00 | 2026-11-20T21:22:17-03:00 |
| menu | 2 | 2026-11-20T21:17:13-03:00 | 2026-11-20T21:22:17-03:00 |
| combobox | 1 | 2026-11-20T21:22:17-03:00 | 2026-11-20T21:22:17-03:00 |
| tabs | 1 | 2026-11-20T21:22:17-03:00 | 2026-11-20T21:22:17-03:00 |
| calendar | 1 | 2026-11-20T21:22:17-03:00 | 2026-11-20T21:22:17-03:00 |
| date-picker | 1 | 2026-11-20T21:22:17-03:00 | 2026-11-20T21:22:17-03:00 |
