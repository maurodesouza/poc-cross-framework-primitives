import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Checkbox } from "../../kit/ui/checkbox.tsx";

export function CheckboxBasic() {
    const [terms, setTerms] = useState<boolean>();
    const [form, setForm] = useState<string>();
    return (
        <>
            <form
                className="flex flex-col items-start gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox.Root
                        name="terms"
                        required
                        onCheckedChange={(checked: boolean) =>
                            setTerms(checked)
                        }
                    />
                    Accept terms
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox.Root name="news" value="yes" defaultChecked />
                    Subscribe
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox.Root disabled />
                    Locked
                </label>
                <div className="flex gap-2">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output values={{ terms, form }} />
        </>
    );
}
