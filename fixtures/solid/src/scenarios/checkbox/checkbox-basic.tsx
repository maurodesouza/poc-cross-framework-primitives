import { createSignal } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Checkbox } from "../../kit/ui/checkbox.tsx";

export function CheckboxBasic() {
    const [terms, setTerms] = createSignal<boolean>();
    const [form, setForm] = createSignal<string>();
    return (
        <>
            <form
                class="flex flex-col items-start gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <label class="flex items-center gap-2 text-sm">
                    <Checkbox.Root
                        name="terms"
                        required
                        onCheckedChange={(checked: boolean) =>
                            setTerms(checked)
                        }
                    />
                    Accept terms
                </label>
                <label class="flex items-center gap-2 text-sm">
                    <Checkbox.Root name="news" value="yes" defaultChecked />
                    Subscribe
                </label>
                <label class="flex items-center gap-2 text-sm">
                    <Checkbox.Root disabled />
                    Locked
                </label>
                <div class="flex gap-2">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output values={{ terms: terms(), form: form() }} />
        </>
    );
}
