---
name: terraform-terragrunt
description: Specialist skill for Terraform, Terragrunt, and Atlantis-driven repositories. Guides live-vs-module scoping, state awareness, autoplan coupling, validation, and safe run-all boundaries.
---

# Terraform & Terragrunt

Use this skill when changing Terraform modules, Terragrunt live configuration, Atlantis project definitions, backend or provider generation, or shared HCL configuration.
Pair it with `devops` for approval posture, `repo-conventions` for minimal edits, and `terminal-context-bridge` before terminal commands that touch real AWS environments.
Load `terraform-style-guide` alongside this skill when writing or reviewing Terraform HCL, module file layout, naming, variables, outputs, or block ordering.

## Repository patterns to inspect first

- Hierarchical Terragrunt layouts with `env.hcl`, `region.hcl`, `_all_env_common/*.hcl`, and generated backend or provider files.
- Separate live repositories and module directories.
- S3 remote state, lockfiles, assume-role chains, generated providers, and default tags.
- Atlantis `atlantis.yaml` projects, `when_modified` filters, custom workflows, and `run-all` usage.
- Root files such as `root.hcl` that derive `path_relative_to_include()`, provider generation, state keys, plugin cache, or default session names.
- `.terraform-docs.yaml`, `module.md`, or README automation for module documentation.

## Change classification

Classify the touched surface before editing:
- Module-only change.
- Live configuration change.
- Root generator, backend, provider, or include-chain change.
- Atlantis autoplan or workflow change.
- IAM, assume-role, or state-topology change.

## Preflight

- Resolve target repository, environment, account, region, module path, and Terragrunt include chain.
- Identify the affected remote state key, bucket, lock configuration, or generated backend path.
- Map whether rollout happens through local plan review, Atlantis plan/apply, or `terragrunt run-all`.
- Inspect generated backend and provider sources; change the source HCL, not generated artifacts.
- Inspect `when_modified` and project scopes before changing shared files or Atlantis config.
- Confirm whether the change touches modules reused across multiple live stacks.
- If `run-all` exists, document why the change can or cannot stay scoped to one unit.

## Validation

- `terraform fmt -check`
- `terraform validate`
- Repository-standard HCL formatting such as `terragrunt hclfmt`
- `terragrunt plan` or `terraform plan` on the smallest affected unit
- `yq eval '.' atlantis.yaml` for Atlantis configuration changes
- Review Atlantis workflow environment such as parallelism, plugin cache, and custom plan/apply steps when `atlantis.yaml` changes
- Refresh `terraform-docs`, `module.md`, or README sections when module inputs or outputs change
- Apply `terraform-style-guide` conventions when touching `*.tf`: file layout, naming, descriptions, block ordering, and variable or output completeness

## Guardrails

- Prefer the smallest targeted plan over repository-wide `run-all`.
- Treat backend, state key, provider, lock, assume-role, and bootstrap changes as approval-sensitive.
- Review `run-all` parallelism, dependency order, and changed scope before widening execution.
- Do not broaden Atlantis `when_modified`, automerge, or apply scope casually.
- Do not hand-edit generated provider or backend files; update the generating HCL instead.
- Treat `_all_env_common`, `env.hcl`, `region.hcl`, and root include logic as high-blast-radius surfaces.
- Keep generated backend and provider patterns consistent with repository root conventions.
- Document blast radius when a shared module or `_all_env_common` file changes.
- Use `terraform-style-guide` as the source of truth for Terraform HCL structure; use this skill for Terragrunt topology, Atlantis coupling, state awareness, and rollout safety.

## Escalation triggers

- State migration, import, moved resources, or backend changes.
- Provider major-version changes or lockfile churn across many modules.
- New assume-role, cross-account trust, OIDC, or IAM grants.
- `run-all` or Atlantis workflow changes that affect more than one environment.
- Unclear rollback for shared live configuration.

## Output

Target Scope, Include Chain, State Impact, Atlantis or Automation Impact, Execution Context, Validation Evidence, Rollback Notes, Escalations.