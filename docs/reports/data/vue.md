### Lines of code (vue)

| component | framework package | @poc/dom used | share in @poc/dom |
| --- | --- | --- | --- |
| dialog | 273 | 214 | 44% |
| popover | 353 | 381 | 52% |
| menu | 778 | 456 | 37% |
| combobox | 1361 | 634 | 32% |
| tabs | 396 | 83 | 17% |
| calendar | 792 | 271 | 25% |
| date-picker | 293 | 258 | 47% |
| select | 646 | 445 | 41% |
| tooltip | 406 | 280 | 41% |
| checkbox | 259 | 102 | 28% |
| checkbox-group | 104 | 0 | 0% |
| slider | 508 | 252 | 33% |
| field | 450 | 191 | 30% |

Shared framework infrastructure (hooks, utils): 530 lines. All of @poc/dom: 1926 lines.

### Bundle size (minified + gzip, framework external)

| component | ours | baseline |
| --- | --- | --- |
| dialog | 3.7 kB | 11.6 kB |
| popover | 11.1 kB | 22.1 kB |
| menu | 12.6 kB | 28.0 kB |
| combobox | 14.9 kB | 31.6 kB |
| tabs | 2.4 kB | 7.9 kB |
| calendar | 4.5 kB | 22.3 kB |
| date-picker | 10.3 kB | 38.7 kB |
| select | 12.4 kB | 29.3 kB |
| tooltip | 10.4 kB | 20.5 kB |
| checkbox | 2.4 kB | 9.2 kB |
| checkbox-group | 0.9 kB | 4.6 kB |
| slider | 3.8 kB | 7.8 kB |
| field | 3.0 kB | - |

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
| dialog | 2 | 2026-11-20T20:06:07-03:00 | 2026-11-20T21:09:33-03:00 |
| popover | 2 | 2026-11-20T20:06:07-03:00 | 2026-11-20T21:09:33-03:00 |
| menu | 2 | 2026-11-20T20:06:07-03:00 | 2026-11-20T21:09:33-03:00 |
| combobox | 5 | 2026-11-20T20:11:34-03:00 | 2026-11-21T14:18:43-03:00 |
| tabs | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T21:09:33-03:00 |
| calendar | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T20:11:50-03:00 |
| date-picker | 2 | 2026-11-20T20:11:34-03:00 | 2026-11-20T21:09:33-03:00 |
| select | 3 | 2026-11-21T07:47:29-03:00 | 2026-11-21T12:59:26-03:00 |
| tooltip | 2 | 2026-11-21T07:47:29-03:00 | 2026-11-21T08:11:23-03:00 |
| checkbox | 2 | 2026-11-21T07:47:29-03:00 | 2026-11-21T12:42:23-03:00 |
| checkbox-group | 2 | 2026-11-21T07:47:29-03:00 | 2026-11-21T07:50:39-03:00 |
| slider | 2 | 2026-11-21T07:47:29-03:00 | 2026-11-21T12:42:23-03:00 |
| field | 1 | 2026-11-21T12:42:23-03:00 | 2026-11-21T12:42:23-03:00 |
