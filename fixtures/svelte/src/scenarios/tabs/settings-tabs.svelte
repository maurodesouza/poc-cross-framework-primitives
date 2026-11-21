<script lang="ts">
import { tabs as styles } from "@poc/styles";
import { Tabs } from "@poc/svelte";
import Output from "../../kit/output.svelte";

// The tabs of every tabs scenario (spec/tabs.md).
let {
    activation,
    orientation,
}: {
    activation: "automatic" | "manual";
    orientation: "horizontal" | "vertical";
} = $props();
let value = $state("account");
const TABS = [
    { value: "account", label: "Account" },
    { value: "password", label: "Password" },
    { value: "billing", label: "Billing", disabled: true },
    { value: "team", label: "Team" },
];
</script>

<Tabs.Root bind:value {activation} {orientation} class={styles.root}><Tabs.List class={styles.list}>{#each TABS as tab (tab.value)}<Tabs.Tab value={tab.value} disabled={tab.disabled} class={styles.tab}>{tab.label}</Tabs.Tab>{/each}<Tabs.Indicator class={styles.indicator} /></Tabs.List>{#each TABS as tab (tab.value)}<Tabs.Panel value={tab.value} class={styles.panel}><p>{#each [tab.label, " settings"] as run}{run}{/each}</p></Tabs.Panel>{/each}</Tabs.Root><button type="button" class="mt-2">After tabs</button><Output values={{ value }} />
