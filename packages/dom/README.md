# @poc/dom

Framework-free DOM behaviours and pure math, shared by every framework package of the POC.

**The boundary (AGENTS.md rule 2):** functions and small classes that take elements and options and
return values or a cleanup. Never a component's open, selected or value state, its lifecycle or its
API. No framework import (`tests/guard.test.ts`). The only runtime dependency is `@floating-ui/dom`.

| folder | exports | used by |
| --- | --- | --- |
| `positioning/` | `anchorFloating(anchor, floating, options)` → cleanup; `toPlacement`, `fromPlacement` (logical `start`/`end` ↔ physical) | Popover, Menu, Combobox, DatePicker |
| `overlay/` | `openOverlaySession(document, { elements, ignore, dismiss, focusOut, returnFocus })` → `{ elementsAbove, end }`: the layer, the focus-out watch and the focus return of an overlay | every overlay |
| `layers/` | `pushLayer(document, { elements, ignore, onEscape, onOutsidePress })` → `{ isTop, remove }`; `watchFocusOutside` | every overlay |
| `focus/` | `getTabbables`, `nextTabbableAfter`, `trapFocus`, `focusInitial`, `isKeyboardModality` | Dialog (trap), Popover (tab order) |
| `scroll-lock/` | `lockScroll(document)` → unlock (counted) | Dialog |
| `inert/` | `inertOutside(elements)` → restore | Dialog |
| `collection/` | `stepIndex`, `edgeIndex`, `stepThroughNone` (list navigation), `tabsKeyTarget`, `menuKeyTarget`, `submenuKeys` (key maps), `createTypeahead` | Menu, Tabs, Combobox |
| `presence/` | `nextFrame`, `waitForAnimations` | enter and exit states |
| `pointer/` | `isInSafeArea` (the submenu's safe hover triangle) | Menu |
| `id/`, `direction/` | `createId`, `getDirection` | |
| `date/` | `PlainDate` and its math (`addDays`, `addMonths`, `startOfWeek`, ...), `monthGrid`, locale data (`firstDayOfWeek`, `weekdays`, `formatMonthYear`, `formatFullDate`, `formatDayNumber`) | the calendar family |

The package is private and exported from its sources (`exports: "./src/index.ts"`); `pnpm build`
(tsdown) only proves it bundles. Date functions that are only used together share a file
(`date-math.ts`, `locale-data.ts`), as the source layout allows.
