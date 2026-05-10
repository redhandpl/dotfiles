---
name: architect
description: Phase 2 skill for Nexus. Guides options evaluation, trade-off analysis, decision recording, Mermaid diagram conventions, and non-goals framing. Use together with the agent's Architecture phase.
---

# Architect

Use this skill when the task involves major technical decisions, integration patterns,
or open boundary questions. Complements `documentalist` for ADR creation.

## Options evaluation format

Present 2–3 viable options. For each option:
- **Description** — what the approach does and how it fits existing patterns.
- **Trade-offs** — pros and cons relative to the current system.
- **Risk** — what could go wrong, operational impact, reversibility.
- **Cost** — implementation effort, maintenance burden, migration complexity.
- **Compatibility** — how it interacts with existing architecture and constraints.

Do not present a single option disguised as a comparison. If only one approach is viable, state why alternatives were ruled out.

## Recommendation format

After presenting options:
- Recommend one with clear rationale tied to the specific constraints of this task.
- State consequences — what changes downstream, what becomes easier, what becomes harder.
- Define the migration path from current state to recommended state.

## Diagram conventions

Use Mermaid diagrams when the design involves:
- Component relationships or dependencies.
- Data flow across system boundaries.
- Sequence of operations across services.
- State transitions.

Skip diagrams when the design is a single-file local change with no structural impact.

Preferred diagram types:
- `graph TD` or `graph LR` — component/dependency relationships.
- `sequenceDiagram` — cross-service or cross-boundary interactions.
- `flowchart` — decision logic or workflow routing.
- `stateDiagram-v2` — state machine or lifecycle transitions.

## Decision recording

For non-trivial decisions, capture ADR-lite format:
- **Context** — what prompted the decision.
- **Decision** — what was chosen and why.
- **Consequences** — what changes as a result.
- **Alternatives considered** — brief summary of rejected options.

## Boundary definition

Explicitly define:
- **System boundaries** — what is inside the changed system, what is external.
- **Interface contracts** — data formats, protocols, error contracts at boundaries.
- **Trust boundaries** — where authentication, authorization, and input validation apply.

## Non-goals

List what the design intentionally does NOT address:
- Features, optimizations, or integrations deferred by design.
- Problems that exist but are out of scope for this architecture decision.

## Anti-patterns

- Designing without constraints — architecture must respond to specific requirements, not abstract possibilities.
- Single-option "recommendation" — if you only present one option, explain why alternatives were dismissed.
- Architecture without migration path — the design must be reachable from the current state.
- Over-diagramming — diagrams that restate what prose already says without adding structural insight.

## Output

Context, Constraints, Options, Recommendation, Rationale, Diagrams, Boundary Definitions, Non-goals, Assumptions, Risks, Migration Path, Next Phase.
