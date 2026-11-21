/**
 * Every scenario of the specs, at `/<component>/<scenario>` (the same list as the React
 * fixture's). `app.ts` renders each one with an `@case`, on the `<main>` itself, so the DOM has no
 * element of Angular's own.
 */
export const ROUTES = [
    "/dialog/basic",
    "/dialog/initial-focus",
    "/dialog/nested-popover",
    "/dialog/controlled",
    "/dialog/rejected-close",
    "/popover/basic",
    "/popover/placement",
    "/popover/rtl",
    "/popover/arrow",
    "/menu/basic",
    "/menu/submenu",
    "/menu/groups",
    "/combobox/basic",
    "/combobox/controlled",
    "/combobox/rejected-input",
    "/tabs/automatic",
    "/tabs/manual",
    "/tabs/vertical",
    "/calendar/single",
    "/calendar/min-max",
    "/calendar/unavailable",
    "/calendar/locale",
    "/calendar/rtl",
    "/calendar/two-months",
    "/calendar/range",
    "/date-picker/basic",
    "/date-picker/range",
] as const;
