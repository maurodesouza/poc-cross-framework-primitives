/** What a form submits, as `key=value&...` (spec/checkbox.md, "Scenarios"); `empty` for nothing. */
export function formEntries(form: HTMLFormElement): string {
    const entries = [...new FormData(form)].map(
        ([key, value]) => `${key}=${String(value)}`,
    );
    return entries.length === 0 ? "empty" : entries.join("&");
}
