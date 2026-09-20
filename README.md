# React Standards

A working React application that demonstrates how I expect a front end to be
built, and how it must supply what a regression suite needs. Every standard
below is enforced by the build, a lint rule, or a test. Nothing here is advice;
a violation fails.

The sibling projects `cypress-standards`, `playwright-standards`, and
`playwright-standards-csharp` all bind to `data-testid` attributes that
application code has to supply. None of them shows where those attributes come
from. `blazor-standards` answers that for .NET; this one answers it for React.

**Platform.** These conventions assume Windows and PowerShell, which is where
the projects using them run. Nothing here is shell-specific, so a Linux or macOS
clone runs the same commands.

## Running it

```powershell
npm install
npm run dev
```

Three pages: tasks at `/`, signup at `/signup`, inventory at `/inventory`.

Everything CI runs:

```powershell
npm run verify      # lint, format, types, unit and component tests, build
npm run test:run    # the regression suite against the built bundle
npm run mutation    # the mutation gate
```

## The standards

**1. Test ids are a contract, and the attribute name lives once.** Every element
a suite reaches carries `data-testid` from `src/shared/testIds.ts`. The ids match
the sibling suites exactly, because a renamed id here breaks a suite in another
repository. That is the point: the id is a promise the application makes, not a
detail a suite invents.

The name reaches the markup through `testId()`, spread into the element:

```tsx
<h1 {...testId(TaskTestId.Heading)}>
```

_Enforced by_ a convention test that scans every `.tsx` file and fails if any of
them writes the attribute name itself. Both halves are needed, and the first
version of this repository had neither: components wrote `data-testid=` by hand
while `TEST_ID_ATTRIBUTE` sat exported and unread, so the single definition was
a claim the code did not keep. A constant nothing reads is a comment wearing a
constant's clothes. This is the React equivalent of the `TestId.For()` helper
`blazor-standards` splats through `@attributes`.

**2. The suite mirrors the contract rather than importing it.**
`cypress/support/constants/testIds.ts` is a second copy of the same list, on
purpose. This suite stands in for the external consumers that drive these pages,
and a consumer that imports the producer's constants cannot notice when the
producer renames one: the rename would follow silently and the contract would
break for everyone else while this repository stayed green. Two files that must
agree is the mechanism. When they disagree, the suite says so.

**3. Selector hierarchy, identical to the siblings.** `data-testid` through
`cy.getByTestId` for markup we own, then ARIA role and accessible name, then a
stable structural selector for pages nobody controls. Never text content,
styling classes, `nth-child`, or DOM position.
`cypress/support/test_cases/selectors/` demonstrates all three tiers, and tier
three reaches `example.com` because demonstrating it honestly requires a page
outside this repository. _Enforced by_ `no-restricted-syntax`, which rejects a
string literal passed to `getByTestId`, `findByTestId`, or `visit`.

**4. No magic strings or numbers, JSX included.** A literal carrying meaning
lives in a constants file. Copy, routes, query keys, ARIA values, element ids,
and thresholds all have names. _Enforced by_ `eslint-rules/no-magic-literals.js`,
a local rule copied unchanged from the AgentDispatch UI so three React codebases
enforce one rule with one set of exemptions.

The rule stops at `src/`. A suite's discipline is a different one, covered by
standard 3; pointing this rule at `cypress/` demands names for Cypress command
strings and for the brackets inside an attribute selector, which makes the
selector harder to read and names nothing a reader was looking for.

**5. Copy lives in constants, not in JSX.** `TaskCopy.EmptyState`, not text
typed into a component. Copy written inline cannot be found by someone looking
for it, drifts when its twin changes, and gives a test nothing to assert but a
literal it repeats. The counter and summary formats are builder functions in
`constants.ts` because the sibling suites assert on their exact output, which
makes the wording a contract rather than presentation.

**6. Feature boundaries the linter enforces.** `src/features/<feature>` owns its
components, hooks, and data access. `src/shared/` holds cross-feature code. A
feature never imports another feature. _Enforced by_ `no-restricted-imports`,
generated per feature in `eslint.config.js`. Written only in a README, this
survives until the first deadline.

