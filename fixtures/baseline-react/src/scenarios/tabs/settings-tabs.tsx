import { Tabs } from "@base-ui/react/tabs";
import { useState } from "react";
import { Output } from "../../kit/output.tsx";

const TABS = [
    { value: "account", label: "Account" },
    { value: "password", label: "Password" },
    { value: "billing", label: "Billing", disabled: true },
    { value: "team", label: "Team" },
];

/** The tabs of every tabs scenario (spec/tabs.md). */
export function SettingsTabs({
    activation,
    orientation,
}: {
    activation: "automatic" | "manual";
    orientation: "horizontal" | "vertical";
}) {
    const [value, setValue] = useState("account");
    return (
        <>
            <Tabs.Root
                value={value}
                onValueChange={(next) => setValue(String(next))}
                orientation={orientation}
            >
                <Tabs.List activateOnFocus={activation === "automatic"}>
                    {TABS.map((tab) => (
                        <Tabs.Tab
                            key={tab.value}
                            value={tab.value}
                            disabled={tab.disabled}
                        >
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                    <Tabs.Indicator />
                </Tabs.List>
                {TABS.map((tab) => (
                    <Tabs.Panel key={tab.value} value={tab.value}>
                        <p>{tab.label} settings</p>
                    </Tabs.Panel>
                ))}
            </Tabs.Root>
            <button type="button">After tabs</button>
            <Output values={{ value }} />
        </>
    );
}
