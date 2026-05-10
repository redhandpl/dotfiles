---
name: tester
description: Phase 6 skill for Nexus. Guides coverage matrix design, security negative test cases, evidence quality standards, and gap analysis. Use together with test-strategy.
---

# Tester

Use this skill for changes that need execution-backed validation before handoff, especially when `Change Criticality` is `Medium` or `High`, protected surfaces are touched, or security-sensitive behavior changed.
Complements `test-strategy` with coverage matrix design, security testing, and evidence standards.

## Coverage matrix design

Before writing tests, design the coverage matrix:

| Dimension | What to test |
|---|---|
| Happy path | Expected inputs produce expected outputs |
| Error paths | Invalid inputs, missing dependencies, partial failures |
| Edge cases | Boundary values, empty sets, maximum sizes, null/undefined |
| Security misuse | Unauthorized access, injection, privilege escalation, input abuse |

Document the matrix before implementing. Not every dimension applies to every change — skip with explicit rationale.

## Security negative cases

Required when the change touches:
- **Auth** — test that unauthenticated and unauthorized requests are rejected.
- **Permissions** — test that privilege escalation is blocked.
- **Input validation** — test that malformed, oversized, and injection-laden inputs are rejected.
- **Secrets** — test that secrets are not leaked in logs, responses, or error messages.
- **Trust boundaries** — test that cross-boundary requests are validated.

Format: "Given <actor without privilege>, when <action requiring privilege>, then <rejection with correct error>."

## Evidence quality standards

- **Only execution-backed claims** — never report coverage based on code reading alone.
- **Actual pass/fail** — report the real test run output, not expected results.
- **Failure diagnostics** — for failures, include the error, the expected vs. actual, and the root cause assessment.
- **Environment** — note the test execution environment and any relevant configuration.

## Determinism requirements

- No flaky tests — tests must produce the same result on every run.
- No timing dependencies — avoid sleeps, timeouts, or race-condition-sensitive assertions.
- No environment coupling — tests must not depend on external services, specific file system state, or network availability unless explicitly integration-scoped.
- Controlled randomness — if randomness is needed, seed it deterministically.

## Convention discovery

Before writing tests:
1. Find the existing test framework and runner.
2. Identify naming conventions (file names, test names, describe/it structure).
3. Locate existing fixtures, helpers, and setup patterns.
4. Reuse nearby test patterns — extend, do not reinvent.

## Non-runtime artifact validation

When the change targets agent definitions, instruction files, skills, or OpenCode settings:
- Pair this skill with `agent-governance`.
- Prefer schema, permission, routing, and cross-platform parity checks over synthetic runtime tests.
- Still report only validators and manual checks that were actually executed.

## Technology discovery checklist

Before writing tests, inspect these files to identify the test stack:

| File / Pattern | What it reveals |
|---|---|
| `package.json` (`scripts.test`, `devDependencies`) | JS/TS test runner (jest, vitest, mocha, playwright) |
| `tsconfig.json` / `jsconfig.json` | TypeScript config affecting test compilation |
| `pytest.ini` / `pyproject.toml` / `setup.cfg` | Python test runner and config |
| `Makefile` / `Taskfile.yml` / `justfile` | Project-level test targets and commands |
| `.github/workflows/*.yml` | CI test commands — what actually runs in pipeline |
| `**/test*/**` / `**/__tests__/**` / `**/*_test.*` | Existing test file layout and naming |
| Nearest test file to changed code | Local conventions for imports, fixtures, setup |

Start from the nearest existing test to the changed code and work outward.

## Gap analysis

After test execution:
- Identify what remains untested and why.
- Assess risk of uncovered paths — is the gap acceptable or does it need follow-up?
- Recommend specific follow-up tests if gaps are medium/high risk.
- Distinguish between "intentionally skipped" and "missed" coverage.

## Anti-patterns

- Claiming coverage without execution — if you didn't run it, you don't know if it passes.
- Flaky sleeps or timing hacks — use proper async handling or deterministic mocks.
- Broad integration tests for local changes — match test scope to change scope.
- Parallel test style alongside existing one — extend the existing pattern.
- Over-testing trivial paths at the expense of security-critical ones.

## Output

Coverage Matrix, Tests Implemented, Execution Evidence, Security Test Focus, Determinism Check, Gaps, Recommended Follow-up, Next Phase.
