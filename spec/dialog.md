# Dialog

## Purpose

A **modal** dialog: a window over the page that takes focus, traps it, makes the rest of the page
inert and returns focus when it closes (APG `dialog-modal`). Non-modal floating content is
[Popover](popover.md). Alert dialogs are out of scope.

## Anatomy

| part | element | `data-dialog-part` | notes |
| --- | --- | --- | --- |
| Root | none (renders no element) | | holds the state |
| Trigger | `button` | `trigger` | opens the dialog |
| Portal | none | | moves Backdrop and Popup to the end of `body` (or a given container) |
| Backdrop | `div` | `backdrop` | covers the page; optional |
| Popup | `div` | `popup` | the dialog itself |
| Title | `h2` | `title` | names the dialog |
| Description | `p` | `description` | describes the dialog |
| Close | `button` | `close` | closes the dialog |

## API

**Root**: `open`, `defaultOpen` (`false`), `onOpenChange(open, details)`.

**Trigger**: `disabled`.

**Portal**: `container` (an element; defaults to `body`).

**Popup**: `initialFocus` (element to focus on open; default: the first tabbable element inside,
else the popup itself), `finalFocus` (element to focus on close; default: the trigger, or the
element that had focus before opening when it was opened programmatically).

**Title**, **Description**, **Close**: no props of their own beyond the contract.

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (the popup's id while open), `data-open` while open, `data-disabled` |
| Backdrop | `data-open`, `data-starting-style`, `data-ending-style`; `aria-hidden="true"` |
| Popup | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (the Title's id when a Title exists), `aria-describedby` (the Description's id when one exists), `tabindex="-1"`, `data-open`, `data-starting-style`, `data-ending-style` |
| Title, Description | an `id` (generated unless given) |
| Close | none beyond the part attribute |

## Keyboard

| key | action |
| --- | --- |
| Enter, Space on Trigger | opens (native button activation) |
| Tab | moves to the next tabbable element inside the popup; from the last, wraps to the first |
| Shift+Tab | the reverse; from the first, wraps to the last |
| Escape | closes (reason `escape-key`), unless a child layer is open: then only that layer closes |

## Focus

- On open, focus moves to `initialFocus`, else the first tabbable element of the popup, else the
  popup itself.
- Focus is trapped inside the popup (and its child layers) while open.
- On close, focus moves to `finalFocus`, else the trigger.
- Everything outside the portal content is made inert (`inert`, or `aria-hidden` plus focus
  guards where `inert` is unavailable) while open.

## Pointer

- A press on the Trigger opens. A press on Close closes (reason `close-press`).
- A press outside the popup (on the backdrop or anywhere else) closes (reason `outside-press`),
  except on an element inside a child layer.

## Dismissal and layering

- The dialog is a **layer**. Escape and outside presses go to the topmost open layer only.
- A layer opened inside the popup (a Popover, a Menu) is its child: pressing inside the child is
  not an outside press for the dialog, and Escape closes the child first.
- While open, the page does not scroll (scroll lock on the document element, keeping the
  scrollbar gutter so the layout does not shift).

## Positioning

None: the popup is centred by the consumer's styles. The primitive sets no position.

## Animation

Backdrop and Popup carry `data-starting-style` for the first frame after mounting, and
`data-ending-style` while closing. They unmount when every animation on them has finished
(`element.getAnimations()`), or at once when there is none. Focus returns on close immediately,
not after the exit animation.

## RTL

Nothing changes in behaviour.

## Scenarios

### `/dialog/basic`

Content:

- a button **"Open dialog"** (Trigger);
- a button **"Outside button"** in the page, outside the dialog;
- the popup with Title **"Edit profile"**, Description **"Change your display name."**, a text
  input labelled **"Name"**, a button **"Save"** (closes the dialog through a Close part) and a
  button **"Close"** (Close);
- a Backdrop;
- the page is taller than the viewport (so scroll lock is observable).

Output: `open: <true|false>` and `reason: <last reason>`.

Checks:

1. Trigger has `aria-haspopup="dialog"` and `aria-expanded="false"`; after opening, `"true"` and
   `aria-controls` pointing at the dialog.
2. Clicking "Open dialog" shows a `dialog` named "Edit profile" and described by "Change your
   display name.", with `aria-modal="true"`.
3. Focus is on the "Name" input.
4. Tab moves to "Save", then "Close", then wraps to "Name"; Shift+Tab from "Name" goes to "Close".
5. "Outside button" is not reachable by Tab and is inert.
6. Mouse wheel over the page does not scroll it while open.
7. Escape closes; output `reason: escape-key`; focus is back on "Open dialog".
8. Reopen, click the backdrop area: closes with `reason: outside-press`.
9. Reopen, click "Close": closes with `reason: close-press`; focus on the trigger.
10. Axe finds no violation with the dialog open.

### `/dialog/initial-focus`

A Trigger **"Delete file"**; the popup has Title **"Delete file?"**, then a button **"Delete"**,
then a button **"Cancel"** (Close), in this DOM order, with `initialFocus` set to "Cancel".

Checks: on open, focus is on "Cancel", not on "Delete" (the first tabbable element).

### `/dialog/nested-popover`

The popup of `/dialog/basic` (Title **"Edit profile"**) also holds a Popover Trigger **"More
info"**, whose popup has Title **"About names"** and a button **"Got it"** (Close).

Checks:

1. Open the dialog, open the popover: focus is inside the popover.
2. Escape closes only the popover; the dialog stays open; focus is back on "More info".
3. Open the popover, click on the dialog's Title: only the popover closes.
4. Escape again closes the dialog.

### `/dialog/controlled`

The fixture holds `open` in its own state; a button **"Open dialog"** outside the Dialog sets it
to `true` (there is no Trigger part), and the popup has Title **"Controlled"** and a Close
**"Close"**. Output: `open: ...`, `reason: ...`.

Checks: the external button opens the dialog; Close sets `open: false` with
`reason: close-press`; focus goes back to the external button (the element focused before
opening).

### `/dialog/rejected-close`

As `/dialog/controlled` (an external button **"Open dialog"**, no Trigger), with a Backdrop, a
Title **"Locked"** and a Close **"Close"**, but the fixture keeps `open: true` once opened: it
records each change's reason and ignores a change to `false`. Output: `open: ...`, `reason: ...`.

Checks (spec/README.md, "A controlled value the consumer rejects"): open it, focus is on "Close";
Escape reports `reason: escape-key` and the dialog stays open with focus on "Close"; a click
outside reports `reason: outside-press` and the dialog stays open; "Close" reports
`reason: close-press`, `open: true` and the dialog stays open; Escape still works afterwards (no
broken layer) and the outside stays inert.

## Baseline deviations

Measured against Base UI 1.9 (`fixtures/baseline-react`). Each one is marked on its test with
`baselineDeviation` (`conformance/src/deviation.ts`): an expected failure for the baseline only.

| difference | test |
| --- | --- |
| The popup sets no `aria-modal="true"`: Base UI relies on making the outside inert. The spec keeps `aria-modal`, as the APG asks for a modal dialog | `dialog / basic › opens a named, described, modal dialog ...` |

