---
name: agent-governance
description: Validate agent prompts, skills, instructions, and runtime settings against their loading, ownership, approval, and permission contracts.
---

# Agent Governance

Use this skill when creating, updating, or reviewing agent customization artifacts in this repository.
Pair it with `repo-conventions` for repository-local pattern checks.

## Use when

- Editing agent prompts, instructions, skills, or runtime settings.
- Reviewing how a host loads those artifacts or enforces their rules.
- Editing repository docs that define agent routing, ownership, exceptions, or platform status.

## Goals

- Keep artifact schema and frontmatter internally consistent.
- Match routing and ownership to the active profile and repository contract.
- Compare behavior across maintained profiles only when they share a contract.
- Distinguish between guardrails that are enforced by platform permissions and guardrails that are descriptive only.
- Make user-facing exception semantics and developmental status explicit where needed.

## Artifact checks

### Agent and runtime artifacts

Validate:

- Required metadata and settings match the target host's schema.
- Declared tools, permissions, and skill allowlists support the prompt. Existing denies remain in place unless a change was explicitly approved.
- The prompt's delegation, invocation, and ownership rules match the active profile and host capabilities.

### Skill artifacts

Validate:

- Every `SKILL.md` contains `name` and `description`.
- `applyTo` is not required for skill artifacts and must not be added without a loader contract.
- Optional provenance metadata (`origin`, `source`, `date_added`, `risk`) is informational unless a validator explicitly enforces it.
- Skill selection remains explicit through phase, stack, or named-skill dispatch.

### Tadzio's OMP append profile

When reviewing `omp/APPEND_SYSTEM.md` in this repository, validate:

- The profile supplements OMP's built-in guidance and preserves native tool use and skill discovery.
- Tadzio owns scope, approvals, integration, final verification, and the verdict.
- Bounded helpers receive the applicable safety rules, allowed actions, and exact approval scope. Verify that the parent remains responsible for integration and verification.
- Mixed work defines its App/DevOps contract before edits.
- Approval gates, protected surfaces, and prohibited operations remain intact. Prompt text grants no runtime permissions.

For changes to these gates, use a disposable OMP session with no production targets. Check the decision, its reason, and whether a write would be attempted:

- A `Medium` change with no approval trigger uses `Standard-path`; a protected change without approval stops, and can proceed only with concrete approval covering the permitted change.
- Inspection stays `Read-only`; publishing, workflow dispatch, or an auto-sync merge does not. A prohibited action stays blocked even with explicit approval.
- A delegated read-only task receives its exact scope and prohibitions; confirm the actual helper input when the dispatch surface is available. Record simulations separately from observed dispatch.
- With skills unavailable, the append profile still applies the mandatory preflight, approval, and verification rules. Profiles without `Standard-path` retain their existing gates.

### Instruction and skill artifacts

Validate:

- Frontmatter fields required by the platform are present.
- For `*.instructions.md`, `applyTo` is required when the platform uses instruction glob matching.
- Skill or instruction purpose matches where it is referenced.
- Cross-cutting rules live in shared skills/contracts rather than drifting into multiple role files.

## Routing and ownership checks

- Route skill selection by task scope, phase, or stack. The active profile determines ownership and whether delegation is allowed.
- Preserve explicit exceptions and check them against the active profile, including during self-review and approval handoffs.
- When profiles share a maintained contract, verify equivalent intent and document deliberate differences in host enforcement. Historical profiles do not set the contract for active skills.

## Validation workflow

1. Identify the changed artifact type and its counterpart, if one exists.
2. Verify required metadata field by field.
3. Check tool, permission, and skill allowlist consistency.
4. Check routing, ownership, and exception language against repository contract.
5. Run the strongest available validators for the touched artifact.
6. Report any descriptive-only guardrail that lacks enforcement or explicit status labeling.
7. If a change affects skill selection, approval decisions, or helper handoffs, exercise the changed path in the target runtime when available. Distinguish runtime evidence from static checks.

## Validation evidence

- Use the target host's parser or schema validator when changing runtime settings.
- Run `git diff --check` for whitespace and merge-marker sanity.
- Use repository search to confirm counterpart files, skill references, routing statements, and exception notes.
- When no machine validator exists for Markdown frontmatter, perform explicit manual field-by-field verification and report that it was manual.

## Anti-patterns

- Updating one platform variant while silently changing the role semantics.
- Introducing a standalone exception without documenting it in contract and user-facing docs.
- Claiming parity when one platform only mirrors prompt text and lacks matching enforcement.
- Adding a skill reference without checking the target host's allowlist, where applicable.
- Expanding delegation metadata on a standalone agent.

## Output

Artifact Scope, Counterparts, Schema Checks, Semantic Contract Checks, Permission/Tooling Checks, Routing & Exception Checks, Cross-platform Parity, Prompt-vs-Host Enforcement Gaps, Validation Evidence, Residual Gaps, Next Phase.
