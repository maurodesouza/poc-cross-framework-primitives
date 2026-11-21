import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";

export function ComboboxControlled() {
    const [value, setValue] = createSignal<string | null>("mango");
    const [input, setInput] = createSignal("Mango");
    const [open, setOpen] = createSignal(false);
    return (
        <>
            <FruitCombobox
                value={value()}
                onValueChange={(next) => setValue(next)}
                inputValue={input()}
                onInputValueChange={(next) => setInput(next)}
                open={open()}
                onOpenChange={(next: boolean) => setOpen(next)}
            />
            <button
                type="button"
                class="mt-2"
                onClick={() => {
                    setValue(null);
                    setInput("");
                }}
            >
                Reset
            </button>
            <Output values={{ value: value(), input: input(), open: open() }} />
        </>
    );
}
