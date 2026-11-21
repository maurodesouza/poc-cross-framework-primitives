import { Combobox } from "@base-ui/react/combobox";
import { useId, useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { type Produce, TOPPINGS } from "./combobox-items.ts";
import { FruitChips } from "./fruit-chips.tsx";
import { FruitPopup } from "./fruit-combobox.tsx";
import { FRUITS, type Fruit } from "./fruits.ts";

const NUTS = TOPPINGS.filter((topping) => topping.value === "nuts");

/** A single and a multiple combobox in a native form (spec/combobox.md). */
export function ComboboxForm() {
    const fruitId = useId();
    const toppingsId = useId();
    const [form, setForm] = useState<string>();
    return (
        <>
            <form
                className="stack"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Combobox.Root<Fruit> items={FRUITS} name="fruit" required>
                    <label htmlFor={fruitId}>Fruit</label>
                    <Combobox.InputGroup className="field">
                        <Combobox.Input id={fruitId} />
                    </Combobox.InputGroup>
                    <FruitPopup />
                </Combobox.Root>
                <Combobox.Root<Produce, true>
                    multiple
                    items={TOPPINGS}
                    name="toppings"
                    defaultValue={NUTS}
                >
                    <label htmlFor={toppingsId}>Toppings</label>
                    <FruitChips<Produce> id={toppingsId} />
                    <Combobox.Portal>
                        <Combobox.Positioner sideOffset={4}>
                            <Combobox.Popup className="popup">
                                <Combobox.List>
                                    {(topping: Produce) => (
                                        <Combobox.Item
                                            key={topping.value}
                                            value={topping}
                                            className="item"
                                        >
                                            {topping.label}
                                        </Combobox.Item>
                                    )}
                                </Combobox.List>
                            </Combobox.Popup>
                        </Combobox.Positioner>
                    </Combobox.Portal>
                </Combobox.Root>
                <div className="field">
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </div>
            </form>
            <Output values={{ form }} />
        </>
    );
}
