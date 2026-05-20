# opencode-agent-memory Reference

This reference describes how to apply `project-memory-hygiene` when the active persistent memory backend is [`opencode-agent-memory`](https://github.com/joshuadavidthomas/opencode-agent-memory).

Use this file as backend-specific operational guidance. The policy still lives in `../SKILL.md`.

## Scope

`opencode-agent-memory` provides Letta-style editable memory blocks for OpenCode.
It adds dedicated memory tools and injects memory blocks into prompt context.

Current documented memory tools:
- `memory_list` — list available memory blocks with labels, descriptions, and sizes
- `memory_set` — create or fully overwrite a memory block
- `memory_replace` — replace a substring within an existing memory block

Optional journal tools may also exist when the journal feature is enabled:
- `journal_write`
- `journal_search`
- `journal_read`

## Memory model

Documented default blocks:
- `persona` — global behavior guidance
- `human` — global user preferences and habits
- `project` — project-specific knowledge

Recommended block selection:
- `persona` — stable assistant operating defaults that should apply across projects
- `human` — stable user preferences or constraints that should apply across projects
- `project` — repository-specific conventions, architecture facts, workflow rules, and durable repo-local preferences

Documented storage locations:
- global blocks: `~/.config/opencode/memory/*.md`
- project blocks: `.opencode/memory/*.md`

Treat these as implementation detail references, not policy overrides.

## Operating guidance

### Read before major decisions

When durable project context may materially affect the task:
1. Call `memory_list` first.
2. Look for an existing project-relevant block before creating a new one.
3. Prefer reading the smallest relevant set of blocks needed for the task.
4. Verify recalled memory against the current repository state and current user instructions.

If memory and the repo disagree, trust the repo and current user instructions.

### Write only durable facts

Use `memory_set` or `memory_replace` only when a durable, high-signal fact was established.

Prefer:
- updating an existing `project` block,
- updating an existing topic-specific block,
- using `memory_replace` for small corrections,
- using `memory_set` when a full rewrite is clearer and lower risk than many local edits.

Avoid creating a new block unless an existing block would become confusing or overloaded.

### Suggested block usage

Use `project` for:
- repository conventions,
- architecture notes,
- workflow rules,
- durable constraints,
- stable preferences that materially affect work in this repo.

Create topic-specific blocks only when a stable category has enough weight to justify separation, for example:
- `architecture-decisions`
- `deployment-gotchas`
- `testing-conventions`

Do not create blocks for one-off tasks or temporary investigations.

### Scope examples

| Fact type | Recommended block |
|---|---|
| The user prefers short answers across repositories | `human` |
| OpenCode agents are canonical in this repository | `project` |
| The assistant should default to concise risk-first summaries across projects | `persona` |

## Safe write checklist

Before updating memory, confirm:
- the fact is durable,
- the fact is high-signal,
- the fact is safe to persist,
- the fact is not already present in equivalent form,
- the update will reduce future ambiguity rather than create drift,
- the chosen block is the narrowest correct scope.

## Journal guidance

If journal tools are enabled, treat the journal as append-only session history.

Use the journal for:
- decisions that need chronological trace,
- investigative findings,
- discoveries worth later semantic search,
- session-level insights that are useful but not stable enough for a durable memory block yet.

Do not use the journal as a substitute for durable project memory when a stable repository rule or architecture fact should instead live in a memory block.

## Anti-patterns

- Writing to memory before checking whether the fact already exists.
- Using `memory_set` when a narrow correction via `memory_replace` is safer.
- Encoding temporary debug state as durable project memory.
- Copying raw command output into memory blocks.
- Storing secrets, tokens, credentials, or private operational details.
- Writing repository-local rules into global blocks.

## Validation note

This reference is based on the current public README of `opencode-agent-memory`.
If the plugin's tool names, block model, or journal behavior change, update this file without changing the policy in `../SKILL.md` unless the policy itself needs to change.
