import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitCombobox } from "./fruit-combobox.tsx";

export function ComboboxBasic() {
    const [value, setValue] = useState<string | null>(null);
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
            <Output values={{ value, input, open, reason }} />
        </>
    );
}
