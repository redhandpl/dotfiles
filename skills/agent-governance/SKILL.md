---
name: agent-governance
description: Repository-specific validation and parity rules for agent definitions, instructions, skills, and OpenCode settings.
---

# Agent Governance

Use this skill when creating, updating, or reviewing agent customization artifacts in this repository.
Pair it with `repo-conventions` for repository-local pattern checks.

## Use when
- Editing `github/agents/*.agent.md`.
- Editing `opencode/agent/*.md`.
- Editing `github/instructions/*.instructions.md`.
- Editing `skills/**/SKILL.md`.
- Editing `opencode/opencode.json`.
- Editing repository docs that define agent routing, ownership, exceptions, or platform status.

## Goals
- Keep artifact schema and frontmatter internally consistent.
- Keep role ownership, routing, and explicit exceptions coherent with repository contract.
- Keep GitHub and OpenCode variants aligned unless a deliberate divergence is documented.
- Distinguish between guardrails that are enforced by platform permissions and guardrails that are descriptive only.
- Make user-facing exception semantics and developmental status explicit where needed.

## Artifact checks

### GitHub agent artifacts
Validate:
- `name`, `model`, `description`, and `tools` fields are present and coherent.
- `agents` is present only when delegation is intentional.
- `user-invocable` and `disable-model-invocation` match the intended operating model.
- Prompt body matches declared routing and tool posture.

### OpenCode agent artifacts
Validate:
- `model`, `description`, `mode`, and `permission` are present and coherent.
- `permission.skill` includes every newly referenced skill.
- Denied surfaces stay denied unless an explicit change was intended and approved.
- Prompt body does not claim capabilities that permissions do not support.

### Instruction and skill artifacts
Validate:
- Frontmatter fields required by the platform are present.
- Skill or instruction purpose matches where it is referenced.
- Cross-cutting rules live in shared skills/contracts rather than drifting into multiple role files.

## Routing and exception checks
- Default Void Protocol ownership still points App to `@Forger` and DevOps to `@d43mon` unless an explicit exception is documented.
- Official exceptions, such as `@Nexus`, are documented in repository contract and user-facing docs.
- Standalone exceptions state that they are opt-in, user-selected, and non-delegating.
- `Mixed` work under a standalone exception still defines the app/devops interface explicitly.

## Cross-platform parity
- Update both supported variants when role intent or boundaries change.
- Document deliberate platform differences instead of allowing silent drift.
- If GitHub Copilot is developmental or weaker in enforcement, say so explicitly and treat OpenCode as authoritative where applicable.
- Re-check output contract, approval gates, protected surfaces, and exception language after any role update.

## Validation workflow
1. Identify the changed artifact type and its counterpart, if one exists.
2. Verify required metadata field by field.
3. Check tool, permission, and skill allowlist consistency.
4. Check routing, ownership, and exception language against repository contract.
5. Run the strongest available validators for the touched artifact.
6. Report any descriptive-only guardrail that lacks enforcement or explicit status labeling.

## Validation evidence
- Run `jq -e . opencode/opencode.json` when touching OpenCode JSON settings.
- Run `git diff --check` for whitespace and merge-marker sanity.
- Use repository search to confirm counterpart files, skill references, routing statements, and exception notes.
- When no machine validator exists for Markdown frontmatter, perform explicit manual field-by-field verification and report that it was manual.

## Anti-patterns
- Updating one platform variant while silently changing the role semantics.
- Introducing a standalone exception without documenting it in contract and user-facing docs.
- Claiming parity when one platform only mirrors prompt text and lacks matching enforcement.
- Adding a new skill reference without updating the OpenCode allowlist.
- Expanding delegation metadata on a standalone agent.

## Output
Artifact Scope, Counterparts, Schema Checks, Permission/Tooling Checks, Routing & Exception Checks, Cross-platform Parity, Validation Evidence, Residual Gaps, Next Phase.
