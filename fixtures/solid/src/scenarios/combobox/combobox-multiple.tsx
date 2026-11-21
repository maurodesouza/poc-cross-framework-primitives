import { createSignal, createUniqueId } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { FruitChips } from "./fruit-chips.tsx";
import { FruitPopup } from "./fruit-combobox.tsx";
import { FRUITS, type Fruit, printValues } from "./fruits.ts";

const DEFAULT = FRUITS.filter(
    (fruit) => fruit.value === "apple" || fruit.value === "cherry",
);

/** `multiple`, with chips, a Clear and a Status (spec/combobox.md). */
export function ComboboxMultiple() {
    const id = createUniqueId();
    const [value, setValue] = createSignal<Fruit[]>(DEFAULT);
    return (
        <>
            <Combobox.Root
                multiple
                items={FRUITS}
                value={value()}
                onValueChange={(next) => setValue(next)}
            >
                <div class="flex flex-col gap-1">
                    <label for={id} class="text-sm font-medium">
                        Fruits
                    </label>
                    <FruitChips<Fruit> id={id}>
                        <Combobox.Clear aria-label="Clear fruits">
                            ×
                        </Combobox.Clear>
                        <Combobox.Trigger aria-label="Show fruits">
                            ▾
                        </Combobox.Trigger>
                    </FruitChips>
                </div>
                <Combobox.Status>
                    {value().length === 1
                        ? "1 fruit selected."
                        : `${value().length} fruits selected.`}
                </Combobox.Status>
                <FruitPopup indicator />
            </Combobox.Root>
            <Output values={{ value: printValues(value()) }} />
        </>
    );
}
