---
name: github-actions
description: Specialist skill for workflow-local GitHub Actions work. Covers authoring, review, interface design, validation, and hardening for reusable workflows, composite actions, helper scripts, and workflow-local auth.
---

# GitHub Actions

Use this skill when changing workflow YAML, reusable workflows, composite actions, action metadata, helper scripts called by workflows, or workflow-local authentication and rollout controls.
Pair it with `devops` for approval posture.
Pair it with a repository-local overlay when helper actions, auth wrappers, runner conventions, or summary conventions are repository-specific.

## Repository patterns to inspect first

- Workflow entry points under `.github/workflows/` and any linked docs/runbooks.
- Reusable workflow contracts (`on.workflow_call.inputs`, `outputs`, defaults, required flags).
- Current composition style in the repository (for example: **reusable workflow -> composite action -> script**).
- Event-routing rules for `push`, `pull_request`, `workflow_dispatch`, `workflow_run`, and `repository_dispatch`.
- Output contracts between parent and child workflows (step IDs, job outputs, workflow outputs).
- Security-sensitive paths: OIDC, cloud secrets access, GitHub App/PAT usage, cross-repo checkout or push, and GitOps sync or wait steps.

## Authoring defaults

- Keep reusable interfaces strongly typed (`string`, `boolean`, `number`) with explicit defaults and stable descriptions.
- Preserve existing input/output names unless a repository owner requests migration in the tracked change request (issue/PR/plan).
- Keep `permissions` explicit at workflow and job level.
- Keep runner resolution aligned with existing typed-input and runner-selection patterns.
- Use `actions/checkout@v4` with `fetch-depth: 1` and `persist-credentials: false` unless dedicated write access is intentionally required.
- Keep logic-heavy behavior in composite actions/scripts; reusable workflows should orchestrate.
- In shell steps, pass untrusted or dynamic values via `env` instead of direct `${{ }}` interpolation.
- Keep operator-facing summaries deterministic.

## Portable conventions

### 1) Orchestration and contracts

- Keep parent workflows as orchestrators and child units as execution components with stable contracts.
- Derive run context once, pass via outputs, and avoid duplicating routing logic.
- Use a final summary job with `if: always()` and explicit `needs` wiring.
- Treat output key renames as breaking changes; use a compatibility window when consumers exist.

### 2) Event-routing logic

- Keep branch and event conditions explicit and mutually consistent.
- Define one deploy policy per event type (`push`, `pull_request`, `workflow_dispatch`, `repository_dispatch`).
- If `repository_dispatch` is used, document supported action types and execution modes.
- Centralize routing decisions and reuse outputs in downstream jobs.

### 3) Quality and integration gate patterns

- Use two-stage enablement for external quality systems: eligibility (policy) and effective enablement (precheck output).
- When required configuration is missing, skip quality/integration jobs intentionally and report the reason in the summary.
- Resolve integration mode centrally and gate downstream jobs from shared outputs.
- Keep role/mode enums explicit and aligned across parent/child workflows.

### 4) Missing dependency remediation pattern

- Validate required external dependencies before heavy jobs start.
- Prefer controlled remediation through issue/PR automation in the owning infrastructure repository.
- Keep remediation deterministic: detect, create/reuse ticket or PR, report next steps.

### 5) GitOps or deployment update pattern

- Use environment protection and per-target concurrency controls for deployment update workflows.
- Make concurrency keys map to the mutable surface (app/repository + environment/region/cluster).
- Prefer short-lived GitHub App credentials for cross-repository commits and pushes.

### 6) Security and secret handling patterns

- Prefer short-lived auth: OIDC (`id-token: write`) for cloud/secret-manager exchange and GitHub App tokens for cross-repo writes.
- Use guarded conditions for secret-bearing steps and minimize exposure.
- Clean up sensitive temporary files in `if: always()` cleanup steps.
- Keep comments for known security limitations and planned remediations.

## Security and hardening

- Prefer tightening over expanding permissions, scope, and rollout surface.
- Prefer GitHub App tokens for cross-repository writes; use PATs only when no narrower option exists and the auth model is approved.
- Treat OIDC, environment protection, token model changes, cross-repository auth, and secret access as approval-sensitive.
- Pin actions where practical and avoid ambiguous moving references.
- Scope caches carefully and avoid poisoning shared caches.
- Keep artifacts minimal, intentional, and retention-bounded.
- If a workflow updates a GitOps repo or waits for external sync, fail fast and emit actionable summaries.

## Validation (repository baseline)

- Workflow syntax and expression lint:
  - `actionlint`
- YAML parse checks:
  - `yq e '.' .github/workflows/<workflow>.yml >/dev/null`
- Helper script validation when scripts are touched:
  - `bash -n <path-to-scripts>/*.sh`
  - `shellcheck <path-to-scripts>/*.sh` (if installed)
- Composite metadata parse checks:
  - `yq e '.' <path-to-composite-action>/action.yml >/dev/null`
- Optional YAML lint:
  - `yamllint .github/workflows`

## Documentation parity rules

- If reusable workflow interface or behavior changes, update matching docs/runbooks in the same change.
- Keep examples and parameter tables aligned with actual defaults in YAML.
- Document event-routing or contract changes (especially quality gates, integration modes, dependency remediation, and deploy gating).

## High-signal review checklist for workflow PRs

- Are new `workflow_call` inputs typed and documented?
- Are parent-child outputs still wired correctly?
- Are event conditions mutually consistent?
- Are permissions minimized at workflow/job scope?
- Are cross-repo writes using GitHub App token flow?
- Are deterministic summary steps (`if: always()`) still present?
- Did matching docs/runbooks change with interface/behavior changes?

## Escalation triggers

- The workflow change requires new cloud roles, broader IAM grants, or secret model changes.
- The workflow changes GitHub App, PAT, OIDC trust, or environment-protection model.
- The workflow begins provisioning infrastructure or mutating broader control-plane repositories.
- Rollback is unclear or the blast radius is wider than workflow-local behavior.

## Anti-patterns

- Rewriting whole workflows when a targeted edit is enough.
- Untyped or weakly documented `workflow_call` interfaces.
- Inline shell that hides business logic or secret handling.
- Large Bash blocks in workflow YAML instead of versioned scripts.
- Broad `contents: write` or repo-wide tokens where narrower scope is sufficient.
- Unbounded concurrency, caches, or artifact retention.
- Breaking parent-child output contracts without migration.
- Changing push/deploy routing without updating docs and summary behavior.
- Replacing GitHub App token write-paths with long-lived PATs.

## Output

Scope, Interface Notes, Validation, Security Notes, Rollback Notes, Escalations.
