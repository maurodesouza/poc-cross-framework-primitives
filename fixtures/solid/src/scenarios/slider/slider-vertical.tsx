import { createSignal } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Slider } from "../../kit/ui/slider.tsx";

export function SliderVertical() {
    const [value, setValue] = createSignal(30);
    return (
        <>
            <Slider.Root
                defaultValue={30}
                orientation="vertical"
                onValueChange={(next: number) => setValue(next)}
            >
                <Slider.Control data-testid="control">
                    <Slider.Track>
                        <Slider.Indicator />
                        <Slider.Thumb aria-label="Brightness" />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
            <Output values={{ value: value() }} />
        </>
    );
}
