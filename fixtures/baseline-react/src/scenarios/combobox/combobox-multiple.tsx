import { Combobox } from "@base-ui/react/combobox";
import { useId, useState } from "react";
import { Output } from "../../kit/output.tsx";
import { FruitChips } from "./fruit-chips.tsx";
import { FruitPopup } from "./fruit-combobox.tsx";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

const DEFAULT = FRUITS.filter(
    (fruit) => fruit.value === "apple" || fruit.value === "cherry",
);

/** `multiple`, with chips, a Clear and a Status (spec/combobox.md). */
export function ComboboxMultiple() {
    const id = useId();
    const [value, setValue] = useState<Fruit[]>(DEFAULT);
    return (
        <>
            <Combobox.Root<Fruit, true>
                multiple
                items={FRUITS}
                value={value}
                onValueChange={setValue}
            >
                <label htmlFor={id}>Fruits</label>
                <div className="field">
                    <FruitChips<Fruit> id={id} />
                    <Combobox.Clear aria-label="Clear fruits">×</Combobox.Clear>
                    <Combobox.Trigger aria-label="Show fruits">
                        ▾
                    </Combobox.Trigger>
                </div>
                <Combobox.Status className="sr-only">
                    {value.length === 1
                        ? "1 fruit selected."
                        : `${value.length} fruits selected.`}
                </Combobox.Status>
                <FruitPopup indicator />
            </Combobox.Root>
            <Output values={{ value: printValues(value) }} />
        </>
    );
}
