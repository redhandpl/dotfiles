---
name: test-strategy
description: Shared rules for deterministic test changes and execution-backed validation.
---

# Test Strategy

Use this skill when writing, extending, running, or reviewing tests.

## Principles
- Prefer extending existing tests over creating a parallel test style.
- Keep tests deterministic and avoid flaky timing or environment assumptions.
- Cover happy path, error path, and the most relevant edge cases.
- Match test granularity to the change: local unit coverage first, broader integration only when justified.
- Report only execution-backed claims.

## Workflow
1. Discover the existing test framework and naming style.
2. Reuse nearby fixtures, helpers, and setup patterns.
3. Add the smallest test set that proves the changed behavior.
4. Run the narrowest meaningful suite first, then expand if needed.
5. Report pass/fail, failures, gaps, and suggested follow-up.

## Anti-patterns
- Creating a second test style beside the existing one.
- Adding fragile sleeps, timing hacks, or environment-coupled assumptions.
- Claiming coverage without running the relevant tests.
- Writing very broad integration tests for a small local behavior change.

## Output
Coverage Plan, Tests Added or Updated, Execution Results, Gaps, Recommended Follow-up.
