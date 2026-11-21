import { Checkbox } from "@base-ui/react/checkbox";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";

const TOPPINGS = [
    { value: "cheese", label: "Cheese" },
    { value: "ham", label: "Ham" },
    { value: "pineapple", label: "Pineapple" },
];

export function CheckboxGroupScenario() {
    const [value, setValue] = useState(["cheese"]);
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
                <h2 id="toppings">Toppings</h2>
                <CheckboxGroup
                    aria-labelledby="toppings"
                    className="stack"
                    value={value}
                    onValueChange={setValue}
                    allValues={TOPPINGS.map((topping) => topping.value)}
                >
                    <label className="field">
                        <Checkbox.Root className="checkbox" parent>
                            <Checkbox.Indicator
                                aria-hidden
                                render={(props, state) => (
                                    <span {...props}>
                                        {state.indeterminate ? "–" : "✓"}
                                    </span>
                                )}
                            />
                        </Checkbox.Root>
                        All toppings
                    </label>
                    {TOPPINGS.map((topping) => (
                        <label key={topping.value} className="field">
                            <Checkbox.Root
                                className="checkbox"
                                name="toppings"
                                value={topping.value}
                            >
                                <Checkbox.Indicator aria-hidden>
                                    ✓
                                </Checkbox.Indicator>
                            </Checkbox.Root>
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
