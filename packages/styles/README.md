# @poc/styles

The single styling layer of the POC: the same classes dress every framework's primitives, so the
UI is the same in React, Vue, Angular, Svelte and Solid.

- `@poc/styles/theme.css`: the Tailwind v4 `@theme` with the Fragiola palette roles (`base`,
  `soft`, `line`, `contrast`, `accent`, `ring`) and three palettes (`palette-surface`,
  `palette-raised`, `palette-purple`), light and dark from `data-theme` on the root element.
- `@poc/styles`: one recipe per component (`dialog`, `popover`, `menu`, `combobox`, `tabs`,
  `calendar`, `datePicker`), mapping each part of its spec to a class string. Classes select state
  through the specs' `data-*` attributes only (`data-open:`, `data-highlighted:`,
  `data-[side=top]:`), with logical properties and no `!important`.

```css
@import "tailwindcss";
@import "@poc/styles/theme.css";
@source "../node_modules/@poc/styles/src";
```

Each fixture writes thin styled wrappers that put `recipe[part]` on the primitive of that part.
`tests/spec-coverage.test.ts` fails when a part of a spec's anatomy has no recipe, or a recipe has
a part the spec does not name.
