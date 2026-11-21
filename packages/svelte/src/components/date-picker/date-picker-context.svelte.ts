import type { ChangeDetails } from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";

export class DatePickerState extends OverlayRoot {
    readonly #value: Controllable<CalendarValue>;
    readonly #onValue: () =>
        | ((value: CalendarValue, details: ChangeDetails) => void)
        | undefined;

    constructor(
        overlay: ConstructorParameters<typeof OverlayRoot>[0],
        value: {
            read: () => CalendarValue | undefined;
            write: (value: CalendarValue) => void;
            initial: CalendarValue;
            onChange: () =>
                | ((value: CalendarValue, details: ChangeDetails) => void)
                | undefined;
        },
        readonly mode: CalendarMode,
        readonly options: () => CalendarOptions,
    ) {
        super({ ...overlay, placed: { side: "bottom", align: "start" } });
        this.#value = new Controllable(value.read, value.write, value.initial);
        this.#onValue = value.onChange;
    }

    get value(): CalendarValue {
        return this.#value.value;
    }

    /** Sets the value and closes the popup (reason `item-press`). */
    choose(next: CalendarValue): void {
        if (this.#value.set(next)) {
            this.#onValue()?.(next, { reason: "item-press" });
        }
        this.setOpen(false, "item-press");
    }
}

export const DatePickerContext = createContext<DatePickerState>("DatePicker");
