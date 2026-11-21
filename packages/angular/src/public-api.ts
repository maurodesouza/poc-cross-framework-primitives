// @poc/angular: the POC's primitives for Angular 22 (standalone directives, signals, zoneless),
// written from scratch on @poc/dom and spec/ (AGENTS.md). Each part is an attribute directive on
// the consumer's own element; see spec/README.md, "API mapping by framework".

export {
    DialogBackdrop,
    type DialogBackdropState,
} from "./lib/directives/dialog/dialog-backdrop.directive.ts";
export { DialogClose } from "./lib/directives/dialog/dialog-close.directive.ts";
export { DialogDescription } from "./lib/directives/dialog/dialog-description.directive.ts";
export {
    DialogPopup,
    type DialogPopupState,
} from "./lib/directives/dialog/dialog-popup.directive.ts";
export { DialogPortal } from "./lib/directives/dialog/dialog-portal.directive.ts";
export {
    DialogRoot,
    type DialogState,
} from "./lib/directives/dialog/dialog-root.directive.ts";
export { DialogTitle } from "./lib/directives/dialog/dialog-title.directive.ts";
export {
    DialogTrigger,
    type DialogTriggerState,
} from "./lib/directives/dialog/dialog-trigger.directive.ts";
export { injectDialog } from "./lib/inject/inject-dialog.ts";
export type {
    ChangeDetails,
    ChangeReason,
    FocusTarget,
    OpenChangeEvent,
    ValueChangeEvent,
} from "./lib/utils/change-details.ts";
