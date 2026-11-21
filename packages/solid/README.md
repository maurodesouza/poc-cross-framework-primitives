# @poc/solid

The POC's primitives written from scratch for Solid 2.0 (`solid-js` 2.0, `@solidjs/web`), with the
same anatomy, attributes and behaviour as `@poc/react` (`spec/`), and Solid's own means
(spec/README.md, "API mapping"):

- a namespace of components (`<Dialog.Popup>`), `open={open()}` and `onOpenChange(open, details)`;
- `render={(props, state) => <section {...props} />}`: `props` is a reactive view (spread it),
  `state` a reactive object;
- `class` and `style` as a value or a function of the state; state through `data-*`;
- `ref` callbacks; focus targets as an element or a getter (`initialFocus={() => cancel}`), since a
  ref only exists once the part rendered;
- portals (`Portal` of `@solidjs/web`) insert the content into `body` with no element of their own
  (two empty text nodes mark its place), as React's `createPortal`.

Source layout: `src/components/<component>/` (one part per `.tsx` file, the same names as React,
the namespace in `parts.ts`), `src/hooks/` (`create*` primitives: controllable state, presence,
overlay root, positioner), `src/utils/` (`renderPart`, `mergeProps`, state attributes).

## How a part renders

`renderPart(tag, props, state, internal, options)` (`src/utils/part.tsx`) merges the part's
attributes with the consumer's in one memo, and hands the element a `merge()` view of it: Solid
re-applies what changed and never rebuilds the element. Two Solid 2 details shape it:

- the element comes from `dynamic(tag, { static: true })`; `<Dynamic component={tag}>` reads
  `component` through the merged props, so every change of the memo builds a new element;
- the part returns a memo, not a function: a parent resolving its children calls a function child
  again each time it re-resolves.

## Effect order

Solid runs effects parent first, where React runs a child's layout effects before its parent's,
and before any passive effect. Two parts depend on it:

- `Combobox.List` applies the highlight the keyboard asked for only once every rendered option has
  registered (its effect runs before the items' own);
- a calendar inside a closing picker takes no pending focus: the picker's popup returns focus to
  its trigger first, and a cell focused after it would take it back.

The dev build's diagnostics (`STRICT_READ_UNTRACKED`, `EFFECT_WRITES_OWN_SOURCE`, ...) are silent on
every scenario: reactive reads stay in computes and memos, writes in handlers and effect applies.

## Build

`vite build` in library mode with `@solidjs/vite-plugin` (the Solid 2 compiler, `@solidjs/compiler`;
Babel is optional and not used). tsdown has no Solid 2 JSX transform, so the package is the one
workspace that builds with Vite; `solid-js`, `@solidjs/web` and `@poc/dom` stay external.
