import { readQuery } from "../kit/query.ts";
import { routes } from "./routes.tsx";

export function App() {
    const query = readQuery(window.location.search);
    document.documentElement.dir = query.dir;
    document.documentElement.lang = query.locale;
    const Scenario = routes[window.location.pathname];
    if (Scenario === undefined) {
        return (
            <main className="p-6">
                <h1 className="text-lg font-semibold">React fixture</h1>
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
        <main className="p-6">
            <Scenario locale={query.locale} />
        </main>
    );
}
