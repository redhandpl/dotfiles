---
name: discovery-scope
description: Phase 1 skill for Nexus. Guides acceptance criteria design, blocking question triage, scope boundary definition, and assumption capture. Use together with the agent's Discovery & Scope phase.
---

# Discovery & Scope

Use this skill when a request is ambiguous, missing acceptance criteria, or has unclear edge cases.
Complements the agent's phase trigger logic with operational depth for scope clarification.

## Question triage

Separate blocking from non-blocking before asking anything:
- **Blocking** — the answer changes what gets built, how it is validated, or whether implementation can start at all.
- **Non-blocking** — the answer refines an approach but does not change the deliverable. Capture as an explicit assumption and move on.

Ask the minimum blocking questions first. Batch when possible. Do not interleave non-blocking questions with blocking ones.

## Scope boundary template

Define these explicitly before proceeding to architecture or implementation:

- **In-scope** — what will be delivered in this task.
- **Out-of-scope** — what is intentionally excluded. Name it; do not leave it implicit.
- **Explicitly deferred** — what could be in scope but is postponed to a later phase or task, with rationale.

## Acceptance criteria format

Each criterion must be:
- **Testable** — there is a concrete way to verify it (automated test, manual check, validator output).
- **Observable** — the result is visible in code, config, output, or behavior.
- **Independent** — verifiable without relying on another unfinished criterion.

Format: `Given <precondition>, when <action>, then <expected result>`.

## Edge case checklist

Evaluate these dimensions for relevant edge cases:
- Security boundaries — auth bypass, permission escalation, input injection, trust boundary crossing.
- Error paths — invalid input, missing dependencies, partial failure, timeout, retry behavior.
- Concurrency — race conditions, duplicate execution, state conflicts.
- Data boundaries — empty sets, maximum sizes, encoding, null/undefined handling.
- Environment — missing env vars, wrong credentials, network failures.

## Dependency identification

Capture external dependencies that affect implementation:
- Services or APIs the change depends on.
- Data contracts or schemas.
- Environment prerequisites (tools, runtimes, credentials).
- Other in-flight changes that could conflict.

## Anti-patterns

- Scope creep via implicit assumption — if it was not in the original request, flag it explicitly before including it.
- Untestable acceptance criteria — "the system should be robust" is not testable.
- Conflating requirement with solution — describe what, not how.
- Asking too many questions — batch, prioritize, and stop when blocking questions are answered.

## Output

Requirements Summary, Scope Boundaries (In/Out/Deferred), Acceptance Criteria, Assumptions, Edge Cases, Dependencies, Blocking Questions, Non-blocking Unknowns, Next Phase.
