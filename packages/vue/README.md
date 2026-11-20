# @poc/vue

The POC's primitives written from scratch for Vue 3.5, with the same anatomy, attributes and
behaviour as `@poc/react` (`spec/`), and Vue's own means (spec/README.md, "API mapping"):

- a namespace of components (`Dialog.Popup`), `v-model:open` and `@open-change="(open, details) => ..."`;
- `as` (a tag or component) and the `#render="{ props, state, children }"` slot, never `asChild`;
- `class` and `style` as values; state through `data-*` (or the `render` slot's `state`);
- `initialFocus` / `finalFocus` also take a getter (`:initial-focus="() => cancel"`): a template
  unwraps a ref before the element inside the popup exists.

Source layout: `src/components/<component>/` (one part per file, the namespace in `parts.ts`, the
same file names as React), `src/composables/` (controllable state, presence, overlay root,
positioning), `src/utils/` (`renderPart`, state attributes, change details).
