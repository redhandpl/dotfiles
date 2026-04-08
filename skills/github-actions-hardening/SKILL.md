---
name: github-actions-hardening
description: Shared operating guide and security checklist for GitHub Actions workflow-local changes.
---

# GitHub Actions Hardening

Use this skill for workflow-local work in `.github/workflows/*`, reusable workflows, composite actions, runner settings, permissions, caching, artifacts, concurrency, and workflow-local OIDC wiring.

## Use when
- Editing GitHub Actions workflow YAML.
- Reviewing workflow security, permissions, reliability, or maintainability.
- Updating reusable workflows or composite actions.
- Adjusting runner selection, triggers, caching, artifacts, or concurrency.

## Do not use when
- The task expands into broader cloud architecture, IAM strategy, secret lifecycle management, or infrastructure provisioning.
- The task changes deployment design beyond workflow-local behavior.

## Execution scope
This skill covers workflow-local changes such as:
- `.github/workflows/*`
- reusable workflows
- composite actions
- workflow permissions
- trigger filters
- runner labels and selection
- concurrency controls
- caching strategy
- artifact publishing and retention
- workflow-local OIDC wiring

## Guardrails
- Prefer tightening over expanding permissions, scope, and rollout surface.
- Prefer targeted edits over workflow rewrites.
- Keep permissions least-privilege.
- Keep triggers narrow and intentional.
- Use concurrency controls when duplicate runs are harmful.
- Scope caches carefully and avoid poisoning shared caches.
- Keep artifacts intentional, minimal, and retention-bounded.
- Pin actions where practical and avoid ambiguous moving references.
- Treat OIDC, cloud auth, and secret access as approval-sensitive surfaces.
- Escalate broader IAM, cloud architecture, secret lifecycle, or infra provisioning decisions.

## Escalation rules
Escalate back to the main `devops-specialist` decision flow when any of the following is true:
- workflow changes require new cloud roles, broader IAM grants, or secret model changes,
- the change introduces a new deployment path or environment,
- the workflow starts provisioning infrastructure,
- rollback is unclear,
- blast radius is not confined to workflow-local behavior.

## Review checklist
- Are workflow permissions narrower than default broad access?
- Are triggers limited to the events and branches that matter?
- Is concurrency configured where repeat execution is dangerous or wasteful?
- Is caching safe, deterministic, and worth the complexity?
- Are artifacts necessary, named clearly, and retained for an appropriate period?
- Is secret exposure minimized in logs, env, and outputs?
- Is rollback or disablement obvious if the workflow misbehaves?

## Validation
- Validate YAML syntax and workflow structure.
- Check trigger logic, branch filters, and path filters.
- Review permission scope and token usage.
- Validate concurrency, cache keys, artifact names, and retention.
- Confirm failure behavior, rollback path, or fast disablement path.

## Output
Scope, Changes, Validation, Security Notes, Risks, Escalations.
