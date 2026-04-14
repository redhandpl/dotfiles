---
name: planner
description: Phase 3 skill for Nexus. Guides phase sequencing, validation gates, rollback path design, escalation points, dependency mapping, and task decomposition. Use together with delivery-gates.
---

# Planner

Use this skill when scope and design are settled and the task needs phased rollout
or multi-step execution. Complements `delivery-gates` with sequencing and rollback depth.

## Phase design

Each phase must include:
- **Preconditions** — what must be true before this phase can start.
- **Changes** — what gets modified in this phase.
- **Validation gate** — how to verify the phase succeeded before moving to the next.
- **Escalation trigger** — conditions where this phase must stop and ask for a decision.

## Sequencing rationale

Default ordering principles:
1. Infrastructure before application (schema before code, config before runtime).
2. Non-destructive before destructive (additive changes first, removals last).
3. Independently testable phases before dependent ones.
4. Security-sensitive changes isolated in their own phase when possible.

State explicitly why phases are ordered the way they are. If phases can run in parallel, mark them as parallel-safe and state why.

## Rollback path design

For medium/high criticality changes, each phase needs:
- **Revert method** — exact steps to undo the phase.
- **Revert verification** — how to confirm the rollback succeeded.
- **Blast radius of revert** — what else is affected if this phase is rolled back.
- **Time-to-rollback** — rough estimate of effort needed.

For low criticality, a single-line rollback note is sufficient.

## Escalation points

Define conditions where planned execution must stop:
- Unexpected test failures.
- Discovered dependencies not in the original plan.
- Scope expansion detected during implementation.
- Protected surface contact not anticipated in planning.
- Approval needed for a step that was assumed fast-path.

## Dependency mapping

Capture:
- **Cross-phase dependencies** — phase B cannot start until phase A's validation gate passes.
- **External dependencies** — services, APIs, or resources needed.
- **Parallel-safe phases** — phases with no mutual dependency that can execute concurrently.
- **Blocking order** — the minimum ordered chain that must execute sequentially.

## Task decomposition

When phases need further breakdown:
- Group work into milestones with explicit done-when criteria.
- Produce ordered tasks within each milestone.
- Mark decision points — steps where a choice must be made before continuing.
- Separate quick wins (low risk, high value, independent) from the critical path.

Do not decompose if the phase is already a single atomic change.

## Anti-patterns

- Revisiting settled architecture during planning — the planner executes the design, does not redesign.
- Single monolithic phase — if a phase has more than 3 distinct change types, consider splitting.
- Missing validation gates — every phase needs a way to verify success.
- Rollback as afterthought — design the rollback path alongside the forward path, not after.
- Over-decomposition — do not break down trivially small changes into task cards.

## Output

Preconditions, Phases, Sequencing Rationale, Validation Gates, Rollback Paths, Escalation Points, Dependencies, Task Decomposition (if applicable), Quick Wins, Risks, Next Phase.
