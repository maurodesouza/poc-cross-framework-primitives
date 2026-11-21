import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";

const LABELS = ["Minimum price", "Maximum price"];

export function SliderRange() {
    const [value, setValue] = useState<readonly number[]>([20, 80]);
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
                <Slider.Root
                    defaultValue={[20, 80]}
                    minStepsBetweenValues={10}
                    name="price"
                    onValueChange={(next) => setValue(next as number[])}
                >
                    <Slider.Control
                        className="slider-control"
                        data-testid="control"
                    >
                        <Slider.Track className="slider-track">
                            <Slider.Indicator className="slider-indicator" />
                            {LABELS.map((label, index) => (
                                <Slider.Thumb
                                    key={label}
                                    index={index}
                                    className="slider-thumb"
                                    aria-label={label}
                                    getAriaValueText={(_, thumbValue) =>
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
