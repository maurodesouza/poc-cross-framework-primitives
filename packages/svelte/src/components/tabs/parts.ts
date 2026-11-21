import TabsIndicator from "./tabs-indicator.svelte";
import TabsList from "./tabs-list.svelte";
import TabsPanel from "./tabs-panel.svelte";
import TabsRoot from "./tabs-root.svelte";
import TabsTab from "./tabs-tab.svelte";

/** spec/tabs.md */
export const Tabs = {
    Root: TabsRoot,
    List: TabsList,
    Tab: TabsTab,
    Indicator: TabsIndicator,
    Panel: TabsPanel,
};
