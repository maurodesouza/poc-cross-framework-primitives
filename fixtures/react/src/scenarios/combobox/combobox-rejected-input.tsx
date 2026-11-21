import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";

/** The consumer refuses an input value with a digit: the input keeps the consumer's value. */
export function ComboboxRejectedInput() {
    const [value, setValue] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    return (
        <>
            <FruitCombobox
                value={value}
                onValueChange={setValue}
                inputValue={input}
                onInputValueChange={(next) => {
                    if (!/\d/.test(next)) {
                        setInput(next);
                    }
                }}
                open={open}
                onOpenChange={(next: boolean) => setOpen(next)}
            />
            <Output values={{ value, input, open }} />
        </>
    );
}
