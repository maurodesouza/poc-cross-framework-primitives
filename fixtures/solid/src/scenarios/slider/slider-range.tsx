import { createSignal, For } from "solid-js";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Slider } from "../../kit/ui/slider.tsx";

const LABELS = ["Minimum price", "Maximum price"];

export function SliderRange() {
    const [value, setValue] = createSignal<readonly number[]>([20, 80]);
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
                <Slider.Root
                    defaultValue={[20, 80]}
                    minStepsBetweenValues={10}
                    name="price"
                    onValueChange={(next: number[]) => setValue(next)}
                >
                    <Slider.Control data-testid="control">
                        <Slider.Track>
                            <Slider.Indicator />
                            <For each={LABELS}>
                                {(label, index) => (
                                    <Slider.Thumb
                                        index={index()}
                                        aria-label={label}
                                        getAriaValueText={(
                                            thumbValue: number,
                                        ) => `$${thumbValue}`}
                                    />
                                )}
                            </For>
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <button type="submit">Submit</button>
            </form>
            <Output values={{ value: value().join(","), form: form() }} />
        </>
    );
}
