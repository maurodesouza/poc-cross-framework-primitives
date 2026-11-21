import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { Field } from "../../kit/ui/field.tsx";
import { FruitPopup } from "./fruit-combobox.tsx";
import { FRUITS } from "./fruits.ts";

/** The combobox inside a Field: labelled, described and validated by it (spec/combobox.md). */
export function ComboboxField() {
    const [form, setForm] = useState<string>();
    return (
        <>
            <form
                className="flex flex-col items-start gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Field.Root name="fruit">
                    <Field.Label>Fruit</Field.Label>
                    <Combobox.Root items={FRUITS} required>
                        <Combobox.InputGroup>
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
            </form>
            <Output values={{ form }} />
        </>
    );
}
