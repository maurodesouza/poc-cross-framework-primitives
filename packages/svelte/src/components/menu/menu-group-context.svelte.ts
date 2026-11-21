import { createContext } from "../../utils/context.ts";

export class MenuGroupState {
    labelId = $state<string | undefined>(undefined);
}

export const MenuGroupContext = createContext<MenuGroupState>("MenuGroup");
