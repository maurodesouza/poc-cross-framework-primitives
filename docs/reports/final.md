# Final report: the POC's verdict (Epic G)

**Verdict: yes.** Headless primitives written from scratch for React, Vue, Svelte, Solid and
Angular, sharing **no component core**, delivered the same behaviour and the same UI for all ten
components.

- **What they share:** a spec, a framework-free DOM toolkit (`@poc/dom`), one Tailwind styling
  layer and one conformance suite.
- **Porting cost:** sustainable, and it falls once a framework's rendering model is mapped.
- **Quality:** on the spec's terms, they pass every test Base UI and React Aria pass, plus the 17
  those two fail.

This page is evidence for the maintainer's decision. It gives a recommendation for Fragiola, not
a decision.

- Data: [`data/`](data/), regenerated for all five frameworks in Epic G.
- The comparison: [frameworks.md](frameworks.md).
- Per framework: [react](react.md), [vue](vue.md), [svelte](svelte.md), [solid](solid.md),
  [angular](angular.md).
- Earlier: the checkpoint after Vue, [checkpoint.md](checkpoint.md).
- Still open: [screen-readers.md](screen-readers.md) (pending, needs a person).

## The question

> Can headless UI primitives written **from scratch for each framework** share **no component
> core**, only DOM utilities, a spec, a Tailwind styling layer and a conformance suite, and still
> deliver **the same behaviour and the same UI** in every framework, at a sustainable porting
> cost, with quality close to Base UI and React Aria?

([`docs/plan.md`](../plan.md).) The answer was tested on ten components:

- the six mandatory ones: Dialog, Popover, Menu with submenus, Combobox, Tabs, and the calendar
  family with the date pickers;
- the four extras: Select, Tooltip, Checkbox and CheckboxGroup, Slider. They test what the six
  did not reach: forms with hidden inputs, hover intent and pointer capture.

## The hypotheses

