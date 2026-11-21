import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
    SliderControl,
    SliderIndicator,
    SliderRoot,
    SliderThumb,
    SliderTrack,
    type SliderValue,
} from "@poc/angular";
import { slider } from "@poc/styles";
import { Output } from "../../kit/output.ts";

@Component({
    selector: "[scenario-slider-vertical]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        SliderRoot,
        SliderControl,
        SliderTrack,
        SliderIndicator,
        SliderThumb,
        Output,
    ],
    template: `
        <div sliderRoot [defaultValue]="30" orientation="vertical" (valueChange)="value.set(single($event))" [class]="styles.root">
            <div sliderControl data-testid="control" [class]="styles.control"><div sliderTrack [class]="styles.track"><div sliderIndicator [class]="styles.indicator"></div><div sliderThumb aria-label="Brightness" [class]="styles.thumb"></div></div></div>
        </div>
        <pre fixtureOutput [values]="{ value: value() }"></pre>
    `,
})
export class SliderVertical {
    protected readonly styles = slider;
    protected readonly value = signal(30);
    protected readonly single = (value: SliderValue) => value as number;
}
