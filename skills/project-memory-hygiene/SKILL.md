---
name: project-memory-hygiene
description: Shared guidance for reusing and maintaining durable project memory across sessions. Use when long-term project context, architecture history, repository conventions, workflow rules, or stable developer preferences may affect decisions.
---

# Project Memory Hygiene

Use this skill when durable project knowledge may materially affect discovery, design, planning, implementation, or review.

This skill is designed to work with persistent memory integrations such as [`opencode-agent-memory`](https://github.com/joshuadavidthomas/opencode-agent-memory).
Use the platform's current memory read or update primitives rather than hard-coding one tool name. If persistent memory capability is unavailable, skip memory reuse or update and proceed from current repository evidence and current user instructions.
When the active persistent memory backend is `opencode-agent-memory`, use the backend-specific reference in `reference/opencode-agent-memory.md` if additional operational guidance is needed.

## Use when
- The task depends on prior architecture or workflow decisions.
- The user refers to repo-specific conventions, established preferences, or previous project decisions.
- The work may establish a durable rule, constraint, or gotcha worth preserving across sessions.
- Long-term project context could materially change a major decision or recommendation.

## Do not use when
- The task is purely local, trivial, or easily resolved from current repository files.
- The information is temporary, speculative, or session-specific.
- The information is sensitive or secret-bearing.
- Persistent memory capability is unavailable in the current platform.

## Principles
- Treat persistent memory as advisory, not authoritative.
- Current repository state and current user instructions take precedence over stored memory.
- Reuse relevant durable memory before making major decisions.
- Store or update memory only when it adds durable, high-signal value for future sessions.
- Use the narrowest correct memory scope so repo-local facts stay repo-local and cross-project preferences stay global.
- Prefer updating stale or overlapping memory over creating duplicates.
- Prefer concise, structured entries over narrative session logs.
- Pair this skill with `repo-conventions` when repository changes are in scope.

## Memory scope selection
- `persona` — stable assistant operating preferences or behavior defaults that should hold across projects.
- `human` — stable user preferences, habits, or collaboration constraints that should hold across projects.
- `project` — durable repository conventions, architecture facts, workflow rules, constraints, and repo-scoped preferences.
- If a fact could fit multiple scopes, prefer the narrowest block that preserves reuse without leaking repo-local detail into global memory.

## Good candidates
- Stable architecture decisions and trade-offs.
- Repository conventions and recurring workflow rules.
- Stable developer preferences that materially affect implementation.
- Durable environment constraints and operational assumptions.
- Expensive-to-rediscover gotchas.
- Canonical component boundaries, ownership rules, or integration contracts.

## Never store
- Secrets, credentials, tokens, private keys, or other sensitive data.
- Raw logs, command output, or transient diagnostics.
- Temporary debugging notes or incident scratchpad state.
- One-off failures caused by a local environment.
- Speculation, guesses, or unresolved debate.
- Facts that are trivial to rediscover from the current repository.

## Workflow
1. Decide whether durable project context is likely to affect the task.
2. If yes and persistent memory capability is available, read relevant memory before major decisions.
3. Verify recalled memory against current repository state and current user instructions.
4. If the active backend is `opencode-agent-memory` and extra operational detail is needed, follow the backend reference in this skill directory.
5. Complete the task using current evidence plus validated durable context.
6. Before handoff, if a new durable fact or correction was established and it materially reduces future ambiguity, update the narrowest correct memory scope proactively without waiting for an explicit user request.

## Decision test before writing
Write or update memory only if the fact is:
- durable,
- high-signal,
- reusable in future sessions,
- costly to rediscover,
- safe to persist,
- and clearly belongs to a specific memory scope.

## Anti-patterns
- Treating stale memory as source of truth.
- Storing session notes in durable project memory.
- Duplicating the same fact in multiple entries.
- Persisting sensitive data.
- Writing memory when no durable learning occurred.
- Writing repo-local rules into `persona` or `human`.

## Output
Memory Used, Memory Updated, Validation of Recalled Context, Residual Gaps, Next Owner.
