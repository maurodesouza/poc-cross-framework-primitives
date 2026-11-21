import { useState } from "react";
import { Output } from "../../kit/output.tsx";
import { Slider } from "../../kit/ui/slider.tsx";

/** The consumer refuses any value above 80: the slider stays. */
export function SliderControlled() {
    const [value, setValue] = useState(70);
    const [requested, setRequested] = useState<number>();
    return (
        <>
            <Slider.Root
                value={value}
                onValueChange={(next: number) => {
                    setRequested(next);
                    if (next <= 80) {
                        setValue(next);
                    }
                }}
            >
                <Slider.Control data-testid="control">
                    <Slider.Track>
                        <Slider.Indicator />
                        <Slider.Thumb aria-label="Limited" />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
            <Output values={{ value, requested }} />
        </>
    );
}
