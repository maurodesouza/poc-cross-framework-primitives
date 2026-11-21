import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";
import { type Fruit, printValues } from "./fruits.ts";

/** The consumer refuses an input value with a digit: the input keeps the consumer's value. */
export function ComboboxRejectedInput() {
    const [value, setValue] = createSignal<Fruit | null>(null);
    const [input, setInput] = createSignal("");
    const [open, setOpen] = createSignal(false);
    return (
        <>
            <FruitCombobox
                value={value()}
                onValueChange={(next) => setValue(next)}
                inputValue={input()}
                onInputValueChange={(next) => {
                    if (!/\d/.test(next)) {
                        setInput(next);
                    }
                }}
                open={open()}
                onOpenChange={(next: boolean) => setOpen(next)}
            />
            <Output
                values={{
                    value: printValues(value()),
                    input: input(),
                    open: open(),
                }}
            />
        </>
    );
}
