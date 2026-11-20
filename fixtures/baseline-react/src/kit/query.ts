/** The scenario's query parameters (spec/README.md, "Scenarios and fixtures"). */
export interface ScenarioQuery {
    locale: string;
    dir: "ltr" | "rtl";
}

export function readQuery(search: string): ScenarioQuery {
    const params = new URLSearchParams(search);
    return {
        locale: params.get("locale") ?? "en-US",
        dir: params.get("dir") === "rtl" ? "rtl" : "ltr",
    };
}
