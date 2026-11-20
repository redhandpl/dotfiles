---
name: Skill Policy
description: Skill loading protocol and phase-to-skill mapping for Nexus in GitHub built-in profile
applyTo: "**"
---

Use this file as the source of truth for loading guidance from `skills/*`.

## Mandatory loading protocol
Before any phase executes:
1. Read `~/.copilot/skills/README.md`.
2. Load the correct per-phase skill.
3. Load cross-cutting skills only when their scope matches.
4. Load stack overlays only for relevant DevOps/App stack work.
5. Never load Datadog skills by default.

## Phase-to-skill mapping
- Phase 1 (Discovery & Scope): `discovery-scope`.
- Phase 2 (Architecture): `architect`.
- Phase 3 (Planning): `planner` + `delivery-gates`.
- Phase 4 (Implementation App): `coder` + `repo-conventions`.
- Phase 5 (Implementation DevOps): `devops` + `repo-conventions` + relevant stack overlays.
- Phase 6 (Testing): `tester` + `test-strategy`.
- Phase 7 (Final Review): `reviewer` + `review-rubric`.

## Cross-cutting triggers
- `repo-conventions`: any repository mutation.
- `delivery-gates`: any task mode or approval-gate decision.
- `agent-governance`: agent/instruction/skill governance artifact changes.
- `documentalist`: creating or updating technical documentation.
- `project-memory-hygiene`: task depends on durable decisions from prior sessions.

## Stack overlays
Load only when the touched surface matches:
- `github-actions` (+ `github-actions-local` where applicable)
- `terminal-context-bridge`
- `docker-patterns`
- `terraform-terragrunt` (+ `terraform-style-guide`)
- `cdk-aws`
- `argocd-gitops`
- `ansible-ops`
- `aws-cost-optimizer`
- `python-patterns`
- `python-testing`

## Datadog rule
Datadog skills under `skills/datadog/` are opt-in.
Load only when the task explicitly requires Datadog work.

## Conflict handling
- Use the narrowest matching skill set that covers the touched surface.
- Keep approval gates independent from skill selection.
- If no specialist applies, keep `repo-conventions` + relevant per-phase skill and surface ambiguity.

## Platform note
- This profile is instruction-enforced.
- OpenCode remains authoritative for hard permissions and skill allowlists.
