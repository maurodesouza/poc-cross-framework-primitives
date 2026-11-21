import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { formEntries } from "../../kit/form-entries.ts";
import { Output } from "../../kit/output.tsx";

/** Also `/slider/rtl` (the page sets `dir`). */
export function SliderBasic() {
    const [value, setValue] = useState<number>();
    const [committed, setCommitted] = useState<number>();
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
                    defaultValue={50}
                    name="volume"
                    onValueChange={(next) => setValue(next as number)}
                    onValueCommitted={(next) => setCommitted(next as number)}
                >
                    <Slider.Control
                        className="slider-control"
                        data-testid="control"
                    >
                        <Slider.Track className="slider-track">
                            <Slider.Indicator className="slider-indicator" />
                            <Slider.Thumb
                                className="slider-thumb"
                                aria-label="Volume"
                            />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <button type="submit">Submit</button>
            </form>
            <Output values={{ value, committed, form }} />
        </>
    );
}
