import { useContext } from "solid-js";
import {
    DatePickerContext,
    type DatePickerContextValue,
} from "./date-picker-context.ts";

/** The nearest picker (its context is optional, so a missing Root throws here). */
export function usePicker(part: string): DatePickerContextValue {
    const context = useContext(DatePickerContext);
    if (context === null) {
        throw new Error(`<${part}> must be inside <DatePicker.Root>.`);
    }
    return context;
}
