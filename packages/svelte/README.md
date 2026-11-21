# @poc/svelte

The POC's primitives written from scratch for Svelte 5 (runes), with the same anatomy, attributes
and behaviour as `@poc/react` (`spec/`), and Svelte's own means (spec/README.md, "API mapping"):

- a namespace of components (`<Dialog.Popup>`), `bind:open` and `onOpenChange(open, details)`
  callback props;
- the `child` snippet as `render`: `{#snippet child({ props, state })}<section {...props} />{/snippet}`;
- `class` and `style` values; state through `data-*` (or the snippet's `state`);
- element registration through stable attachments, so a `child` snippet's element is registered too;
  a consumer reaches a part's element the same way, with its own `{@attach}` (passed on to the
  element), not a `bind:ref` prop;
- portals mount their content into `body` with no element of their own (as React's `createPortal`).

Source layout: `src/components/<component>/` (one part per `.svelte` file, the same names as
React, the namespace in `parts.ts`, the state in `*.svelte.ts` classes), `src/utils/`.
