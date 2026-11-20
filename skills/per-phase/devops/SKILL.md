---
name: devops
description: DevOps implementation skill. Guides blast radius mapping, rollout or rollback design, stack dispatch, execution-context selection, and operational coupling analysis. Use together with repo-conventions, terminal-context-bridge when terminal execution is involved, and the relevant stack-specific skills.
---

# DevOps

Use this skill when implementing CI/CD, IaC, deployment, IAM, secrets, or infrastructure changes.
This skill maps blast radius, rollout, rollback, and stack dispatch. Use `delivery-gates` and the active profile for task mode and approval.

Complements `repo-conventions` with operational depth.
Load additional specialist skills as required:

- `github-actions` for workflow-local GitHub Actions and dependency lockfiles.
- `github-actions-local` when repository-specific workflow or lockfile conventions apply.
- `docker-patterns` for Dockerfiles, Docker Compose topology, image hardening, and container orchestration conventions.
- `aws-cost-optimizer` for AWS cost analysis, Cost Explorer, rightsizing, and savings recommendations.
- `terraform-terragrunt` for Terraform, Terragrunt, and Atlantis-driven repositories.
- `terraform-style-guide` alongside `terraform-terragrunt` when authoring or reviewing Terraform HCL.
- `cdk-aws` for AWS CDK config or stack changes.
- `argocd-gitops` for ArgoCD, GitOps repositories, manifest update flows, and Helm/Kubernetes GitOps surfaces.
- `ansible-ops` for Ansible playbooks, inventories, roles, or operator wrappers.
- `terminal-context-bridge` before terminal commands that depend on AWS or Kubernetes context.

## Stack dispatch

Choose the narrowest specialist skill set that matches the touched surface:

- GitHub Actions workflow YAML, reusable workflows, composite actions, workflow-local OIDC, or `.github/workflows/actions.lock` -> `github-actions`
- Repository-specific helpers, runners, summaries, auth wrappers, or lockfile conventions -> `github-actions-local` together with `github-actions`
- Dockerfiles, Docker Compose stacks, image hardening, container networking, or volume strategy -> `docker-patterns`
- AWS cost analysis, Cost Explorer queries, rightsizing, waste detection, Savings Plans, or Reserved Instance evaluation -> `aws-cost-optimizer`
- Terraform modules, Terragrunt live repos, Atlantis config, generated providers/backends, or shared HCL -> `terraform-terragrunt` plus `terraform-style-guide` when Terraform HCL authoring or review is in scope
- AWS CDK stacks, stack config repositories, or CloudFormation-oriented diff/deploy flows -> `cdk-aws`
- ArgoCD applications, manifest repositories, Helm values/charts, or workflow-driven GitOps updates -> `argocd-gitops`
- Ansible playbooks, roles, inventories, `ansible.cfg`, or wrapper CLIs -> `ansible-ops`
- Any terminal step using `aws`, `terraform`, `terragrunt`, `cdk`, `kubectl`, `helm`, or `argocd` against real environments -> `terminal-context-bridge`

Multiple specialist skills may be loaded together when the change crosses surfaces, for example GitHub Actions orchestrating ArgoCD manifest updates or Terragrunt planning against a specific AWS account.

## Blast radius mapping

Before any change, document:

- **Affected environments** — which environments are impacted (dev, staging, prod).
- **Affected accounts/clusters/control planes** — which AWS accounts, Kubernetes clusters, ArgoCD projects, or automation control planes receive the change.
- **Affected repositories and automation paths** — which repositories, reusable workflows, Atlantis configs, or GitOps repos participate in rollout.
- **Affected services** — which services or components change behavior.
- **Affected users** — who is impacted if this change fails.
- **Failure mode** — what happens if the change is applied incorrectly.

## Execution preflight

Before writing files or running commands:

- Identify the source of truth: GitOps repo, Atlantis/Terragrunt live repo, CDK config repo, Ansible inventory, or workflow repo.
- Resolve target environment, account, region, cluster, namespace, and ArgoCD project up front.
- If terminal work depends on AWS or Kubernetes context, load `terminal-context-bridge`; if a private or local overlay such as `terminal-context-aws-k8s` is available, let the bridge use it. Otherwise ask and do not guess `prod`.
- Keep context export or selection and the first target command in the same shell session.
- Determine whether rollout happens by merge, Atlantis plan/apply, ArgoCD auto-sync, reusable workflow call, or manual operator step.
- Never execute direct infrastructure mutations such as `terraform apply` or `kubectl apply`; use plan, diff, synth, lint, or check outputs for validation.
- Isolate the smallest deployable unit before validation: stack, module, app path, inventory slice, workflow, or target repository path.

## Rollout path design

Define the sequence of deployment:

