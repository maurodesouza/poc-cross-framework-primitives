import { createSignal, For } from "solid-js";
import { Output } from "../../kit/output.tsx";
import { Tabs } from "../../kit/ui/tabs.tsx";

const TABS = [
    { value: "account", label: "Account" },
    { value: "password", label: "Password" },
    { value: "billing", label: "Billing", disabled: true },
    { value: "team", label: "Team" },
];

/** The tabs of every tabs scenario (spec/tabs.md). */
export function SettingsTabs(props: {
    activation: "automatic" | "manual";
    orientation: "horizontal" | "vertical";
}) {
    const [value, setValue] = createSignal("account");
    return (
        <>
            <Tabs.Root
                value={value()}
                onValueChange={(next: string) => setValue(next)}
                activation={props.activation}
                orientation={props.orientation}
            >
                <Tabs.List>
                    <For each={TABS}>
                        {(tab) => (
                            <Tabs.Tab value={tab.value} disabled={tab.disabled}>
                                {tab.label}
                            </Tabs.Tab>
                        )}
                    </For>
                    <Tabs.Indicator />
                </Tabs.List>
                <For each={TABS}>
                    {(tab) => (
                        <Tabs.Panel value={tab.value}>
                            <p>{tab.label} settings</p>
                        </Tabs.Panel>
                    )}
                </For>
            </Tabs.Root>
            <button type="button" class="mt-2">
                After tabs
            </button>
            <Output values={{ value: value() }} />
        </>
    );
}
