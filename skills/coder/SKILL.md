---
name: coder
description: Phase 4 skill for Nexus. Guides security impact pre-assessment, scope drift rejection, interface contracts for Mixed tasks, and minimal change discipline. Use together with repo-conventions.
---

# Coder

Use this skill when implementing application code changes.
Complements `repo-conventions` with security assessment, scope control, and mixed-task contracts.

## Pre-implementation checks

Before writing any code, assess:
- **Security impact** — does this change affect auth, input validation, permissions, secrets, or trust boundaries? If yes, document the impact and flag it.
- **Attack surface** — does this change expand the attack surface? New endpoints, new input paths, new data exposure, new privilege grants.
- **Dependency check** — does this require new dependencies? If yes, stop and request approval.
- **Pattern check** — does an existing helper, utility, or pattern already solve this? Reuse first.

## Scope lock protocol

- Implement only the requested behavior. Nothing more.
- If the implementation reveals an opportunity for improvement outside the request, note it in the output but do not implement it.
- If the request implicitly requires a design change, stop and surface it rather than making the design change silently.
- Reject scope drift explicitly — state what was excluded and why.

## Convention reuse

- Discover helpers, patterns, abstractions, and vocabulary already in the codebase.
- Use the terminology the repo uses. Do not introduce new abstractions the codebase hasn't earned.
- Prefer extending existing files over creating new ones.
- Prefer modifying existing patterns over introducing parallel approaches.

## Mixed task contracts

For `Mixed` domain tasks, before writing app code:
- Define the app/devops interface — what the app code expects from infrastructure.
- Document dependency handoff points — what the DevOps phase needs to wire.
- State wiring assumptions — environment variables, secrets, service endpoints, config paths.
- Flag anything that cannot be validated without the DevOps side being in place.

## Minimal change discipline

- Smallest cohesive change that satisfies the acceptance criteria.
- Prefer fewer files touched over cleaner abstractions.
- If a refactor would help, scope it as a separate follow-up, not an inline addition.
- Do not introduce new layers unless the acceptance criteria require them.

## Refactoring discipline

Distinguish necessary structural changes from scope creep:

**Required refactoring** (part of the change):
- Updating imports, exports, or type signatures that break due to the requested change.
- Renaming references when the requested change renames a public symbol.
- Adjusting call sites when the requested change modifies a function signature.
- Fixing tests that fail solely because the production code changed as requested.

**Scope creep** (flag as follow-up, do not implement):
- "While I'm here" cleanups unrelated to the requested behavior.
- Extracting abstractions for code that works correctly and is not being changed.
- Reformatting or restyling files beyond the touched lines.
- Adding features adjacent to the requested change.

Rule of thumb: if removing the refactoring would break the requested change, it is required.
If the requested change works without the refactoring, it is scope creep.

## Stop conditions

Stop and surface the blocker when:
- Request is ambiguous after scope lock attempt.
- Change is medium/high risk and no approval was given.
- Protected surface is about to be touched.
- Scope expansion is needed to satisfy the criteria.
- Security impact is non-trivial and was not addressed in the architecture phase.

## Anti-patterns

- Implementing beyond requested scope — "while I'm here" changes.
- Silently adding dependencies.
- Ignoring existing helpers or patterns.
- Expanding attack surface without explicit flagging.
- Making implicit design decisions during implementation.
- Not reporting interface assumptions for Mixed tasks.

## Output

Security Assessment, Conventions Used, Scope Boundaries, Changes, Mixed Handoff Contract (if applicable), Validation, Stop Conditions Hit (if any), Next Phase.
