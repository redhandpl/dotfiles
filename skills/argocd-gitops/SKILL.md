---
name: argocd-gitops
description: Specialist skill for ArgoCD, GitOps repositories, and manifest update flows. Guides source-of-truth discipline, sync-risk analysis, and validation for app-of-apps and environment-aware rollouts.
---

# ArgoCD & GitOps

Use this skill when changing ArgoCD applications, ApplicationSets, Helm values or manifests in GitOps repositories, or workflows that update GitOps repositories and optionally wait for sync.
Pair it with `devops`; add `github-actions` when the GitOps change is driven by GitHub Actions and `terminal-context-bridge` before `kubectl`, `helm`, or `argocd` terminal commands.

## Repository patterns to inspect first

- Application-of-applications or external root-application ownership.
- Auto-sync behavior on default-branch commits.
- Application path structure by environment, cluster, region, or namespace.
- `values.yaml`-based image-tag updates and generated ArgoCD application-name conventions.
- Workflows that update target repositories, gate by environment, and optionally wait for sync or health.
- Repositories where the root ArgoCD application is owned elsewhere, making local edits deploy on merge without local root-app changes.

## Preflight

- Identify the Git source of truth and the exact application path before editing.
- Resolve ArgoCD project, destination cluster or server, namespace, and target revision.
- Determine whether sync is automated, manual, or workflow-polled.
- Confirm whether the change is manifest-only, chart-only, or workflow-orchestrated.
- Map the cross-repository auth model when a workflow writes into the GitOps repository.
- Confirm whether the change mutates only `values.yaml` image tags or broader application wiring such as destination, project, or sync policy.

## Validation

- Parse YAML with `yq eval '.'`
- Run `helm lint` and or `helm template` when charts or values change
- Validate that referenced manifest directories and `values.yaml` files exist
- When approved and available, use `argocd app diff` or equivalent read-only status checks
- Validate wait-for-sync timeout, health polling, and concurrency grouping when workflow-driven manifest updates are involved
- Verify wait-for-sync timeouts, failure messaging, and concurrency keys for workflow-driven rollouts

## Guardrails

- Prefer Git changes in the source-of-truth repository over direct cluster mutation.
- Treat `project`, `destination`, `syncPolicy`, pruning, self-heal, and target-repository changes as approval-sensitive.
- If default-branch commits auto-sync, treat merge as deployment and plan rollback as a Git revert.
- Keep mutable workflows serialized per target repository and environment when race conditions are possible.
- Use scoped auth for cross-repository writes; prefer GitHub App tokens over broad PATs.
- Treat changes under a root app or app-of-apps boundary as potentially multi-application, even when only one leaf manifest is edited.
- Surface when a workflow change alters both CI behavior and runtime deployment behavior.

## Escalation triggers

- New cluster, namespace, project, or target repository.
- Sync-policy or prune or self-heal changes.
- Rollback depends on manual ArgoCD console intervention.
- Workflow-driven GitOps writes require broader auth or secret changes.
- Blast radius crosses multiple applications or environments.

## Output

Source of Truth, Application Scope, Sync Mode, Execution Context, Validation Evidence, Rollback Path, Security Notes, Escalations.