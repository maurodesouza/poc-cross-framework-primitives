import { calendar } from "@poc/styles";
import {
    Calendar as Primitive,
    RangeCalendar as RangePrimitive,
} from "@poc/vue";
import { styled } from "../styled.ts";

export const Calendar = { Root: styled(Primitive.Root, calendar.root) };
export const RangeCalendar = {
    Root: styled(RangePrimitive.Root, calendar.root),
};
