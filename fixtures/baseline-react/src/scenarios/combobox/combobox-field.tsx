import { Combobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { FruitPopup } from "./fruit-combobox.tsx";
import { FRUITS, type Fruit } from "./fruits.ts";

/** The combobox inside a Field: labelled, described and validated by it (spec/combobox.md). */
export function ComboboxField() {
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
                <Field.Root name="fruit" className="stack">
                    <Field.Label>Fruit</Field.Label>
                    <Combobox.Root<Fruit> items={FRUITS} required>
                        <Combobox.InputGroup className="field">
                            <Combobox.Input />
                            <Combobox.Clear aria-label="Clear fruit">
                                ×
                            </Combobox.Clear>
                            <Combobox.Trigger aria-label="Show fruits">
                                ▾
                            </Combobox.Trigger>
                        </Combobox.InputGroup>
                        <FruitPopup />
                    </Combobox.Root>
                    <Field.Description>Pick one.</Field.Description>
                    <Field.Error>Choose a fruit.</Field.Error>
                </Field.Root>
                <button type="submit">Submit</button>
            </Form>
            <Output values={{ form }} />
        </>
    );
}
