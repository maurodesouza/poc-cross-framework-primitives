import { Checkbox } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { Select } from "@base-ui/react/select";
import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { FRUIT_ITEMS } from "../select/fruit-items.ts";

/** spec/field.md: Field around Checkbox, Select and Slider; the field names the controls. */
export function FieldControls() {
    const [form, setForm] = useState<string>();
    return (
        <>
            <Form
                className="stack"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Field.Root name="terms" className="stack">
                    <div className="field">
                        <Checkbox.Root className="checkbox" required>
                            <Checkbox.Indicator aria-hidden>
                                ✓
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <Field.Label>Accept terms</Field.Label>
                    </div>
                    <Field.Description>Required to continue.</Field.Description>
                    <Field.Error>You must accept the terms.</Field.Error>
                </Field.Root>
                <Field.Root name="fruit" className="stack">
                    <Field.Label>Fruit</Field.Label>
                    <Select.Root items={FRUIT_ITEMS} required>
                        <Select.Trigger className="select-trigger">
                            <Select.Value placeholder="Choose a fruit" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Positioner
                                sideOffset={4}
                                alignItemWithTrigger={false}
                            >
                                <Select.Popup className="select-popup">
                                    <Select.List>
                                        {FRUIT_ITEMS.map((item) => (
                                            <Select.Item
                                                key={item.value}
                                                value={item.value}
                                                disabled={item.disabled}
                                                className="item"
                                            >
                                                <Select.ItemText>
                                                    {item.label}
                                                </Select.ItemText>
                                            </Select.Item>
                                        ))}
                                    </Select.List>
                                </Select.Popup>
                            </Select.Positioner>
                        </Select.Portal>
                    </Select.Root>
                    <Field.Description>Pick one.</Field.Description>
                    <Field.Error>Choose a fruit.</Field.Error>
                </Field.Root>
                <Field.Root name="volume" className="stack">
                    <Field.Label>Volume</Field.Label>
                    <Slider.Root defaultValue={50}>
                        <Slider.Control className="slider-control">
                            <Slider.Track className="slider-track">
                                <Slider.Indicator className="slider-indicator" />
                                <Slider.Thumb className="slider-thumb" />
                            </Slider.Track>
                        </Slider.Control>
                    </Slider.Root>
                    <Field.Description>From 0 to 100.</Field.Description>
                </Field.Root>
                <button type="submit">Submit</button>
            </Form>
            <Output values={{ form }} />
        </>
    );
}
