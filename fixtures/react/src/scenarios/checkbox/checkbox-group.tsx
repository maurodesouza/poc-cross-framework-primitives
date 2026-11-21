import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Checkbox, CheckboxGroup } from "../../kit/ui/checkbox.tsx";

const TOPPINGS = [
    { value: "cheese", label: "Cheese" },
    { value: "ham", label: "Ham" },
    { value: "pineapple", label: "Pineapple" },
];

export function CheckboxGroupScenario() {
    const [value, setValue] = useState<string[]>(["cheese"]);
    const [form, setForm] = useState<string>();
    return (
        <>
            <form
                className="flex flex-col items-start gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <h2 id="toppings" className="text-sm font-semibold">
                    Toppings
                </h2>
                <CheckboxGroup
                    aria-labelledby="toppings"
                    value={value}
                    onValueChange={(next: string[]) => setValue(next)}
                    allValues={TOPPINGS.map((topping) => topping.value)}
                >
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox.Root parent />
                        All toppings
                    </label>
                    {TOPPINGS.map((topping) => (
                        <label
                            key={topping.value}
                            className="flex items-center gap-2 text-sm"
                        >
                            <Checkbox.Root
                                name="toppings"
                                value={topping.value}
                            />
                            {topping.label}
                        </label>
                    ))}
                </CheckboxGroup>
                <button type="submit">Submit</button>
            </form>
            <Output values={{ value: value.join(",") || undefined, form }} />
        </>
    );
}
