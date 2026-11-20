/** The items of one menu level, in order (a submenu's items live in its own popup). */
export function menuItems(popup: HTMLElement): HTMLElement[] {
    return [...popup.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(
        (item) => item.closest('[role="menu"]') === popup,
    );
}
