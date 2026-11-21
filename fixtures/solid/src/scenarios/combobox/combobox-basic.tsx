import type { ChangeDetails } from "@poc/solid";
import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";

export function ComboboxBasic() {
    const [value, setValue] = createSignal<string | null>(null);
    const [input, setInput] = createSignal("");
    const [open, setOpen] = createSignal(false);
    const [reason, setReason] = createSignal<string>();
    return (
        <>
            <FruitCombobox
                value={value()}
                onValueChange={(next) => setValue(next)}
                inputValue={input()}
                onInputValueChange={(next) => setInput(next)}
                open={open()}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
            />
            <Output
                values={{
                    value: value(),
                    input: input(),
                    open: open(),
                    reason: reason(),
                }}
            />
        </>
    );
}
