import { DirectionProvider } from "@base-ui/react/direction-provider";
import { I18nProvider } from "react-aria-components";
import { readQuery } from "../kit/query.ts";
import { routes } from "./routes.tsx";

export function App() {
    const query = readQuery(window.location.search);
    document.documentElement.dir = query.dir;
    document.documentElement.lang = query.locale;
    const Scenario = routes[window.location.pathname];
    if (Scenario === undefined) {
        return (
            <main>
                <h1>Baseline fixture</h1>
                <ul>
                    {Object.keys(routes).map((path) => (
                        <li key={path}>
                            <a href={path}>{path}</a>
                        </li>
                    ))}
                </ul>
            </main>
        );
    }
    return (
        // Base UI reads the direction from its provider, not from the document
        // (spec baseline deviations); React Aria reads it from the locale.
        <DirectionProvider direction={query.dir}>
            <I18nProvider locale={query.locale}>
                <main>
                    <Scenario locale={query.locale} />
                </main>
            </I18nProvider>
        </DirectionProvider>
    );
}
