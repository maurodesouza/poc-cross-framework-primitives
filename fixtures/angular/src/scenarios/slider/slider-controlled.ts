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

/** The consumer refuses any value above 80: the slider stays. */
@Component({
    selector: "[scenario-slider-controlled]",
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
        <div sliderRoot [value]="value()" (valueChange)="onValueChange($event)" [class]="styles.root">
            <div sliderControl data-testid="control" [class]="styles.control"><div sliderTrack [class]="styles.track"><div sliderIndicator [class]="styles.indicator"></div><div sliderThumb aria-label="Limited" [class]="styles.thumb"></div></div></div>
        </div>
        <pre fixtureOutput [values]="{ value: value(), requested: requested() }"></pre>
    `,
})
export class SliderControlled {
    protected readonly styles = slider;
    protected readonly value = signal(70);
    protected readonly requested = signal<number | undefined>(undefined);

    protected onValueChange(next: SliderValue): void {
        const value = next as number;
        this.requested.set(value);
        if (value <= 80) {
            this.value.set(value);
        }
    }
}
