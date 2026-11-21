# Field

## Purpose

The layer that turns a form control into a labelled, described and validated field: a label linked
to the control, a description, error messages shown when the value is invalid, and the field's
interaction states (`dirty`, `touched`, `filled`, `focused`) for styling. It wraps a native input
(`Field.Control`) or one of the POC's form controls: Checkbox, Select, Slider and, since Epic I,
Combobox (the [integration contract](#integration-contract)).

Base UI's `Field` (1.9) is the model: the decisions of 2026-11-21 (`docs/decisions.md`) follow its
behaviour. Out of scope: `Fieldset`, `Form` (a form-level `errors` object, `onFormSubmit`), Base
UI's `Field.Item` and `Field.Validity`, async `validate`, `validationDebounceTime`, `actionsRef`,
and Field in the calendar pickers.

## Anatomy

| part | element | `data-field-part` | notes |
| --- | --- | --- | --- |
| Field.Root | `div` | `root` | holds the field's state; renders no role |
| Field.Label | `label` | `label` | names the control |
| Field.Control | `input` | `control` | a native input; or one of the integrated controls instead |
| Field.Description | `p` | `description` | describes the control |
| Field.Error | `div` | `error` | rendered only while it is shown |

A field has one control: a `Field.Control`, a `Checkbox.Root`, a `Select.Root`, a `Slider.Root` or
a `Combobox.Root`.

## API

**Field.Root**:

- `name`: the control's form name. It wins over the control's own `name`.
- `disabled` (`false`): disables the control; no error is shown.
- `invalid` (`false`): forces the invalid state, for an error the app found (a server answer).
- `validate(value)`: synchronous; returns a message, a list of messages, or `null` for none. The
  value is the control's: the input's text, a checkbox's `checked`, a select's value (or `null`), a
  slider's number (or numbers).
- `validationMode` (`"onSubmit"`): when the field validates and shows the result, see
  [Validation](#validation). The other values are `"onBlur"` and `"onChange"`.

**Field.Label**, **Field.Description**: no props of their own. Their `id` is generated unless the
consumer gives one.

**Field.Control**: `value`, `defaultValue` (`""`), `onValueChange(value, details)` (reason
`none`); `id`, `disabled` and every native input attribute (`type`, `required`, `minlength`,
`pattern`, ...), which it forwards.

**Field.Error**: `match`. Without it, the error is shown while the field is invalid. With a
`ValidityState` key (`"valueMissing"`, `"typeMismatch"`, `"patternMismatch"`, ..., and
`"customError"` for the messages of `validate`), it is shown while that key is set. With `true`, it
is always shown: the app decides when to render it. Its children are its text. With no children,
it shows the current messages: one as text, several as a `ul` with one `li` each. These are the
messages of `validate`, or the browser's `validationMessage`.

The Root holds the state. The other parts read it, and every one of them carries its attributes.

## Validation

The field keeps a **validity**: the control's native `ValidityState` (from the element the form
validates: the Control, or the integrated control's hidden input), plus `customError` when
`validate` returns a message. Its `valid` is `null` until the field first validates, then `true`
or `false`.

**Validating** reads the native validity, then:

- **The required rule.** A `valueMissing` with no other native error counts as valid until the
  value has changed once, or a submission was attempted. So focusing and leaving an empty required
  field shows nothing.
- **`validate`** runs when the native validity has no error, or when the field validates on every
  change. Its messages make the field invalid (`customError`). They are also set as the custom
  validity of the validated element, so a native submission is blocked by them.
- **The messages** are `validate`'s, else the browser's `validationMessage`.

**The custom validity is always current.** The field runs `validate` on mount and on every change.
It sets the element's custom validity each time, whatever the mode, so a native form never submits
a value `validate` rejects. The mode decides only when the result is **shown**.

**When the result is shown:**

| event | `onSubmit` (default) | `onBlur` | `onChange` |
| --- | --- | --- | --- |
| a submission is attempted | shown | shown | shown |
| the control loses focus | no | shown | no |
| the value changes | no, until a submission was attempted; then shown | see below | shown |

**A submission attempt** is the browser's validation of the control's form. This is its
`invalid` event on any of the form's controls (the submission is blocked), or its `submit` event.
Every field of the form validates then. After a submission was attempted, an `onSubmit` field
validates on every change.

**A change on a field that shows an error, when the field does not validate on every change**
(`onBlur`, or `onSubmit` before a submission), hides the error: the field is valid until it next
validates. There is one exception. When the change leaves the value missing (a required field
emptied), the field validates at once, and the required error shows.

When validation blocks a submission, the browser focuses the first invalid control, or the
integrated control's primitive (spec/README.md, "Forms").

## State attributes and ARIA

Every part, and the integrated control's main element (Checkbox.Root, Select.Trigger,
Slider.Root, Combobox.Input), carries:

| attribute | when |
| --- | --- |
| `data-invalid` | the field shows an error: its validity is `false`, or `invalid` is set |
| `data-valid` | the field validated and is valid |
| `data-dirty` | the value differs from the value at mount |
| `data-touched` | the control has lost focus once |
| `data-filled` | the value is not empty: some text, a checked checkbox, a chosen option. A slider is always filled |
| `data-focused` | the control has focus (a slider: one of its thumbs) |
| `data-disabled` | the field is disabled |

Before the first validation, neither `data-invalid` nor `data-valid` is present. A disabled field
has neither.

| part | ARIA |
| --- | --- |
| Label | `id`; `for` the control's `id` when the control is labelable (the Control, Checkbox.Root's `button`, Select.Trigger's `button`, Combobox.Input) |
| Control | `id` (generated, or the consumer's), `name` (the field's), `aria-labelledby` (the label), `aria-describedby`, `aria-invalid="true"` while invalid, `disabled` |
| Description | `id` |
| Error | `id` |

**`aria-describedby`** lists the description's `id` and the `id` of each shown error, in document
order. It is absent when the list is empty.

**`aria-invalid="true"`** is set while the field is invalid and not disabled. It is absent
otherwise.

## Integration contract

A control inside a `Field.Root` reads the field from its context. It must:

1. **Take the field's ids.** It uses the field's control `id` on its labelable element (unless the
   consumer gives one). It sets `aria-labelledby` to the label's `id`, and `aria-describedby` and
   `aria-invalid` as for the Control.
2. **Take the field's `name` and `disabled`.** The field's `name` wins over the control's.
   `disabled` on either disables it.
3. **Report its interaction:** focus and blur (`focused`, `touched`), and each change of its value
   (`dirty`, `filled`, and the change for [validation](#validation)).
4. **Expose the element the form validates:** its hidden input (or the Control's input). The field
   reads that element's native validity and sets its custom validity.
5. **Carry the field's state attributes** on its main element.

Outside a `Field.Root`, a control behaves exactly as without the layer.

| control | labelable element (`id`, `for`) | `aria-labelledby`, `aria-describedby`, `aria-invalid` on | value given to `validate` | focus and blur from | validated element |
| --- | --- | --- | --- | --- | --- |
| Field.Control | the `input` | the `input` | its text | the `input` | the `input` |
| Checkbox | Checkbox.Root (`button`) | Checkbox.Root | `checked` | Checkbox.Root | its hidden `checkbox` input |
| Select | Select.Trigger (`button`) | Select.Trigger | the value, or `null` | Select.Trigger | its hidden input |
| Combobox | Combobox.Input (`input`) | Combobox.Input | the value: an item or `null`, or the list of items with `multiple` | Combobox.Input | its visually hidden input (combobox.md, "Forms") |
| Slider | none (a `group`) | Slider.Root gets `aria-labelledby`. Each Thumb gets `aria-describedby` and `aria-invalid`, and `aria-labelledby` when it has no `aria-label` or `aria-labelledby` of its own | the value (a number, or numbers) | its Thumbs | none: its inputs are `type="hidden"`, which the browser never validates. `validate` still runs and shows its messages, but it cannot block a native submission |

Select's popup is portalled. Its parts never need the field: the trigger and the hidden input
carry everything, and both stay inside the Root.

## Keyboard

Nothing of its own: the control's keyboard applies.

## Focus

Nothing of its own. A click on the Label focuses the Control, or clicks a labelable control (it
toggles a Checkbox, as a native `<label for>` does).

## Pointer

A press on the Label acts as above (native `<label>` behaviour).

## Animation

None of its own. Base UI's `data-starting-style` / `data-ending-style` on the Error are out of
scope.

## RTL

Nothing changes.

## Scenarios

The form scenarios print `form: ...` as in [checkbox.md](checkbox.md#scenarios).

### `/field/basic`

A `<form>` with:

- a field `name="email"`: Label **"Email"**; a Control `type="email"`, `required`; Description
  **"We never share it."**; an Error `match="valueMissing"` **"Enter your email."**; an Error
  `match="typeMismatch"` **"Enter a valid email."**;
- a field `name="nickname"`, `disabled`: Label **"Nickname"**, a Control, Description
  **"Shown on your profile."**;
- a **"Submit"** button.

Output: `form: ...`.

Checks:

1. A `textbox` named "Email", described by "We never share it.", not `aria-invalid`; no error is
   shown.
2. A click on the label "Email" focuses the textbox.
3. Focusing it and leaving it empty shows nothing (the required rule, `onSubmit`).
4. "Submit" while empty submits nothing (`form: none`) and focuses "Email". The textbox is
   `aria-invalid="true"`, "Enter your email." is shown, and the description is
   "We never share it. Enter your email.".
5. After that submission the field validates on every change. Typing `ada` shows
   "Enter a valid email." instead. Completing it to `ada@example.com` hides it and removes
   `aria-invalid`. "Submit" then gives `form: email=ada@example.com`. The disabled field submits
   nothing.
6. The textbox "Nickname" is disabled.
7. Axe finds no violation, before and after the failed submission.

### `/field/validation`

The three modes, and `validate`:

- **"Username"**, `validationMode="onChange"`, not in a form. Its `validate` returns
  **"At least 3 characters."** for one or two characters, `null` otherwise. An Error with no
  children.
- **"Password"**, `validationMode="onBlur"`, not in a form. Its `validate` returns a list: each of
  **"Include a number."** (no digit) and **"At least 8 characters."** (fewer than 8) that applies,
  in that order. An Error with no children.
- **"Code"**, the default `onSubmit`, inside a `<form>` with `name="code"` and a **"Submit"**
  button. A Control `pattern="[A-Z]{3}"`. Its `validate` returns **"This code is taken."** for
  `AAA`. It has an Error `match="patternMismatch"` **"Use three capital letters."** and an Error
  `match="customError"` with no children.

Output: `form: ...`.

Checks:

1. **onChange.** Nothing is shown at first. Typing `a` shows "At least 3 characters." and makes
   "Username" `aria-invalid`. Typing on to `ada` hides it.
2. **onBlur.** Typing `abc` in "Password" shows nothing. Leaving it (Tab) shows a list of two
   items, "Include a number." and "At least 8 characters.". Typing `1` hides the error at once
   (a change clears it). Leaving it shows only "At least 8 characters.". Typing on to `abc12345`
   and leaving it shows nothing.
3. **onSubmit.** Typing `ab` in "Code" shows nothing. "Submit" submits nothing, focuses "Code" and
   shows "Use three capital letters.". After that, each change validates. Replacing the text with
   `AAA` shows "This code is taken." instead. Replacing it with `ABC` shows nothing, and "Submit"
   gives `form: code=ABC`.
4. Axe finds no violation with the errors shown.

### `/field/controls`

A `<form>` with three fields around the integrated controls. The controls have no `name` of their
own: the field gives it.

- `name="terms"`: a Checkbox `required` (with its Indicator), then the Label **"Accept terms"**;
  Description **"Required to continue."**; an Error **"You must accept the terms."**;
- `name="fruit"`: Label **"Fruit"**; the Select of [select.md](select.md#selectbasic) (its items,
  placeholder **"Choose a fruit"**), `required`; Description **"Pick one."**; an Error
  **"Choose a fruit."**;
- `name="volume"`: Label **"Volume"**; a Slider with `defaultValue` `50` and one Thumb with no
  name of its own; Description **"From 0 to 100."**;
- a **"Submit"** button.

Output: `form: ...`.

Checks:

1. The `checkbox` "Accept terms" is described by "Required to continue.". A click on the label
   checks it, and another unchecks it.
2. The `combobox` "Fruit" is described by "Pick one.".
3. The `group` and the `slider` are named "Volume". The slider is described by "From 0 to 100.".
4. "Submit" with nothing chosen submits nothing. The checkbox and the combobox are
   `aria-invalid="true"`, and "You must accept the terms." and "Choose a fruit." are shown. The
   checkbox's description is "Required to continue. You must accept the terms.".
5. After that, each change validates. Checking the checkbox hides its error and removes
   `aria-invalid`. Choosing "Banana" hides the select's. "Submit" then gives
   `form: terms=on&fruit=banana&volume=50`.
6. Axe finds no violation, before and after the failed submission.

## Baseline deviations

Measured against Base UI 1.9 (`Field`, with `Checkbox`, `Select` and `Slider`). Each one is marked
on its test with `baselineDeviation`.

| difference | test |
| --- | --- |
| none: the baseline passes every Field test | |

Fixture settings, not deviations:

- **Base UI's `onSubmit` mode needs its `Form`.** Without it, a native submission validates no
  field. The fixture wraps each form in Base UI's `Form`. That form validates every field on
  submit and focuses the first invalid one, as the browser does for the POC.
- **Base UI's Select** keeps `alignItemWithTrigger={false}`, as in the select scenarios.

## Where the POC differs from Base UI

These are not baseline deviations: the suite's behaviour tests do not tell them apart.

- **No `Form`.** A POC field validates on its native form's submission attempt (the browser's
  validation), and keeps the custom validity current so the browser blocks a rejected value. Base
  UI needs its `Form` for `onSubmit` (above).
- **`match={true}`** follows Base UI: always shown. The Epic's wording ("`true` for a custom
  error") is read as `match="customError"`, which is the `ValidityState` key for `validate`'s
  messages.
- **A form reset** does not reset the field's states (`dirty`, `touched`, the validity), as in Base
  UI. The controls still reset their values (spec/README.md, "Forms").