| # | hypothesis | verdict | evidence |
| --- | --- | --- | --- |
| 1 | Same behaviour without a shared core | **confirmed** | all five pass 140 / 140 behaviour and 24 / 24 contract tests, with no test changed for any port ([frameworks.md §1](frameworks.md#1-same-behaviour-without-a-shared-core-confirmed), `data/*.md` "Conformance") |
| 2 | Same UI from one styling layer | **confirmed** | every port's 24 screens match React's golden screenshots, pixel for pixel; the recipes never changed for a port; what needed care was the fixture DOM (text-node runs, host elements) ([§2](frameworks.md#2-same-ui-from-one-styling-layer-confirmed)) |
| 3 | Sustainable porting: "a fraction" of the first implementation | **confirmed for the extras, partly for the first six** | the six: Vue and Svelte at 0.6–0.7 of React, Solid and Angular at 1.6–1.9. The extras: 0.4 (Vue, Svelte), 0.9 (Solid), 0.6 (Angular), once the port checklist mapped each runtime ([§3](frameworks.md#3-sustainable-porting-yes-and-cheaper-once-the-model-is-mapped)) |
| 4 | Bounded duplication | **confirmed** | the behaviour fixed N times is a short, known list; every bug in the shared logic was fixed once; the three Epic G ports changed nothing shared ([§4](frameworks.md#4-bounded-duplication-yes-with-the-residue-now-known)) |
| 5 | Quality close to Base UI and React Aria | **confirmed on the specs' terms; screen readers pending** | all five pass the 17 tests the baseline fails (each a recorded deviation from the APG). Bundles are smaller than Base UI, Reka UI, Bits UI and Kobalte in every pairing, from about 1.4× to 6.5×, though those libraries carry more options. A person still has to check what a screen reader says ([§5](frameworks.md#5-quality-on-the-specs-terms-above-the-baseline), [screen-readers.md](screen-readers.md)) |

### What the numbers say

- **Lines.** Ten components are 4934–5336 lines in every framework
  ([frameworks.md §3](frameworks.md#3-sustainable-porting-yes-and-cheaper-once-the-model-is-mapped)).
  The logic has the same size everywhere. On top of that come 1479 lines of `@poc/dom`, written
  once, and 344–569 lines of framework infrastructure per package.
- **Cost.**
  - The first port to a framework pays for its runtime model: 1.6–1.9× React for Solid 2.0 and
    zoneless Angular.
  - After that, a new component is a translation: 0.4–0.9× React for the extras, every extra
    green on its first suite run in Svelte, Solid and Angular.
  - The port checklist in `AGENTS.md` is what carries the model from one Epic to the next.
- **Boundary.**
  - `@poc/dom` grew by three moves, each a framework-free function that holds no component
    state:
    - the overlay session and key maps (Epic D);
    - the extras' modules (Epic F);
    - the tooltip's hover tracking (Epic G, `trackHoverBridge`).
  - What stayed per framework, by the rule, is small: CheckboxGroup's membership, the slider's
    value shape, the Escape listeners.
- **Duplicated fixes.** They all live in framework rendering, where no shared core could have
  held them:
  - focus after render;
  - effect order;
  - re-asserting a controlled value;
  - the late form reset write-back;
  - effects that read what they write.

### What the POC did not prove

- **Screen readers.** The behaviour layer checks the roles, names and relations, and axe runs on
  every scenario. No person has listened yet ([screen-readers.md](screen-readers.md)).
- **Dev-mode errors.** The suite runs production builds. Svelte's and Solid's dev-mode
  diagnostics (#44, and Solid's slider) were found by hand, and nothing guards against them yet.
- **Production scope.** Each component implements its spec's scope, which is smaller than a
  production library's (Base UI's Select has item alignment and multiple selection, for
  example). Sizes and line counts are for that scope.
- **Effort.** It comes from agent runs (commit timestamps), not human time. React's numbers
  include designing the patterns.
- **Kobalte** targets Solid 1.9. **Angular Aria**'s patterns carry no positioning. Their sizes
  are indicative only.
- **SSR**, a docs site and npm publishing were out of scope.

## Recommendation for Fragiola

**Recommendation: go ahead with Fragiola's own primitives, in stages, and replace Base UI in
React only once the same primitives exist in a second framework that Fragiola ships.** Today
Fragiola UI is React-only, on Base UI.

- **Why not stay on Base UI.** Base UI is React-only, so a Fragiola for Vue, Svelte, Solid or
  Angular cannot be built on it. Each framework would get a different library, with different
  behaviour and different gaps. This POC shows the alternative works:
  - one spec;
  - one suite as the referee;
  - one styling layer;
  - a port per framework at a known cost.

  It also already fills a gap Base UI leaves: the calendar and date picker, written once in
  `@poc/dom` (`date/`) and passing tests React Aria fails.
- **Why not replace Base UI in React right away.** For React alone the trade is not worth it yet.
  Base UI is maintained, broader in scope and already integrated. The gain comes from the second
  framework.
- **Order:**
  1. Fragiola's own primitives in **React and one more framework**, chosen by demand. Vue or
     Svelte is the cheapest second target (0.4–0.7× React).
  2. Then the others. **Solid and Angular** cost more the first time (1.6–1.9×) and the same as
     the others after that (0.6–0.9×). Angular's API is a different shape by design: directives
     on the consumer's elements.

**What each framework costs**, per new component, relative to writing it in React (from the
extras):

| | Vue | Svelte | Solid | Angular |
| --- | --- | --- | --- | --- |
| first components (runtime model not yet mapped) | 0.6 | 0.7 | 1.6 | 1.9 |
| later components (checklist in place) | 0.4 | 0.4 | 0.9 | 0.6 |
| infrastructure per package | 424 lines | 344 lines | 400 lines | 569 lines |

**What a production version needs**, beyond the POC:

1. **The screen reader check**, run by a person, with its findings fixed in every framework
   ([screen-readers.md](screen-readers.md)).
2. **A dev-mode smoke run in CI.** Every scenario loads in each fixture's dev server, and any
   console error or warning fails the run. This is the one class of bug the suite missed.
3. **The production scope of each component**, specified first and then tested. Examples:
   Select with multiple selection and item alignment, Tooltip with touch rules, Slider with marks
   and labels, and the date field Base UI lacks. Each addition starts as a spec change (AGENTS.md
   rule 3).
4. **Framework forms integration**: a `ControlValueAccessor` for Angular. The other four use
   their native bindings plus hidden inputs.
5. **Packaging and documentation.**
   - published `@fragiola/*` packages per framework;
   - the docs site export of the Fragiola guidelines;
   - SSR and hydration checks (out of scope here);
   - a versioning policy across five packages.
6. **The same referee kept as the rule.** A port is done only when it passes the shared suite and
   React's goldens, with no test weakened for it. Headless UI's second framework fell behind
   without one ([checkpoint.md](checkpoint.md#what-headless-ui-teaches)).
7. **The boundary kept as a rule.** No shared component core. What can be framework-free and
   stateless moves into the DOM toolkit, and every move is recorded. In this POC that rule held
   for ten components, and it is what kept the ports independent.

The maintainer decides:

1. whether Fragiola builds its own primitives;
2. which second framework comes first;
3. whether the screen reader check runs before that.
