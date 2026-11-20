import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";

export function ComboboxControlled() {
    const [value, setValue] = useState<string | null>("mango");
    const [input, setInput] = useState("Mango");
    const [open, setOpen] = useState(false);
    return (
        <>
            <FruitCombobox
                value={value}
                onValueChange={(next) => setValue(next)}
                inputValue={input}
                onInputValueChange={(next) => setInput(next)}
                open={open}
                onOpenChange={(next) => setOpen(next)}
            />
            <button
                type="button"
                onClick={() => {
                    setValue(null);
                    setInput("");
                }}
            >
                Reset
            </button>
            <Output values={{ value, input, open }} />
        </>
    );
}