**7. Types over primitives, and unions over boolean pairs.** A plan is not a
string and a sort direction is not a boolean. The signup screen's state is a
discriminated union, so "submitted with errors" cannot be represented at all,
and the compiler proves every state is handled. `strict` is on along with
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`: the first makes an
array index yield `T | undefined`, the second stops an explicit `undefined` from
passing as an absent property.

**8. Rules live outside components.** `taskRules.ts`, `signupValidator.ts`, and
`inventoryQuery.ts` hold every decision the screens appear to make. A rule
written inside a component can only be reached by rendering, and a mutant that
survives there says a screen was not asserted rather than that a rule was not
tested. The components keep markup and event wiring.

**9. Data access through TanStack Query, with keys as constants.** The inventory
page reads through a hook calling a typed client; no component fetches. The key
comes from `QueryKey` because TanStack matches keys structurally, so two hooks
writing the same key inline look identical and invalidate independently, and one
screen then keeps showing what the data no longer says. Tasks and signup use
`useReducer` and `useState`, because local state is not a cache and pretending
otherwise adds a layer that explains nothing.

**10. Runtime configuration, not build-time.** `public/config.json` is fetched
and validated before the first render, so one bundle promotes across
environments unchanged and no component ever sees a half-configured application.
Vite's `import.meta.env` is the tempting alternative and is what this rejects:
`VITE_` values are substituted at build time, so each environment needs its own
build and the artifact tested in staging is not the artifact promoted. The file
is a host-supplied boundary, so it is shape-checked rather than cast.

**11. Accessibility is asserted, not assumed.** WCAG 2.2 AA, checked by axe on
every page and once in a state a load-time scan never reaches: the signup form
showing its errors. Landmarks, a skip link, labelled controls, `aria-invalid`
only while invalid, errors tied to inputs by `aria-describedby`, `aria-pressed`
on the filters, `aria-current` on the active nav link, and completion conveyed
by more than color.

**12. Coverage is not the bar; mutation is.** Stryker mutates the rules modules
and the run fails below 70%. Coverage says a line ran. Mutation says a test
would have noticed if that line were wrong. Constants, types, and the entry
point are excluded, because mutating a value that exists to be named proves
nothing. Measured: **100% across 151 mutants, in 2 minutes 51 seconds.**

`useInventory.ts` is excluded too, and for a reason worth stating rather than
leaving as a line in a config file that cannot hold comments. A hook needs a
renderer to exercise, which means a DOM, which is exactly what the narrowed
runner below does not have. That is the same principle already excluding every
`.tsx` file: mutation covers the rules, and the components that carry them are
covered by render tests and the regression suite. An exclusion that raises a
score without changing what is verified would be worth objecting to; this one
moves a module to the layer that can actually test it.

Two modules reached 100% only after the gate said otherwise, and both are worth
recording. `testId.ts` sat at **zero**, with Stryker naming the mutant it could
not kill: `return { [TEST_ID_ATTRIBUTE]: id }` becoming `return {}`, which
strips every test id from the application while every suite in every sibling
repository goes red and this gate stays silent. The helper carrying standard 1
was unverified by the gate meant to prove tests notice, because it was exercised
only through `.test.tsx` files the runner does not include. And the `catch` that
normalizes unparsable JSON had never executed: every case in its file resolved
`json()`, so the error path shipped untested. Both now have tests of their own.

That time is the standard's other half. The first run took 17 minutes to reach
22% and projected to about 75, because Stryker re-runs the suite once per
mutant and the default configuration paid a jsdom setup for component tests
covering none of the mutated code. `vitest.mutation.config.ts` narrows the
runner to the logic tests in a node environment, which is a fix rather than a
tolerance: a gate slow enough to be ignored protects nothing, and raising its
timeout would only have made the waiting official. It still runs nightly in
`mutation.yml` rather than on a pull request, because that margin is worth
keeping even now that it is fast.

**13. Security at the boundaries.** The Content Security Policy is a response
header in `public/_headers`, not a meta tag. No `dangerouslySetInnerHTML`
anywhere. No secrets in the bundle, because the bundle is public by definition
and the runtime configuration file carries only values a browser may see. CI
scans dependencies and history.

**14. Lint findings fail the build, and comments explain why.** Prettier owns
formatting and nobody discusses it in review. Every comment in this repository
says why something is the way it is; what the code does is the code's job.

## Divergences, and why

**Routes drop the extension.** The sibling static sites serve `/signup.html`
because they ship files. This one routes in the browser, so it uses `/signup`.
Each suite keeps its own routes constant for exactly this reason.

**`aria-sort` sits on the header cell, not the sort button, and only on the
sorted one.** ARIA's authoring guidance sets the attribute on the currently
sorted column, then removes it and applies it to the new column as the sort
moves. An earlier version of this repository emitted `aria-sort="none"` on the
inactive headers and asserted that in two suites and in this file, which put all
three columns in a state the guidance does not describe. It was the same mistake
this section criticizes the siblings for, made one line further along. The
attribute is now omitted from unsorted columns, and `AriaValue` carries no
`None` member so nothing can drift back to it.

ARIA permits the
attribute on an element with the `columnheader` role and forbids it on a
`button`. The sibling demo applications carry it on the button and their suites
assert that defect into place; neither runs an accessibility check, which is how
it survived. `blazor-standards` reached the same conclusion independently. The
button ids are untouched and the header cells gained three of their own, so the
shared contract gains entries and renames none. A test asserts the attribute is
on the header **and** absent from the button, because a divergence nobody
asserts is drift waiting to be corrected back.

**The CSP is not exercised by the suite.** `script-src 'self'` without
`'unsafe-eval'` blocks cypress-axe, which injects axe-core by evaluating it as a
string. `vite preview` does not apply `_headers`, so the suite runs
uninstrumented and the policy is enforced at deploy time instead. Adding
`'unsafe-eval'` would let the suite cover it at the price of weakening the
shipped artifact to suit the instrument measuring it. A team wanting coverage
here adds a deploy-time header assertion.

**Component behavior is verified twice, deliberately.** React Testing Library
covers rendering and wiring; Cypress drives the assembled bundle. The unit layer
is fast and precise about a component; the regression layer is the only thing
that proves the built artifact works, minification and all.

## Layout

```
eslint-rules/                the literal rule, copied from the AgentDispatch UI
public/_headers              response headers, including the CSP
public/config.json           runtime configuration, swapped per environment
src/config/                  reading and validating that file before render
src/shared/                  constants, test ids, types, layout, context
src/features/<feature>/      components, rules, hooks, and feature constants
src/test/                    the provider stack every component test renders through
cypress/support/constants/   the suite's mirror of the contract
cypress/support/repositories element retrieval only
cypress/support/actions/     interactions, no assertions
cypress/support/test_cases/  assertions, no selectors
```

## Verification

| Gate                   | What it covers                                             |
| ---------------------- | ---------------------------------------------------------- |
| `npm run lint`         | the literal rule, feature boundaries, suite selector rules |
| `npm run format:check` | Prettier                                                   |
| `npm run typecheck`    | both TypeScript projects, application and suite            |
| `npm run test`         | 108 unit and component tests                               |
| `npm run test:run`     | 42 regression tests, including 4 axe checks                |
| `npm run mutation`     | 151 mutants, 100% killed, failing below 70%                |
| `npm audit --omit=dev` | advisories in shipped dependencies                         |

Every number above is measured rather than aspirational. `npm run mutation`
runs nightly in CI; the other gates run on every pull request.

## Adopting this

Take the test-id contract, the constants discipline, the feature-boundary lint
rules, and the separation of rules from components. Replace the three pages with
your own and `src/shared/testIds.ts` with your own ids.

The piece worth keeping intact is the mirrored id file plus the lint rules around
it. A team that writes `data-testid` by hand loses the single definition within a
sprint, and nothing tells them until a suite in another repository goes red.
