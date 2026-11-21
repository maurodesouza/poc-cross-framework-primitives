# @poc/angular

The POC's primitives written from scratch for **Angular 22** (standalone directives, signals,
zoneless), with the same anatomy, attributes and behaviour as `@poc/react` (`spec/`), and
Angular's own means (spec/README.md, "API mapping by framework"):

- **a directive per part, on the consumer's own element**: `<button dialogTrigger>`,
  `<div dialogPopup>`. The element is the consumer's (Angular's `render`): its tag, its `class`,
  its listeners. Selectors are `[dialogPopup]`, classes `DialogPopup`, `exportAs` `dialogPopup`.
- **roots render nothing**: `<ng-container dialogRoot [(open)]="open">`. Parts find their root by
  dependency injection, so a part works anywhere inside it, a component of the consumer's included.
- **state**: `open = model<boolean>()` (two-way `[(open)]`, one-way `[open]`, or the root's own,
  seeded once by `defaultOpen`); `(openChangeDetails)` emits `{ open, details }` with the reason,
  besides the model's own `(openChange)`. Values follow the same shape (`[(value)]`,
  `(valueChangeDetails)`). Each part exposes a `state()` signal through `exportAs`
  (`#popup="dialogPopup"`), and writes it as `data-*` attributes.
- **portals are structural**: `<ng-container *dialogPortal>` renders its view while the overlay is
  open or closing and moves its nodes to `body` (or `*dialogPortal="element"`); the view keeps its
  declaration's injectors and change detection.
- **focus targets** take an element (a template reference variable, `[initialFocus]="cancel"`),
  an `ElementRef`, a getter, or `false`.
- **part hooks** are injection functions: `injectDialog()` gives a component inside the dialog its
  root's `state` and `setOpen`.

Source layout: `src/lib/directives/<component>/<part>.directive.ts` (one part per file, the same
names as React's components), `src/lib/inject/` (the part hooks), `src/lib/utils/` (controllable
state, presence, overlay root, portal, state attributes), `src/public-api.ts`.

## Build

`ng-packagr` (the Angular Package Format, partial compilation) with TypeScript 6.0.3, pinned in
this package and the fixture only (the Angular compiler supports `>=6.0 <6.1`), as Dockable's
Angular adapter does. `@poc/dom` stays a dependency. The sources import with `.ts` extensions like
the rest of the repository, so the build sets `rewriteRelativeImportExtensions`.

The fixture (`fixtures/angular`) compiles these sources with the app, through
`@analogjs/vite-plugin-angular`.

## Port log

| part of the port | finding | fixed in |
| --- | --- | --- |
| fixture DOM | an Angular component has a host element, which React's tree does not: every scenario component uses an attribute selector and its host *is* an element of React's DOM (`<main scenario-dialog-basic>`, `<pre fixtureOutput>`) | `fixtures/angular` |
| fixture text | Angular removes whitespace-only text nodes between tags (as JSX does), but keeps a collapsed space around text that touches a line break: text is written against its tags (`<label>Name<input /></label>`) | `fixtures/angular` |
| roots | a root has no element of its own: it is an attribute directive on an `<ng-container>` (a comment node), found by dependency injection | `@poc/angular` |
| change details | `model()` named `open` owns the `openChange` output, so the details come in `openChangeDetails` | `@poc/angular`, `spec/README.md` |
| portal | `*dialogPortal` without a value binds `""`: the input's transform reads it as the default container | `@poc/angular` |
