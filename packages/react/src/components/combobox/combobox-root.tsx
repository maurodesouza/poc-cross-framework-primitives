import type { Align, Side } from "@poc/dom";
import {
    type ReactNode,
    useCallback,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import {
    type OverlayRootProps,
    useOverlayRoot,
} from "../../hooks/use-overlay-root.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { ComboboxContext, type ComboboxItemInfo } from "./combobox-context.ts";

export interface ComboboxRootProps extends OverlayRootProps {
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, details: ChangeDetails) => void;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
    disabled?: boolean;
    children?: ReactNode;
}

/** Holds the combobox's state; renders no element (spec/combobox.md). */
export function ComboboxRoot({
    value: valueProp,
    defaultValue = null,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue = "",
    onInputValueChange,
    disabled = false,
    children,
    ...overlayProps
}: ComboboxRootProps) {
    const root = useOverlayRoot(overlayProps);
    const [value, setValue] = useControllableState(
        valueProp,
        defaultValue,
        onValueChange,
    );
    const [inputValue, setInputValueState] = useControllableState(
        inputValueProp,
        defaultInputValue,
        onInputValueChange,
    );
    const [highlighted, setHighlighted] = useState<string | null>(null);
    const items = useMemo(() => new Map<HTMLElement, ComboboxItemInfo>(), []);
    const [list, setList] = useState<HTMLElement | null>(null);
    const [button, setButton] = useState<HTMLElement | null>(null);
    const [itemCount, setItemCount] = useState(0);
    const pendingHighlight = useRef<"first" | "last" | null>(null);
    const [placed, setPlaced] = useState<{ side: Side; align: Align }>({
        side: "bottom",
        align: "start",
    });
    const listId = `${useId()}-list`;
    const { setOpen } = root;

    const setInputValue = useCallback(
        (next: string, reason: ChangeReason) =>
            setInputValueState(next, { reason }),
        [setInputValueState],
    );
    const choose = useCallback(
        (next: string) => {
            const item = [...items.values()].find(
                (candidate) => candidate.value === next,
            );
            if (item === undefined || item.disabled) {
                return;
            }
            setValue(next, { reason: "item-press" });
            setInputValueState(item.label, { reason: "item-press" });
            setHighlighted(null);
            setOpen(false, "item-press");
        },
        [items, setValue, setInputValueState, setOpen],
    );
    const clear = useCallback(() => {
        setInputValueState("", { reason: "escape-key" });
        setValue(null, { reason: "escape-key" });
    }, [setInputValueState, setValue]);

    const context = useMemo(
        () => ({
            ...root,
            value,
            inputValue,
            setInputValue,
            disabled,
            highlighted,
            setHighlighted,
            choose,
            clear,
            items,
            list,
            setList,
            button,
            setButton,
            listId,
            pendingHighlight,
            placed,
            setPlaced,
            itemCount,
            setItemCount,
        }),
        [
            root,
            value,
            inputValue,
            setInputValue,
            disabled,
            highlighted,
            choose,
            clear,
            items,
            list,
            button,
            listId,
            placed,
            itemCount,
        ],
    );
    return (
        <ComboboxContext.Provider value={context}>
            {children}
        </ComboboxContext.Provider>
    );
}
