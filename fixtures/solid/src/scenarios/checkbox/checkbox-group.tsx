import { createSignal, For } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Checkbox, CheckboxGroup } from "../../kit/ui/checkbox.tsx";

const TOPPINGS = [
    { value: "cheese", label: "Cheese" },
    { value: "ham", label: "Ham" },
    { value: "pineapple", label: "Pineapple" },
];

export function CheckboxGroupScenario() {
    const [value, setValue] = createSignal<string[]>(["cheese"]);
    const [form, setForm] = createSignal<string>();
    return (
        <>
            <form
                class="flex flex-col items-start gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <h2 id="toppings" class="text-sm font-semibold">
                    Toppings
                </h2>
                <CheckboxGroup
                    aria-labelledby="toppings"
                    value={value()}
                    onValueChange={(next: string[]) => setValue(next)}
                    allValues={TOPPINGS.map((topping) => topping.value)}
                >
                    <label class="flex items-center gap-2 text-sm">
                        <Checkbox.Root parent />
                        All toppings
                    </label>
                    <For each={TOPPINGS}>
                        {(topping) => (
                            <label class="flex items-center gap-2 text-sm">
                                <Checkbox.Root
                                    name="toppings"
                                    value={topping.value}
                                />
                                {topping.label}
                            </label>
                        )}
                    </For>
                </CheckboxGroup>
                <button type="submit">Submit</button>
            </form>
            <Output
                values={{ value: value().join(",") || undefined, form: form() }}
            />
        </>
    );
}
