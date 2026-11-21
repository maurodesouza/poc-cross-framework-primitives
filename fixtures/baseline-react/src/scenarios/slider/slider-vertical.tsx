import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

export function SliderVertical() {
    const [value, setValue] = useState(30);
    return (
        <>
            <Slider.Root
                defaultValue={30}
                orientation="vertical"
                onValueChange={(next) => setValue(next as number)}
            >
                <Slider.Control
                    className="slider-control"
                    data-testid="control"
                >
                    <Slider.Track className="slider-track">
                        <Slider.Indicator className="slider-indicator" />
                        <Slider.Thumb
                            className="slider-thumb"
                            aria-label="Brightness"
                        />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
            <Output values={{ value }} />
        </>
    );
}
