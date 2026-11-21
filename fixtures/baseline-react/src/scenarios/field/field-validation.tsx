import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";

function validateUsername(value: unknown): string | null {
    const text = String(value ?? "");
    return text.length > 0 && text.length < 3 ? "At least 3 characters." : null;
}

function validatePassword(value: unknown): string[] {
    const text = String(value ?? "");
    const errors: string[] = [];
    if (!/\d/.test(text)) {
        errors.push("Include a number.");
    }
    if (text.length < 8) {
        errors.push("At least 8 characters.");
    }
    return errors;
}

function validateCode(value: unknown): string | null {
    return value === "AAA" ? "This code is taken." : null;
}

/** spec/field.md: the three modes and `validate`. */
export function FieldValidation() {
    const [form, setForm] = useState<string>();
    return (
        <>
            <div className="stack">
                <Field.Root
                    validationMode="onChange"
                    validate={validateUsername}
                    className="stack"
                >
                    <Field.Label>Username</Field.Label>
                    <Field.Control />
                    <Field.Error />
                </Field.Root>
                <Field.Root
                    validationMode="onBlur"
                    validate={validatePassword}
                    className="stack"
                >
                    <Field.Label>Password</Field.Label>
                    <Field.Control />
                    <Field.Error />
                </Field.Root>
                <Form
                    className="stack"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setForm(formEntries(event.currentTarget));
                    }}
                >
                    <Field.Root
                        name="code"
                        validate={validateCode}
                        className="stack"
                    >
                        <Field.Label>Code</Field.Label>
                        <Field.Control pattern="[A-Z]{3}" />
                        <Field.Error match="patternMismatch">
                            Use three capital letters.
                        </Field.Error>
                        <Field.Error match="customError" />
                    </Field.Root>
                    <button type="submit">Submit</button>
                </Form>
            </div>
            <Output values={{ form }} />
        </>
    );
}
