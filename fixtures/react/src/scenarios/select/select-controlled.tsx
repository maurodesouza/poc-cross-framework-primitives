import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitSelect } from "./fruit-select.tsx";

/** The consumer refuses Cherry: the value stays. */
export function SelectControlled() {
    const [value, setValue] = useState<string | null>("apple");
    const [requested, setRequested] = useState<string | null>();
    return (
        <>
            <div className="flex flex-col items-start gap-2">
                <label htmlFor="fruit" className="text-sm font-medium">
                    Fruit
                </label>
                <FruitSelect
                    id="fruit"
                    value={value}
                    onValueChange={(next) => {
                        setRequested(next);
                        if (next !== "cherry") {
                            setValue(next);
                        }
                    }}
                />
            </div>
            <Output values={{ value, requested }} />
        </>
    );
}
