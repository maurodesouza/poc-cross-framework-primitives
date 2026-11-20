import { dialog } from "@poc/styles";
import { Dialog as Primitive } from "@poc/vue";
import { styled } from "../styled.ts";

export const Dialog = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: styled(Primitive.Trigger, dialog.trigger),
    Backdrop: styled(Primitive.Backdrop, dialog.backdrop),
    Popup: styled(Primitive.Popup, dialog.popup),
    Title: styled(Primitive.Title, dialog.title),
    Description: styled(Primitive.Description, dialog.description),
    Close: styled(Primitive.Close, dialog.close),
};
