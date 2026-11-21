import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";

/** spec/field.md: Base UI's `onSubmit` mode needs its `Form` (a fixture setting). */
export function FieldBasic() {
    const [form, setForm] = useState<string>();
    return (
        <>
            <Form
                className="stack"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Field.Root name="email" className="stack">
                    <Field.Label>Email</Field.Label>
                    <Field.Control type="email" required />
                    <Field.Description>We never share it.</Field.Description>
                    <Field.Error match="valueMissing">
                        Enter your email.
                    </Field.Error>
                    <Field.Error match="typeMismatch">
                        Enter a valid email.
                    </Field.Error>
                </Field.Root>
                <Field.Root name="nickname" disabled className="stack">
                    <Field.Label>Nickname</Field.Label>
                    <Field.Control />
                    <Field.Description>
                        Shown on your profile.
                    </Field.Description>
                </Field.Root>
                <button type="submit">Submit</button>
            </Form>
            <Output values={{ form }} />
        </>
    );
}
