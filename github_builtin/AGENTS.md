# GitHub Built-in Agents Guidelines

## Scope
This directory defines an instruction-first setup for VS Code GitHub Copilot built-in agents.

Goal:
- mirror `pi/SYSTEM.md` Nexus behavior for built-in agent usage,
- keep guardrails explicit in instructions,
- document enforcement gaps where behavior is prompt-level only.

## Structure
- `instructions/general.instructions.md` — language, communication, and safety guardrails.
- `instructions/agent-contract.instructions.md` — Nexus operating model, domain/risk/task-mode gates, protected surfaces, and output contract.
- `instructions/skill-policy.instructions.md` — mandatory skill loading protocol and phase-to-skill mapping.

## Operational Model
- Built-in profile runs in Nexus-style single-agent execution.
- No delegation semantics are used in this profile.
- For mixed tasks, define an explicit App/DevOps interface contract before implementation.

## Platform Status
- OpenCode remains the authoritative source for hard command permissions and skill allowlists.
- This folder is an instruction-enforced GitHub built-in profile.
- If behavior diverges between GitHub built-in and OpenCode, follow the stricter OpenCode policy and report the gap.

## Validation
For edits in this directory:
- check frontmatter presence and consistency in each `*.instructions.md` file,
- verify contract alignment with `pi/SYSTEM.md` and repository-level `AGENTS.md`,
- run `git diff --check`,
- report any intentional divergence explicitly.
