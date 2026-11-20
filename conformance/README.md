# Conformance suite

One Playwright suite, run against every implementation of the specs (`../spec`). It is the referee
of the POC (AGENTS.md rule 4): an implementation conforms when it passes every layer it is
registered for, without a test written for it alone.

## Layers

| layer | file | checks | runs against |
| --- | --- | --- | --- |
| behaviour | `tests/<component>/behaviour.test.ts` | roles, accessible names, ARIA states, keyboard, focus, dismissal, geometry, axe (WCAG 2.1 A/AA). Finds elements by role and name only | every implementation, the baseline included |
| contract | `tests/<component>/contract.test.ts` | the spec's part attributes (`data-<component>-part`) and state attributes (present or absent, never `"false"`), exact cell names | the Fragiola implementations |
| visual | `tests/<component>/visual.test.ts` (from Epic B) | screenshots against **one** golden set | the Fragiola implementations |

The **baseline** (`fixtures/baseline-react`: Base UI 1.9, and React Aria Components for the
calendar family) runs the behaviour layer only: its own state attributes are not the spec's.

## Baseline deviations

When Base UI or React Aria differs from a spec, the test stays as the spec says, and:

1. the difference is written in the spec's "Baseline deviations" section;
2. the test calls `baselineDeviation("<what differs> (spec/<file>.md, Baseline deviations)")`
   (`src/deviation.ts`): an expected failure for the baseline project only.

If the baseline later passes the test, Playwright reports the stale mark. A test is never weakened
for one implementation.

## Running

```sh
pnpm e2e                          # every registered implementation
pnpm e2e -- --project baseline    # one implementation (its fixture is built and served)
pnpm --filter conformance exec playwright test tests/menu --project baseline
```

`--project` goes **after** the test paths. Only the fixtures of the selected projects are built and
served (`playwright.config.ts`). Locally a server already running on the port is reused.

Calendar scenarios fix "today" at 2026-11-20 with Playwright's clock (`src/scenario.ts`).

## Registering an implementation

Add it to `IMPLEMENTATIONS` in `src/implementations.ts`:

```ts
{ name: "react", fixture: "fixture-react", port: 5320, layers: ["behaviour", "contract", "visual"] }
```

- `fixture` is the fixture's package name; it must have `build` and `preview` scripts and render
  every scenario of the specs at `/<component>/<scenario>`, reading `?locale=` and `?dir=`.
- Pick a free port (the baseline uses 5310).

## Golden screenshots

The visual layer's `snapshotPathTemplate` leaves the project name out, so every implementation
compares against the same images in `snapshots/`. They are made by React (Epic B) **in CI's
Playwright image**, since local fonts render differently: the visual tests are skipped unless `CI`
or `VISUAL=1` is set.

To create or update them:

1. Push without the images (or with the changed ones removed). CI's E2E job writes the missing
   screenshots, fails, and uploads them as the `conformance-snapshots` artifact.
2. Download it into `conformance/snapshots` (`gh run download <run> -n conformance-snapshots -D conformance/snapshots`),
   review the images, commit them.

Other frameworks never update snapshots: when one differs, its DOM is fixed, not the image.
Animations are disabled, the caret hidden and the pointer parked at the top-left corner.

## Helpers (`src/`)

| file | what |
| --- | --- |
| `implementations.ts` | the registered implementations, and the `--project` parsing |
| `scenario.ts` | `openScenario(page, path, { locale, dir, today })` |
| `output.ts` | `expectOutput(page, key, value)` reads the fixture's `key: value` lines |
| `focus.ts` | `expectFocusWithin`, `isInertOrHidden` |
| `dates.ts` | expected `Intl` strings (full dates, month headings, weekdays) |
| `axe.ts` | `expectNoAxeViolations` |
| `contract.ts` | `part(page, component, name)`, `expectNoFalseStates` |
| `deviation.ts` | `baselineDeviation(reason)` |
