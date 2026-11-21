import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

export function ComboboxControlled() {
    const [value, setValue] = useState<Fruit | null>(
        FRUITS.find((fruit) => fruit.value === "mango") ?? null,
    );
    const [input, setInput] = useState("Mango");
    const [open, setOpen] = useState(false);
    return (
        <>
            <FruitCombobox
                value={value}
                onValueChange={setValue}
                inputValue={input}
                onInputValueChange={setInput}
                open={open}
                onOpenChange={(next: boolean) => setOpen(next)}
            />
            <button
                type="button"
                className="mt-2"
                onClick={() => {
                    setValue(null);
                    setInput("");
                }}
            >
                Reset
            </button>
            <Output values={{ value: printValues(value), input, open }} />
        </>
    );
}
