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
import { useCallback, useMemo, useRef, useState } from "react";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext, type FieldControlEvents } from "./field-context.ts";

export interface FieldRootProps extends PartProps<FieldState> {
    /** The control's form name; it wins over the control's own. */
    name?: string;
    disabled?: boolean;
    /** Forces the invalid state (an error the app found). */
    invalid?: boolean;
    validate?: FieldValidate;
    validationMode?: FieldValidationMode;
}

/** Holds the field's state, validation and ids (spec/field.md). */
export function FieldRoot({
    name,
    disabled = false,
    invalid: invalidProp = false,
    validate,
    validationMode = "onSubmit",
    ...props
}: FieldRootProps) {
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [filled, setFilled] = useState(false);
    const [shown, setShown] = useState<FieldValidation>(UNVALIDATED);
    const [labelId, setLabelId] = useState<string>();
    const [control, setControl] = useState<{
        id: string;
        labelable: boolean;
    } | null>(null);
    const [messages, setMessages] = useState<readonly HTMLElement[]>([]);
    // whether the value changed once, or a submission was attempted (the required rule)
    const changed = useRef(false);
    const submitted = useRef(false);
    const latest = useRef({ validate, validationMode });
    latest.current = { validate, validationMode };

    const events = useMemo<FieldControlEvents>(() => {
        const run = (
            input: HTMLInputElement | null,
            value: unknown,
            always: boolean,
        ) =>
            validateField(input, {
                value,
                validate: latest.current.validate,
                valueChanged: changed.current,
                always,
            });
        return {
            mounted: (input, value, isFilled) => {
                setFilled(isFilled);
                run(input, value, false);
            },
            changed: (input, value, isDirty, isFilled) => {
                changed.current = true;
                setDirty(isDirty);
                setFilled(isFilled);
                const onChange = validatesOnChange(
                    latest.current.validationMode,
                    submitted.current,
                );
                const next = run(input, value, onChange);
                setShown((before) => shownAfterChange(before, next, onChange));
            },
            focused: () => setFocused(true),
            blurred: (input, value) => {
                setFocused(false);
                setTouched(true);
                if (latest.current.validationMode === "onBlur") {
                    setShown(run(input, value, false));
                }
            },
            submitAttempt: (input, value) => {
                submitted.current = true;
                changed.current = true;
                setShown(
                    run(
                        input,
                        value,
                        validatesOnChange(latest.current.validationMode, true),
                    ),
                );
            },
        };
    }, []);

    const registerControl = useCallback((id: string, labelable: boolean) => {
        setControl({ id, labelable });
        return () => setControl(null);
    }, []);
    const registerMessage = useCallback((element: HTMLElement) => {
        setMessages((list) => [...list, element]);
        return () =>
            setMessages((list) => list.filter((entry) => entry !== element));
    }, []);

    const valid = disabled ? null : invalidProp ? false : shown.validity.valid;
    const state: FieldState = {
        valid,
        dirty,
        touched,
        filled,
        focused,
        disabled,
    };
    const describedBy = useMemo(() => fieldDescribedBy(messages), [messages]);
    const context = useMemo(
        () => ({
            state: { valid, dirty, touched, filled, focused, disabled },
            invalid: valid === false,
            name,
            disabled,
            shown,
            labelId,
            setLabelId,
            control,
            registerControl,
            describedBy,
            registerMessage,
            events,
        }),
        [
            valid,
            dirty,
            touched,
            filled,
            focused,
            disabled,
            name,
            shown,
            labelId,
            control,
            registerControl,
            describedBy,
            registerMessage,
            events,
        ],
    );
    return (
        <FieldContext.Provider value={context}>
            {renderElement("div", props, state, {
                "data-field-part": "root",
                ...stateAttributes(fieldStateAttributes(state)),
            })}
        </FieldContext.Provider>
    );
}
