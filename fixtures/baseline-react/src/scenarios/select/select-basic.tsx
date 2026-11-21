import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { FruitSelect } from "./fruit-select.tsx";

export function SelectBasic() {
    const [value, setValue] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    const [form, setForm] = useState<string>();
    return (
        <>
            <form
                className="stack"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <label htmlFor="fruit">Fruit</label>
                <FruitSelect
                    id="fruit"
                    name="fruit"
                    required
                    onValueChange={setValue}
                    onOpenChange={(next, why) => {
                        setOpen(next);
                        setReason(why);
                    }}
                />
                <div className="field">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output values={{ value, open, reason, form }} />
        </>
    );
}
