import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

/** The consumer refuses any value above 80: the slider stays. */
export function SliderControlled() {
    const [value, setValue] = useState(70);
    const [requested, setRequested] = useState<number>();
    return (
        <>
            <Slider.Root
                value={value}
                onValueChange={(next) => {
                    setRequested(next as number);
                    if ((next as number) <= 80) {
                        setValue(next as number);
                    }
                }}
            >
                <Slider.Control
                    className="slider-control"
                    data-testid="control"
                >
                    <Slider.Track className="slider-track">
                        <Slider.Indicator className="slider-indicator" />
                        <Slider.Thumb
                            className="slider-thumb"
                            aria-label="Limited"
                        />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
            <Output values={{ value, requested }} />
        </>
    );
}
