import { createSignal, For } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Checkbox } from "../../kit/ui/checkbox.tsx";
import { Field } from "../../kit/ui/field.tsx";
import { Select } from "../../kit/ui/select.tsx";
import { Slider } from "../../kit/ui/slider.tsx";
import { FRUIT_ITEMS } from "../select/fruit-items.ts";

export function FieldControls() {
    const [form, setForm] = createSignal<string>();
    return (
        <>
            <form
                class="flex flex-col items-start gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    setForm(formEntries(event.currentTarget));
                }}
            >
                <Field.Root name="terms">
                    <div class="flex items-center gap-2">
                        <Checkbox.Root required />
                        <Field.Label>Accept terms</Field.Label>
                    </div>
                    <Field.Description>Required to continue.</Field.Description>
                    <Field.Error>You must accept the terms.</Field.Error>
                </Field.Root>
                <Field.Root name="fruit">
                    <Field.Label>Fruit</Field.Label>
                    <Select.Root items={FRUIT_ITEMS} required>
                        <Select.Trigger>
                            <Select.Value placeholder="Choose a fruit" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Positioner>
                                <Select.Popup>
                                    <Select.List>
                                        <For each={FRUIT_ITEMS}>
                                            {(item) => (
                                                <Select.Item value={item.value}>
                                                    {item.label}
                                                    <Select.ItemIndicator>
                                                        ✓
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                            )}
                                        </For>
                                    </Select.List>
                                </Select.Popup>
                            </Select.Positioner>
                        </Select.Portal>
                    </Select.Root>
                    <Field.Description>Pick one.</Field.Description>
                    <Field.Error>Choose a fruit.</Field.Error>
                </Field.Root>
                <Field.Root name="volume">
                    <Field.Label>Volume</Field.Label>
                    <Slider.Root defaultValue={50}>
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Indicator />
                                <Slider.Thumb />
                            </Slider.Track>
                        </Slider.Control>
                    </Slider.Root>
                    <Field.Description>From 0 to 100.</Field.Description>
                </Field.Root>
                <button type="submit">Submit</button>
            </form>
            <Output values={{ form: form() }} />
        </>
    );
}
