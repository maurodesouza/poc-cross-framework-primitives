# poc-cross-framework-primitives

A proof of concept: headless UI primitives written from scratch for React, Vue, Angular, Svelte
and Solid, with **no shared component core**. They share a spec, framework-free DOM utilities, one
Tailwind styling layer and one conformance suite. The question is whether that is enough to give
the same behaviour and the same UI in every framework, at a sustainable cost.

- The rules: [`AGENTS.md`](AGENTS.md)
- The plan, phases and metrics: [`docs/plan.md`](docs/plan.md)
- The results: `docs/reports/` (from Epic B on)

## Getting started

```sh
pnpm install
pnpm check      # Biome and the source layout check
pnpm typecheck
pnpm test
pnpm e2e        # the conformance suite (from Epic A's conformance issue on)
```

Requires Node 24 or later and pnpm (the version is pinned in `package.json`).
