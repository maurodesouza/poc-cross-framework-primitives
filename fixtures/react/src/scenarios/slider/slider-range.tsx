import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";
import { Slider } from "../../kit/ui/slider.tsx";

const LABELS = ["Minimum price", "Maximum price"];

export function SliderRange() {
    const [value, setValue] = useState<readonly number[]>([20, 80]);
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
                <Slider.Root
                    defaultValue={[20, 80]}
                    minStepsBetweenValues={10}
                    name="price"
                    onValueChange={(next: number[]) => setValue(next)}
                >
                    <Slider.Control data-testid="control">
                        <Slider.Track>
                            <Slider.Indicator />
                            {LABELS.map((label, index) => (
                                <Slider.Thumb
                                    key={label}
                                    index={index}
                                    aria-label={label}
                                    getAriaValueText={(thumbValue: number) =>
                                        `$${thumbValue}`
                                    }
                                />
                            ))}
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <button type="submit">Submit</button>
            </form>
            <Output values={{ value: value.join(","), form }} />
        </>
    );
}
