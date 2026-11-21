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
- **parts rendered only in some states are structural**: `<div *tabsPanel="'account'">` renders
  its element only while its tab is selected (`*tabsPanel="'account'; keepMounted: true"` keeps it,
  `hidden`), and writes the panel's attributes on it.
- **children functions are `@for` over a directive's signal**, read through `exportAs`: the
  calendar's weeks (`@for (week of body.weeks(); ...)`), its weekdays, a cell's day number
  (`{{ cell.dayNumber() }}`) and the heading's month (`{{ heading.month() }}`) come from `Intl`
  through the directives, and the consumer writes them into its own elements.
- **typed values**: Calendar and RangeCalendar (DatePicker and DateRangePicker) are separate
  directives over one shared state, so `[(value)]` is typed `PlainDate | null` or
  `DateRange | null` under strict templates.
- **part hooks** are injection functions: `injectDialog()`, `injectPopover()`, `injectMenu()`,
  `injectTabs()`, `injectCombobox()`, `injectCalendar()` and `injectDatePicker()` give a
  component of the consumer's inside a root its `state` (and the root's own actions).

Components: Dialog, Popover, Menu (with submenus), Tabs, Combobox, Calendar, RangeCalendar,
DatePicker and DateRangePicker, with the parts of the specs.

Source layout: `src/lib/directives/<component>/<part>.directive.ts` (one part per file, the same
names as React's components), `src/lib/inject/` (the part hooks), `src/lib/utils/` (controllable
state, presence, overlay root, portal, positioning, state attributes), `src/public-api.ts`.

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
| fixture DOM | an Angular component has a host element, which React's tree does not: every scenario component uses an attribute selector and its host *is* an element of React's DOM (`<main scenario-dialog-basic>`, `<p placedPopover>`, `<pre fixtureOutput>`) | `fixtures/angular` |
| fixture text | Angular removes whitespace-only text nodes between tags (as JSX does), but keeps a collapsed space around text that touches a line break: text is written against its tags (`<label>Name<input /></label>`) | `fixtures/angular` |
| roots | a root has no element of its own: it is an attribute directive on an `<ng-container>` (a comment node), found by dependency injection | `@poc/angular` |
| change details | `model()` named `open` owns the `openChange` output, so the details come in `openChangeDetails` | `@poc/angular`, `spec/README.md` |
| portal | `*dialogPortal` without a value binds `""`: the input's transform reads it as the default container | `@poc/angular` |
| Menu keyboard | two quick ArrowDown presses both reached the trigger: zoneless Angular renders a state change in a later task, after input the browser already queued, so the popup (and the focus on its first item) came too late. An open change renders at once (`injectFlush`, `ApplicationRef.tick()` from the event handler), as React renders a discrete event's state before the next one | `@poc/angular` |
| submenu portal | a submenu's portal lives inside its parent's popup; destroying the parent's view detaches only that view's own nodes, so the submenu's nodes (moved to `body`) stayed: the portal removes the nodes it moved when it is destroyed | `@poc/angular` |
| disabled item | the consumer's `(click)` sits on the item's own element, so the item cannot leave it out as React does: a capturing listener on the item stops a disabled item's click before it (at the target, capturing listeners run first) | `@poc/angular` |
| submenus | one `MenuRoot` directive with two selectors, `[menuRoot]` and `[menuSubmenuRoot]`; the attribute (`HostAttributeToken`) tells a nested level apart, and it injects its parent level with `skipSelf` | `@poc/angular` |
| Tabs panel | a panel is not rendered while its tab is not selected (the contract counts one), and an attribute directive cannot remove its own element: the Panel is a structural directive | `@poc/angular`, `spec/README.md` |
| fixture text | JSX splits `{tab.label} settings` and `Choose date: {iso(value)}` into two text nodes; an Angular interpolation makes one. The fixture renders each run in its own `<ng-container>` inside an `@for`, so the text nodes match React's (comment nodes between them do not take part in layout) | `fixtures/angular` |
| calendar keyboard | a key that moves the focused date into another month destroys the focused cell; the next key would reach `body`. The grid renders at once after a key (`injectFlush`), and the root focuses the pending cell after every render | `@poc/angular` |
| calendar in a picker | choosing a date closes the picker, which returns focus to its trigger, while the calendar stays mounted for the exit animation: a calendar in a closing picker drops its pending focus (Solid's port found the same) | `@poc/angular` |
| typed models | one root directive for both modes would type `[(value)]` as `PlainDate \| DateRange \| null`, which strict templates reject on a `PlainDate` signal: two directives each (Calendar, RangeCalendar; DatePicker, DateRangePicker) over a shared state and an abstract base for the common inputs | `@poc/angular` |
| everything else | Tabs, Combobox (controlled input value included) and the calendar family passed behaviour, contract and visual on their first full run | |

