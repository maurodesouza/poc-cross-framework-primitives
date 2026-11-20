# @poc/react

The POC's primitives written from scratch for React 19, following `spec/` and the primitive
contract of `AGENTS.md`. Behaviour that is not React state comes from `@poc/dom`.

```tsx
import { Dialog } from "@poc/react";

<Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
    </Dialog.Portal>
</Dialog.Root>
```

| namespace | spec |
| --- | --- |
| `Dialog` | `spec/dialog.md` |
| `Popover` | `spec/popover.md` |
| `Menu` (with `SubmenuRoot`, `SubmenuTrigger`) | `spec/menu.md` |

Every part takes `render` (an element or `(props, state) => node`), `className` and `style` (a
value or a function of the state) and a `ref`; other props are forwarded, handlers run after the
part's own. State is only in `data-*` and ARIA.

Source layout: `src/components/<component>/` (one part per file, the namespace in `parts.ts`),
`src/hooks/` (controllable state, presence, overlay root, positioning), `src/utils/` (`render`,
props and refs merging, state attributes).
