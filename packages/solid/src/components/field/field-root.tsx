import {
    type FieldState,
    type FieldValidate,
    type FieldValidation,
    type FieldValidationMode,
    fieldDescribedBy,
    fieldStateAttributes,
    shownAfterChange,
    UNVALIDATED,
    validateField,
    validatesOnChange,
} from "@poc/dom";
import { createMemo, createSignal } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    FieldContext,
    type FieldContextValue,
    type FieldControlEvents,
} from "./field-context.ts";

export interface FieldRootProps extends PartProps<FieldState> {
    /** The control's form name; it wins over the control's own. */
    name?: string;
    disabled?: boolean;
    /** Forces the invalid state (an error the app found). */
    invalid?: boolean;
    validate?: FieldValidate;
    validationMode?: FieldValidationMode;
}

const OWN_PROPS = [
    "name",
    "disabled",
    "invalid",
    "validate",
    "validationMode",
] as const;

/** Holds the field's state, validation and ids (spec/field.md). */
export function FieldRoot(props: FieldRootProps) {
    const [touched, setTouched] = createSignal(false);
    const [focused, setFocused] = createSignal(false);
    const [dirty, setDirty] = createSignal(false);
    const [filled, setFilled] = createSignal(false);
    const [shown, setShown] = createSignal<FieldValidation>(UNVALIDATED);
    const [labelId, setLabelId] = createSignal<string>();
    const [control, setControl] = createSignal<{
        id: string;
        labelable: boolean;
    } | null>(null);
    const [messages, setMessages] = createSignal<readonly HTMLElement[]>([]);
    // whether the value changed once, or a submission was attempted (the required rule): plain
    // variables, read by the events only
    let changed = false;
    let submitted = false;
    const mode = () => props.validationMode ?? "onSubmit";

    const run = (
        input: HTMLInputElement | null,
        value: unknown,
        always: boolean,
    ) =>
        validateField(input, {
            value,
            validate: props.validate,
            valueChanged: changed,
            always,
        });
    const events: FieldControlEvents = {
        mounted: (input, value, isFilled) => {
            setFilled(isFilled);
            run(input, value, false);
        },
        changed: (input, value, isDirty, isFilled) => {
            changed = true;
            setDirty(isDirty);
            setFilled(isFilled);
            const onChange = validatesOnChange(mode(), submitted);
            const next = run(input, value, onChange);
            setShown((before) => shownAfterChange(before, next, onChange));
        },
        focused: () => setFocused(true),
        blurred: (input, value) => {
            setFocused(false);
            setTouched(true);
            if (mode() === "onBlur") {
                setShown(run(input, value, false));
            }
        },
        submitAttempt: (input, value) => {
            submitted = true;
            changed = true;
            setShown(run(input, value, validatesOnChange(mode(), true)));
        },
    };

    const disabled = () => props.disabled ?? false;
    const valid = () =>
        disabled() ? null : props.invalid ? false : shown().validity.valid;
    const state = createMemo(
        (): FieldState => ({
            valid: valid(),
            dirty: dirty(),
            touched: touched(),
            filled: filled(),
            focused: focused(),
            disabled: disabled(),
        }),
    );
    const describedBy = createMemo(() => fieldDescribedBy(messages()));
    const context: FieldContextValue = {
        state,
        invalid: () => valid() === false,
        name: () => props.name,
        disabled,
        shown,
        labelId,
        setLabelId: (id) => setLabelId(id),
        control,
        registerControl: (id, labelable) => {
            const entry = { id, labelable };
            setControl(entry);
            return () => setControl((now) => (now === entry ? null : now));
        },
        describedBy,
        registerMessage: (element) => {
            setMessages((list) => [...list, element]);
            return () =>
                setMessages((list) =>
                    list.filter((entry) => entry !== element),
                );
        },
        events,
    };
    return (
        <FieldContext value={context}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    "data-field-part": "root",
                    ...stateAttributes(fieldStateAttributes(state())),
                }),
                { omit: OWN_PROPS },
            )}
        </FieldContext>
    );
}
