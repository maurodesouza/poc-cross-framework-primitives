import { Checkbox } from "@base-ui/react/checkbox";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";

export function CheckboxBasic() {
    const [terms, setTerms] = useState<boolean>();
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
                <label className="field">
                    <Checkbox.Root
                        className="checkbox"
                        name="terms"
                        required
                        onCheckedChange={(checked) => setTerms(checked)}
                    >
                        <Checkbox.Indicator aria-hidden>✓</Checkbox.Indicator>
                    </Checkbox.Root>
                    Accept terms
                </label>
                <label className="field">
                    <Checkbox.Root
                        className="checkbox"
                        name="news"
                        value="yes"
                        defaultChecked
                    >
                        <Checkbox.Indicator aria-hidden>✓</Checkbox.Indicator>
                    </Checkbox.Root>
                    Subscribe
                </label>
                <label className="field">
                    <Checkbox.Root className="checkbox" disabled>
                        <Checkbox.Indicator aria-hidden>✓</Checkbox.Indicator>
                    </Checkbox.Root>
                    Locked
                </label>
                <div className="field">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output values={{ terms, form }} />
        </>
    );
}
