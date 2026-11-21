import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";
import { type Fruit, printValues } from "./fruits.ts";

export function ComboboxBasic() {
    const [value, setValue] = useState<Fruit | null>(null);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>();
    return (
        <>
            <FruitCombobox
                value={value}
                onValueChange={(next) => setValue(next)}
                inputValue={input}
                onInputValueChange={(next) => setInput(next)}
                open={open}
                onOpenChange={(next, why) => {
                    setOpen(next);
                    setReason(why);
                }}
            />
            <Output
                values={{ value: printValues(value), input, open, reason }}
            />
        </>
    );
}