- Order of environment application (dev → staging → prod).
- Canary or staged rollout when applicable.
- Human or automation gates between stages (for example Atlantis approval, environment protection, merge gate, or ArgoCD health gate).
- Verification steps between stages.
- Point of no return — if one exists, name it explicitly.
- Cross-repository sequencing when one workflow updates another repository or control plane.

## Rollback path design

For each change:

- **Revert method** — exact steps to undo (revert commit or restore the previous config through the approved mechanism).
- **Revert verification** — how to confirm rollback succeeded.
- **Time-to-rollback** — rough effort estimate.
- **Partial rollback** — can individual components be rolled back independently?
- **GitOps rollback path** — whether rollback is a Git revert, manifest value revert, chart version revert, or a controlled sync back to a previous revision.

## Risk classification

Apply `delivery-gates` and the active profile. Classify `plan`, `diff`, and check-mode commands by their actual effects, including remote locks, jobs, writes, and output exposure.

Additional DevOps approval triggers:

- New cloud roles or IAM grants.
- New deployment paths or environments.
- Infrastructure provisioning or destroy operations.
- Secret model changes.
- Production rollout behavior changes.
- State backend, state key, provider, bootstrap, or generated provider/backend changes.
- ArgoCD project, destination, sync policy, pruning, or self-heal changes.
- Cross-repository automation writes or auth-model changes.
- Unclear rollback.

## Validation baseline

Use the specialist skill to select checks for the touched surface. Establish safe preflight and the target before implementation; validate the changed behavior afterward. Prefer static or local checks first. Before running a validator against shared or remote state, verify its effects, context, and approval scope. Approval for a repository edit does not itself authorize remote changes.

- Terraform or Terragrunt — use the smallest affected unit; check backend locks and remote execution before planning.
- CDK — prefer scoped synthesis and template comparison; check for lookups and avoid the default change-set diff.
- GitOps, Helm, or Kubernetes — render and lint locally first; use remote checks only after assessing their effects.
- Ansible — start with syntax and lint checks; review the wrapper and reachable tasks before check mode or diff output.
- GitHub Actions — validate syntax, typed interfaces, helper scripts, and dependency lockfiles as applicable.

## Static validators

Run per touched file type:

- `.github/workflows/*.yml` → `actionlint`
- `action.yml` / `action.yaml` → `yq eval '.'`
- `*.tf` → `terraform fmt -check`
- `*.hcl` → repository-standard Terragrunt HCL validation/formatting such as `terragrunt hcl fmt --check --diff` and `terragrunt hcl validate` when Terragrunt config is in scope
- `*.yml` / `*.yaml` → `yamllint`
- `*.sh` → `shellcheck`
- `Dockerfile` → `hadolint`
- YAML config → `yq eval '.'`

## Environment discipline

- Python: always create or activate `.venv` first; all commands inside venv.
- AWS: verify active profile, account, region, and assume-role target before infrastructure commands.
- Kubernetes: verify active context, cluster, namespace, and ArgoCD project before cluster-facing commands.
- Context-dependent commands must run only after `terminal-context-bridge` has resolved the target or explicitly determined that no context switch is required.
- GitOps: prefer changing the Git source of truth over direct cluster mutation when a repo is auto-synced.
- Credentials: never hardcode; prefer environment variables, secret managers, GitHub App tokens, or OIDC.

## Permission tightening

Default posture: tighten, never expand.

- Prefer narrow IAM policies over broad ones.
- Prefer scoped tokens over full-access tokens.
- Prefer read-only when write is not required.
- Document any permission expansion with explicit justification.

## Escalation triggers

Stop and escalate when:

- Change requires new cloud roles or broader IAM grants.
- New deployment path or environment is being introduced.
- Workflow starts provisioning infrastructure or mutating additional control-plane repositories.
- State, bootstrap, sync policy, or destination changes widen the operational surface.
- Rollback path is unclear.
- Blast radius extends beyond a single expected repository, environment, or control plane.

## Anti-patterns

- Treating `plan` as permission to apply — direct infrastructure mutations remain prohibited.
- Expanding permissions silently — every expansion needs explicit justification.
- Missing rollback design — never implement without a rollback path.
- Skipping blast radius assessment — document impact before changing.
- Broad `run-all`, deploy-all, or sync-all operations without first narrowing scope.
- Updating GitOps-managed runtime state directly in cluster while skipping the source-of-truth repo.
- Guessing AWS account or Kubernetes context.
- Hiding cross-repository automation coupling inside a workflow change summary.
- Hardcoding credentials or secrets.
- Running infrastructure commands without verifying active profile/context.

## Output

Blast Radius, Specialist Skills Loaded, Execution Context, Rollout Path, Rollback Path, Risk Classification, Validation Evidence, Security Trade-offs, Escalations (if any), Next Phase.
