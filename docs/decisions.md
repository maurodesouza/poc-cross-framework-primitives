# Decisions

The maintainer's decisions on the deliberate differences between the POC and Base UI
(`docs/reports/production-scope.md`, section 4). Each entry says what was decided, why, and its
status:

- **applied**: the specs, the tests and the five implementations follow it;
- **applied in Epic I**: applied with Combobox's Fragiola UI parity (Epic I, #62): `spec/combobox.md`
  ("What changed in Epic I, and why"), its tests, the baseline and the five implementations;
- **pending**: decided, but applied only in the production version. The specs, the tests and the
  implementations keep the POC's behaviour until then.

## 2026-11-21: follow Base UI, with two exceptions

**Decision (maintainer):** the production version follows Base UI's behaviour, because Fragiola UI
is built on Base UI today and its users expect that behaviour. There are two exceptions, where the
POC's choice is kept: Tooltip's ARIA wiring and Select's placement.

**This cycle** applies only the Combobox decisions (Epic I). The others change specs, tests and
five implementations each, for no new data on the POC's question. They are recorded here and wait
for the production version. The renames, in particular, are applied to every component at once,
so the five packages stay consistent.

| # | difference | POC today | decision | status |
| --- | --- | --- | --- | --- |
| 1 | Select placement | the list opens below the trigger | **keep the POC**: the list opens below the trigger, with no `alignItemWithTrigger` | kept (nothing to apply) |
| 2 | Select focus | DOM focus stays on the trigger, with `aria-activedescendant`; Tab chooses the highlighted option | **Base UI**: focus moves into the list; Tab closes it without choosing | pending |
| 3 | Select typing while closed | opens the list on the matching option | **Base UI**: chooses the matching option without opening the list, like a native `<select>` | pending |
| 4 | Tabs activation default | automatic: focusing a tab selects it | **Base UI**: manual by default, a tab is selected on click or Enter | pending |
| 5 | Combobox filtering | the consumer filters the list | **Base UI**: the Combobox filters internally | applied in Epic I |
| 6 | Combobox Escape and click | Escape keeps the typed text; a click on the input does not open the list | **Base UI**: Escape resets the input's text; a click on the input opens the list | applied in Epic I |
| 7 | Menu and Select modality | not modal | **Base UI**: modal by default | pending |
| 8 | Popover focus | focus goes to the popup on open, and stays where the user pressed after an outside press | **Base UI**: focus goes to the first tabbable element on open, and returns to the trigger after an outside press | pending |
| 9 | Tooltip | wires `aria-describedby` and `role="tooltip"` itself; the popup always stays open while hovered | **keep the POC's ARIA wiring**. The hover option follows Base UI (`disableHoverablePopup`, the popup hoverable by default) | ARIA kept; the option pending |
| 10 | Naming | `start` / `end`, `loop`, `data-open` on the trigger | **Base UI**: `inline-start` / `inline-end` plus the physical `left` / `right`, `loopFocus`, `data-popup-open` | pending (all components at once) |

### Why each exception

- **Select placement (1).** Laying the selected item over the trigger (`alignItemWithTrigger`) is
  the one large mechanism in the list (effort L, five times). A list below the trigger is the
  APG's pattern and a native `<select>`'s on most platforms. Fragiola UI's selects keep working:
  they lose the overlay, not a feature.
- **Tooltip ARIA (9).** A tooltip that describes its trigger without the consumer's wiring cannot be
  forgotten. Base UI leaves `aria-describedby` to the consumer. The POC's wiring is a strict
  addition, and a consumer that also sets it loses nothing.

### Notes

- **Tooltip's hover option (9)** is read as "follow Base UI": the issue kept only the ARIA wiring.
  The popup stays hoverable by default, as in the POC and Base UI, and the production version adds
  `disableHoverablePopup`.
- **The Field layer** (Epic H, `spec/field.md`) follows Base UI's Field where the decisions do not
  say otherwise. The spec records each place where the POC differs.
