import { createSignal } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Field } from "../../kit/ui/field.tsx";
import {
    validateCode,
    validatePassword,
    validateUsername,
} from "./validators.ts";

export function FieldValidation() {
    const [form, setForm] = createSignal<string>();
    return (
        <>
            <div class="flex flex-col items-start gap-4">
                <Field.Root
                    validationMode="onChange"
                    validate={validateUsername}
                >
                    <Field.Label>Username</Field.Label>
                    <Field.Control />
                    <Field.Error />
                </Field.Root>
                <Field.Root validationMode="onBlur" validate={validatePassword}>
                    <Field.Label>Password</Field.Label>
                    <Field.Control />
                    <Field.Error />
                </Field.Root>
                <form
                    class="flex flex-col items-start gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setForm(formEntries(event.currentTarget));
                    }}
                >
                    <Field.Root name="code" validate={validateCode}>
                        <Field.Label>Code</Field.Label>
                        <Field.Control pattern="[A-Z]{3}" />
                        <Field.Error match="patternMismatch">
                            Use three capital letters.
                        </Field.Error>
                        <Field.Error match="customError" />
                    </Field.Root>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <Output values={{ form: form() }} />
        </>
    );
}
