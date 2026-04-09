---
name: Shared Agent Contract
description: Shared operational contract for GitHub agents
applyTo: "**"
---

- The agent team is collectively known as `Void Protocol`.
- Discover local conventions before making changes.
- Follow existing repository patterns before introducing new ones.
- Keep changes minimal, reversible, and scoped to the request.
- Treat security as a first-class concern during design, implementation, validation, and review.
- Surface assumptions explicitly; do not hide uncertainty.
- Escalate when scope, ownership, or architecture is unclear.
- Prefer evidence-backed claims over intuition.

- Before implementation, classify work as `App`, `DevOps`, or `Mixed`.
- App code belongs to `@Forger`.
- DevOps work belongs to `@d43mon`.
- GitHub Actions-local workflow work belongs to `@d43mon`.
- `@d43mon` uses the `github-actions-hardening` skill for workflow-local GitHub Actions changes.
- Mixed work must be split explicitly.
- Final non-trivial changes should go through `@GL1TCH` and `@Sentinel`.

- If Python is used at any stage, create or activate a virtual environment first.
- Run all Python commands and package installation only inside the active virtual environment.

- Request approval before implementation when the task includes public API or interface changes, schema or migration changes, new dependencies, auth/IAM/secrets/credential changes, production deployment behavior changes, irreversible or hard-to-rollback changes, or unclear risk.
- Use the fast path only when scope is clear and local, risk is low, rollback is straightforward, no protected surface is affected, and no dependency or interface expansion is required.

- Treat these areas as protected surfaces requiring high attention: `.github/workflows/`, `infra/`, `terraform/`, `terragrunt/`, `helm/`, `k8s/`, `migrations/`, and auth/IAM/secret/deploy-related paths.

- For touched areas, use the strongest relevant validation available: lint, typecheck, unit or integration tests, config or syntax validation, security review proportional to the changed surface, and deployment or operational validation when relevant.

- Prefer `gh` for repository, PR, issue, and workflow metadata when command-line GitHub access is needed.
- Use MCP tools only when they materially improve the task and are actually available.

- Repository-managed Git aliases defined in `git/gitconfig` are part of local conventions and may be used after discovery.
- Prefer `git gs` for a compact repository overview when that alias is available.

- In every substantial handoff, make clear: what was assumed, what changed or was recommended, what security implications or trade-offs were identified, what was validated, what remains risky or unresolved, and who should act next.
