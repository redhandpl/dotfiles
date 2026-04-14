---
name: github-actions
description: Specialist skill for workflow-local GitHub Actions work. Covers authoring, review, interface design, validation, and hardening for reusable workflows, composite actions, helper scripts, and workflow-local auth.
---

# GitHub Actions

Use this skill when changing workflow YAML, reusable workflows, composite actions, action metadata, helper scripts called by workflows, or workflow-local authentication and rollout controls.
Pair it with `devops` for approval posture.

## Repository patterns to inspect first

- `workflow_call` inputs, outputs, defaults, and type declarations.
- Reusable workflow chains that call composite actions or scripts.
- Helper scripts under repository-local action or script directories.
- Cross-repository checkout, GitHub App token generation, or workflow-local GitOps update paths.
- Environment protection, concurrency groups, artifact naming, cache keys, and summary conventions.
- Workflow docs or examples that describe public inputs or behavior.

## Authoring defaults

- Prefer reusable workflow -> composite action -> script for reusable runtime logic.
- Keep `workflow_call` inputs and outputs strongly typed, named consistently, and documented.
- Prefer explicit `permissions` over inherited broad defaults.
- Prefer environment variables over direct `${{ }}` shell interpolation in `run` blocks when values cross trust boundaries.
- Keep long business logic in scripts or composite actions, not in large inline shell blocks.
- When Bash logic grows beyond a small inline step, move it into a dedicated repository script and invoke or source that script from the workflow or composite action.
- Use GitHub annotation logs and job summaries for actionable failures.
- Key concurrency to the mutable surface, for example target repository plus environment.

## Security and hardening

- Prefer tightening over expanding permissions, scope, and rollout surface.
- Prefer GitHub App tokens for cross-repository writes; use PATs only when no narrower option exists and the auth model is approved.
- Treat OIDC, environment protection, token model changes, cross-repository auth, and secret access as approval-sensitive.
- Pin actions where practical and avoid ambiguous moving references.
- Scope caches carefully and avoid poisoning shared caches.
- Keep artifacts minimal, intentional, and retention-bounded.
- If a workflow updates a GitOps repo or waits for external sync, fail fast and emit actionable summaries.

## Validation

- `actionlint`
- YAML parse validation with `yq eval '.'`
- `bash -n` and `shellcheck` for touched helper scripts when applicable
- Parse composite action metadata files and validate required inputs or outputs
- Review branch filters, path filters, concurrency groups, cache keys, artifact retention, and permissions
- Update workflow docs, examples, or interface notes when reusable workflow interfaces change

## Escalation triggers

- The workflow change requires new cloud roles, broader IAM grants, or secret model changes.
- The workflow changes GitHub App, PAT, OIDC trust, or environment-protection model.
- The workflow begins provisioning infrastructure or mutating broader control-plane repositories.
- Rollback is unclear or the blast radius is wider than workflow-local behavior.

## Anti-patterns

- Workflow rewrites when a targeted edit would suffice.
- Untyped or weakly documented `workflow_call` interfaces.
- Inline shell blocks that hide business logic or secret handling.
- Large Bash implementations embedded directly in workflow YAML instead of living in versioned repository scripts.
- Broad `contents: write` or repo-wide tokens when a narrower scope is enough.
- Unbounded concurrency, caches, or artifact retention.

## Output

Scope, Interface Notes, Validation, Security Notes, Rollback Notes, Escalations.