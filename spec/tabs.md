# Tabs

## Purpose

Layered sections of content, one visible at a time, chosen from a list of tabs (APG `tabs`).

## Anatomy

| part | element | `data-tabs-part` | notes |
| --- | --- | --- | --- |
| Root | `div` | `root` | holds the state |
| List | `div` | `list` | the `tablist` |
| Tab | `button` | `tab` | |
| Indicator | `span` | `indicator` | follows the selected tab; optional |
| Panel | `div` | `panel` | the content of one tab |

## API

**Root**: `value`, `defaultValue` (the first enabled tab's value), `onValueChange(value,
details)`, `orientation` (`"horizontal"`), `activation` (`"automatic"`: moving focus selects;
`"manual"`: Enter or Space selects), `loop` (`true`).

**Tab**: `value` (string, required), `disabled`.

**Panel**: `value` (string, required), `keepMounted` (`false`: an inactive panel is not rendered;
`true`: it is rendered with `hidden`).

**Indicator**: no props. It exposes the selected tab's box, relative to the List, as structural
CSS variables: `--tabs-indicator-inset-inline-start`, `--tabs-indicator-inset-block-start`,
`--tabs-indicator-inline-size`, `--tabs-indicator-block-size`. It is not rendered while no tab is
selected.

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Root | `data-orientation`, `data-activation` |
| List | `role="tablist"`, `aria-orientation`, `data-orientation` |
| Tab | `role="tab"`, an `id`, `aria-selected` (`"true"` / `"false"`, as ARIA requires both), `aria-controls` (its panel's id), `tabindex` (`0` on the tab that holds the roving focus, `-1` on the others), `aria-disabled="true"` and `data-disabled` when disabled, `data-selected`, `data-orientation` |
| Indicator | `aria-hidden="true"`, `data-orientation` |
| Panel | `role="tabpanel"`, an `id`, `aria-labelledby` (its tab's id), `tabindex="0"`, `data-selected` when its tab is selected, `hidden` when kept mounted and inactive, `data-orientation` |

The tab that holds the roving focus (`tabindex="0"`) is the selected tab, else the first enabled
tab.

## Keyboard

| key | horizontal | vertical |
| --- | --- | --- |
| next tab | ArrowRight (ArrowLeft in RTL) | ArrowDown |
| previous tab | ArrowLeft (ArrowRight in RTL) | ArrowUp |
| Home / End | first / last enabled tab | same |
| Enter, Space | selects the focused tab (`manual`; in `automatic` it is already selected) | same |
| Tab | from the tab list to the selected panel | same |

Arrow keys and Home/End move focus to enabled tabs only, wrapping when `loop`. In `automatic`
activation, moving focus selects the tab (reason `list-navigation`). A click reports
`trigger-press`.

## Focus

Roving tabindex: the tab list is one tab stop. The panel is the next one (`tabindex="0"`), so its
content is reachable even when it holds nothing focusable.

## Pointer

Clicking an enabled tab selects it and focuses it.

## Dismissal and layering

Not applicable.

## Positioning

Not applicable (the Indicator's variables are measurements, not positioning).

## Animation

None of its own. The Indicator's variables change when the selection changes, so a CSS transition
on them animates it.

## RTL

In horizontal orientation, ArrowLeft moves to the next tab and ArrowRight to the previous one. The
Indicator's inline-start variable is measured from the List's inline-start edge.

## Scenarios

### `/tabs/automatic`

Content: tabs **"Account"**, **"Password"**, **"Billing"** (disabled), **"Team"** with panels
holding the paragraphs "Account settings", "Password settings", "Billing settings", "Team
settings"; an Indicator; a button **"After tabs"** after the panels. Output: `value: ...`.

Checks:

1. A `tablist` with four `tab`s; "Account" has `aria-selected="true"` and `tabindex="0"`, the
   others `aria-selected="false"` and `tabindex="-1"`.
2. The visible `tabpanel` is named "Account" and contains "Account settings".
3. Focus "Account", ArrowRight: "Password" is focused, selected (`value: password`), and its panel
   is visible.
4. ArrowRight skips "Billing" (`aria-disabled="true"`) to "Team"; ArrowRight wraps to "Account";
   End → "Team"; Home → "Account".
5. Tab from the selected tab focuses its panel; Tab again focuses "After tabs".
6. Clicking "Team" selects it.
7. Axe finds no violation.

### `/tabs/manual`

The same content with `activation="manual"`.

Checks: ArrowRight moves focus to "Password" while "Account" stays selected (`value: account`);
Enter selects "Password"; Space on "Team" (after ArrowRight) selects it.

### `/tabs/vertical`

The same content with `orientation="vertical"`.

Checks: the tablist has `aria-orientation="vertical"`; ArrowDown and ArrowUp move between tabs;
ArrowRight does nothing.

### `/tabs/automatic?dir=rtl`

The automatic scenario in `dir="rtl"`.

Checks: from "Account", ArrowLeft moves to "Password" (next); from "Password", ArrowRight moves
back to "Account" (previous); from "Account", ArrowRight wraps to "Team" (previous, skipping
nothing).

## Baseline deviations

Filled by the conformance work.
