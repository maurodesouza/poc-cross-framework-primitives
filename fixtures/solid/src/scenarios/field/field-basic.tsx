import { createSignal } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Field } from "../../kit/ui/field.tsx";

export function FieldBasic() {
    const [form, setForm] = createSignal<string>();
    return (
        <>
            <form
                class="flex flex-col items-start gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Field.Root name="email">
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
                <Field.Root name="nickname" disabled>
                    <Field.Label>Nickname</Field.Label>
                    <Field.Control />
                    <Field.Description>
                        Shown on your profile.
                    </Field.Description>
                </Field.Root>
                <button type="submit">Submit</button>
            </form>
            <Output values={{ form: form() }} />
        </>
    );
}
