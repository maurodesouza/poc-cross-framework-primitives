/**
 * A control's `aria-describedby` from the field's description and shown errors: their ids in
 * document order, or `undefined` when there is none (spec/field.md).
 */
export function fieldDescribedBy(
    elements: Iterable<HTMLElement>,
): string | undefined {
    const sorted = [...elements]
        .filter((element) => element.id !== "")
        .sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
                ? -1
                : 1,
        );
    return sorted.length === 0
        ? undefined
        : sorted.map((element) => element.id).join(" ");
}
