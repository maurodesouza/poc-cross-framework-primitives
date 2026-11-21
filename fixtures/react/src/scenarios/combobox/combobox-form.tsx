import { useId, useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Combobox } from "../../kit/ui/combobox.tsx";
import { type Produce, TOPPINGS } from "./combobox-items.ts";
import { FruitChips } from "./fruit-chips.tsx";
import { FruitPopup } from "./fruit-combobox.tsx";
import { FRUITS } from "./fruits.ts";

const NUTS = TOPPINGS.filter((topping) => topping.value === "nuts");

/** A single and a multiple combobox in a native form (spec/combobox.md). */
export function ComboboxForm() {
    const fruitId = useId();
    const toppingsId = useId();
    const [form, setForm] = useState<string>();
    return (
        <>
            <form
                className="flex flex-col items-start gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Combobox.Root items={FRUITS} name="fruit" required>
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={fruitId}
                            className="text-sm font-medium"
                        >
                            Fruit
                        </label>
                        <Combobox.InputGroup>
                            <Combobox.Input id={fruitId} />
                        </Combobox.InputGroup>
                    </div>
                    <FruitPopup />
                </Combobox.Root>
                <Combobox.Root
                    multiple
                    items={TOPPINGS}
                    name="toppings"
                    defaultValue={NUTS}
                >
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={toppingsId}
                            className="text-sm font-medium"
                        >
                            Toppings
                        </label>
                        <FruitChips<Produce> id={toppingsId} />
                    </div>
                    <Combobox.Portal>
                        <Combobox.Positioner sideOffset={4}>
                            <Combobox.Popup>
                                <Combobox.List>
                                    {(topping: Produce) => (
                                        <Combobox.Item
                                            key={topping.value}
                                            value={topping}
                                        >
                                            {topping.label}
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
                <div className="flex gap-2">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output values={{ form }} />
        </>
    );
}
