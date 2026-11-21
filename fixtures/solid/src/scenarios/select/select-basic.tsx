import { createSignal } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { FruitSelect } from "./fruit-select.tsx";

export function SelectBasic() {
    const [value, setValue] = createSignal<string | null>(null);
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
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
                <label for="fruit" class="text-sm font-medium">
                    Fruit
                </label>
                <FruitSelect
                    id="fruit"
                    name="fruit"
                    required
                    onValueChange={(next) => setValue(next)}
                    onOpenChange={(next, why) => {
                        setOpen(next);
                        setReason(why);
                    }}
                />
                <div class="flex gap-2">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output
                values={{
                    value: value(),
                    open: open(),
                    reason: reason(),
                    form: form(),
                }}
            />
        </>
    );
}
