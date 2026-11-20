import type { ChangeDetails } from "@poc/react";
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
                onValueChange={setValue}
                inputValue={input}
                onInputValueChange={setInput}
                open={open}
                onOpenChange={(next: boolean, details: ChangeDetails) => {
                    setOpen(next);
                    setReason(details.reason);
                }}
            />
            <Output values={{ value, input, open, reason }} />
        </>
    );
}
