import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { FruitSelect } from "./fruit-select.tsx";

/** The consumer refuses Cherry: the value stays. */
export function SelectControlled() {
    const [value, setValue] = createSignal<string | null>("apple");
    const [requested, setRequested] = createSignal<string | null>();
    return (
        <>
            <div class="flex flex-col items-start gap-2">
                <label for="fruit" class="text-sm font-medium">
                    Fruit
                </label>
                <FruitSelect
                    id="fruit"
                    value={value()}
                    onValueChange={(next) => {
                        setRequested(next);
                        if (next !== "cherry") {
                            setValue(next);
                        }
                    }}
                />
            </div>
            <Output values={{ value: value(), requested: requested() }} />
        </>
    );
}
