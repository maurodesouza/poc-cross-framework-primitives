// Adapted from Base UI (packages/react/src/internals/filter.ts, internals/resolveValueLabel.tsx,
// combobox/root/AriaCombobox.tsx), MIT.

/** A group of items: any object with an `items` array (spec/combobox.md, "API"). */
export interface ItemGroup<Item> {
    readonly items: readonly Item[];
}

/** An item matches the query (spec/combobox.md, `filter`). */
export type ItemFilter<Item> = (
    item: Item,
    query: string,
    itemToString: (item: Item) => string,
) => boolean;

/** Whether an item is a value (`isItemEqualToValue`). */
export type ItemEquality<Item> = (item: Item, value: Item) => boolean;

/** Whether an entry of `items` is a group (it carries an `items` array). */
export function isItemGroup<Item>(
    entry: Item | ItemGroup<Item>,
): entry is ItemGroup<Item> {
    return (
        typeof entry === "object" &&
        entry !== null &&
        Array.isArray((entry as { items?: unknown }).items)
    );
}

/** Every item of `items`, groups flattened, in order. */
export function flattenItems<Item>(
    items: readonly (Item | ItemGroup<Item>)[],
): Item[] {
    return items.flatMap((entry) =>
        isItemGroup(entry) ? [...entry.items] : [entry],
    );
}

function serialize(item: unknown): string {
    if (item === null || item === undefined) {
        return "";
    }
    return typeof item === "string" ? item : (JSON.stringify(item) ?? "");
}

/**
 * An item's text (`itemToStringLabel`): the consumer's function, else an object's `label`, else
 * its `value`, else the item itself.
 */
export function itemLabel<Item>(
    item: Item | null | undefined,
    itemToStringLabel?: (item: Item) => string,
): string {
    if (item === null || item === undefined) {
        return "";
    }
    if (itemToStringLabel !== undefined) {
        return itemToStringLabel(item) ?? "";
    }
    if (typeof item === "object") {
        const record = item as { label?: unknown; value?: unknown };
        if (record.label !== null && record.label !== undefined) {
            return String(record.label);
        }
        if ("value" in record) {
            return String(record.value);
        }
    }
    return typeof item === "string" ? item : serialize(item);
}

/**
 * An item's form value (`itemToStringValue`): the consumer's function, else the `value` of an
 * object with `value` and `label`, else the item as a string.
 */
export function itemFormValue<Item>(
    item: Item | null | undefined,
    itemToStringValue?: (item: Item) => string,
): string {
    if (item === null || item === undefined) {
        return "";
    }
    if (itemToStringValue !== undefined) {
        return itemToStringValue(item) ?? "";
    }
    if (typeof item === "object" && "value" in item && "label" in item) {
        return serialize((item as { value: unknown }).value);
    }
    return serialize(item);
}

const collators = new Map<string, Intl.Collator>();

function collator(locale: string | undefined): Intl.Collator {
    const key = locale ?? "";
    let found = collators.get(key);
    if (found === undefined) {
        found = new Intl.Collator(locale, {
            usage: "search",
            sensitivity: "base",
            ignorePunctuation: true,
        });
        collators.set(key, found);
    }
    return found;
}

/** Whether `text` holds `query`, ignoring case, accents and punctuation (the locale's collator). */
export function textContains(
    text: string,
    query: string,
    locale?: string,
): boolean {
    if (query === "") {
        return true;
    }
    const compare = collator(locale);
    for (let start = 0; start <= text.length - query.length; start += 1) {
        if (
            compare.compare(text.slice(start, start + query.length), query) ===
            0
        ) {
            return true;
        }
    }
    return false;
}

/** The default `filter`: the item's label contains the query, for the locale. */
export function containsFilter<Item>(locale?: string): ItemFilter<Item> {
    return (item, query, itemToString) =>
        textContains(itemToString(item), query, locale);
}

/**
 * Whether the query is the selected item's label: then a single combobox that just opened shows
 * every item (spec/combobox.md, "The query").
 */
export function queryIsLabel(
    label: string,
    query: string,
    locale?: string,
): boolean {
    return (
        query !== "" &&
        label.length === query.length &&
        textContains(label, query, locale)
    );
}

export interface FilterItemsOptions<Item> {
    /** `null`: no filtering. */
    filter: ItemFilter<Item> | null;
    /** The most items kept, across groups; `-1` for no limit. */
    limit: number;
    itemToString: (item: Item) => string;
}

/**
 * The entries a List renders for a query: the matching items, or the groups with their matching
 * items (a group with none is left out), at most `limit` items in all.
 */
export function filterItems<Item>(
    items: readonly (Item | ItemGroup<Item>)[],
    query: string,
    options: FilterItemsOptions<Item>,
): (Item | ItemGroup<Item>)[] {
    const { filter, limit, itemToString } = options;
    let left = limit < 0 ? Number.POSITIVE_INFINITY : limit;
    const keep = (item: Item) =>
        query === "" || filter === null || filter(item, query, itemToString);
    const take = (list: readonly Item[]): Item[] => {
        const kept: Item[] = [];
        for (const item of list) {
            if (left <= 0) {
                break;
            }
            if (keep(item)) {
                kept.push(item);
                left -= 1;
            }
        }
        return kept;
    };
    const entries: (Item | ItemGroup<Item>)[] = [];
    for (const entry of items) {
        if (left <= 0) {
            break;
        }
        if (isItemGroup(entry)) {
            const kept = take(entry.items);
            if (kept.length > 0) {
                entries.push({ ...entry, items: kept });
            }
        } else {
            entries.push(...take([entry]));
        }
    }
    return entries;
}

/** `isItemEqualToValue`, with `null` and `undefined` compared by identity. */
export function itemsEqual<Item>(
    item: Item | null | undefined,
    value: Item | null | undefined,
    isEqual: ItemEquality<Item> = Object.is,
): boolean {
    if (
        item === null ||
        item === undefined ||
        value === null ||
        value === undefined
    ) {
        return Object.is(item, value);
    }
    return isEqual(item, value);
}

/** Whether `item` is one of `values`. */
export function includesItem<Item>(
    values: readonly Item[],
    item: Item,
    isEqual?: ItemEquality<Item>,
): boolean {
    return values.some((value) => itemsEqual(item, value, isEqual));
}

/** `values` with `item` added at the end, or removed when it is already one of them. */
export function toggleItem<Item>(
    values: readonly Item[],
    item: Item,
    isEqual?: ItemEquality<Item>,
): Item[] {
    return includesItem(values, item, isEqual)
        ? values.filter((value) => !itemsEqual(item, value, isEqual))
        : [...values, item];
}
