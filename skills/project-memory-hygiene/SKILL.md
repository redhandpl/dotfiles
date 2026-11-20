---
name: project-memory-hygiene
description: Reuse durable project knowledge across sessions, verify it against current evidence, and capture high-signal lessons. Includes OMP's local and Mnemopi memory workflows; use when prior decisions, constraints, conventions, or costly-to-rediscover gotchas materially affect a task.
---

# Project Memory Hygiene

Use this skill when durable project knowledge may materially affect discovery, design, planning, implementation, or review.

Use only the memory capabilities currently exposed by the runtime. Select the matching backend workflow below; on other runtimes, use their native memory operations and scopes. If memory is unavailable, proceed from current repository evidence and user instructions without inventing a replacement store.

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

## Backend selection
- Identify the active backend from its explicit runtime declaration or native memory guidance before any memory read or write. Tool names alone do not identify the backend; do not probe storage URIs to discover it.
- For `memory.backend=local`, follow **OMP local backend**. For `memory.backend=mnemopi`, follow **OMP Mnemopi backend**.
- `memory://root` and all `memory://root/...` artifacts exist only with `local`. Never read them with Mnemopi or an unknown backend, including as a fallback after a failed search.
- If the backend is unknown or different, use only explicitly supported native memory operations. If none are available, continue from repository evidence without backend-specific reads.

## Memory scope selection
- OMP `local` memory is project-scoped.
- On other runtimes, use the narrowest supported scope: repo-local facts stay project-local; cross-project preferences belong in a global scope only when explicitly supported.
- Do not change runtime settings or shared instructions to enable or emulate memory as part of an ordinary task.

## OMP local backend

Apply this section only when the runtime identifies `memory.backend` as `local`. See the [OMP memory contract](https://github.com/can1357/oh-my-pi/blob/main/docs/memory.md).

### Read relevant context
- Follow OMP's native `Memory Guidance` read instructions, starting with the project summary before inspecting deeper artifacts. Do not scan the full memory store by default.
- `memory://root` or `memory://root/memory_summary.md`: compact project summary.
- `memory://root/MEMORY.md`: consolidated long-term knowledge.
- `memory://root/learned.md`: explicitly captured lessons; check relevant existing lessons before adding one.
- `memory://root/skills/<name>/SKILL.md`: generated playbook; read only when relevant to the task.
- A new project may have no artifacts yet. Continue from repository evidence without creating them manually.
- When memory changes a decision or plan, cite the memory artifact and the current repository evidence that validates it.

### Capture a durable lesson
- OMP already extracts and consolidates knowledge from eligible persisted sessions in the background. Do not duplicate this with a manual end-of-task summary. Automatic extraction is skipped for ephemeral sessions and subagents; it is not proof that a particular fact was saved.
- Use `learn` only when the tool is available and a verified lesson passes the decision test below. With `local`, this requires `autolearn.enabled`; selecting `local` alone does not expose `learn`.
- Keep the lesson self-contained: what applies, under which conditions, and why. Include concise source context when useful; do not create a managed skill as a side effect of routine lesson capture.
- Skip an existing equivalent lesson. For a stale lesson, capture an explicit correction with verified evidence; do not claim the old entry was edited or removed.
- If `learn` is unavailable or fails, continue the task without claiming a save. Do not edit memory artifacts or enable tools as a workaround.
- Treat the memory root as runtime-managed: do not hand-edit `MEMORY.md`, `memory_summary.md`, `learned.md`, or generated playbooks.
- A successful `learn` call stores the lesson for later sessions; it does not refresh the active session's injected lessons or guarantee immediate consolidation.
- Do not use `recall`, `retain`, `reflect`, or `memory_edit` with `local`; those operations belong to other backends.

## OMP Mnemopi backend

Apply this section only when the runtime identifies `memory.backend` as `mnemopi`.

- Use `recall` to search for specific facts or entries; use `reflect` to synthesize an answer across relevant memories. Read their tool schemas before calling them.
- For a full entry, use `read memory://<memory-id>` with an actual ID returned by `recall`. Do not invent IDs or substitute a `memory://root/...` path.
- If the required operation is unavailable or fails, continue from current repository evidence and report a material limitation. Do not fall back to local memory artifacts or change the backend.

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
2. If yes and persistent memory capability is available, identify the backend and read relevant memory through its matching workflow before major decisions.
3. Verify recalled memory against current repository state and current user instructions.
4. Complete the task using current evidence plus validated durable context.
5. Before handoff, capture a new durable lesson or correction only when it passes the decision test and a supported write operation is available. For OMP `local`, follow the `learn` workflow above.

## Decision test before writing
Write or update memory only if the fact is:
- durable,
- high-signal,
- reusable in future sessions,
- costly to rediscover,
- safe to persist,
- and clearly belongs to a supported memory scope.

## Anti-patterns
- Treating stale memory as source of truth.
- Storing session notes in durable project memory.
- Duplicating the same fact in multiple entries.
- Persisting sensitive data.
- Writing memory when no durable learning occurred.
- Assuming memory scopes or tools that the active runtime does not expose.

## Output
Mention memory only when it materially affected the result, a lesson was successfully captured, or a relevant read/write limitation remains. Do not add a fixed memory report to every response or claim persistence without a successful write result.
