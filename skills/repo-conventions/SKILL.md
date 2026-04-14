---
name: repo-conventions
description: Shared repository rules for safe, minimal, pattern-matched changes.
---

# Repo Conventions

Use this skill when working inside an existing repository and you need shared rules for how to read, modify, and validate code or config.

## Use when
- You are about to change existing files.
- You need to infer local project conventions.
- You want to avoid repository drift and unnecessary abstractions.

## Do not use when
- The task is purely conceptual and no repository change is expected.

## Rules
- Discover local conventions before making changes.
- Follow existing repository patterns before introducing new ones.
- Keep changes minimal, reversible, and scoped to the request.
- Prefer modifying existing files over adding new abstractions.
- Avoid introducing new layers unless explicitly requested.
- For agent, instruction, skill, or OpenCode settings artifacts, pair this skill with `agent-governance`.
- Surface assumptions explicitly; do not hide uncertainty.
- Escalate when scope, ownership, or architecture is unclear.
- Prefer evidence-backed claims over intuition.

## Protected surfaces
Treat these as high-attention paths:
- `.github/workflows/`
- `infra/`
- `terraform/`
- `terragrunt/`
- `helm/`
- `k8s/`
- `migrations/`
- auth, IAM, secret, and deploy-related paths

## Workflow
1. Inspect nearby files and current patterns.
2. Identify the smallest viable change.
3. Reuse existing helpers, styles, and structure.
4. Validate only the touched surface plus direct blast radius.
5. Report assumptions, changes, validation, and remaining risks.

## Output
Assumptions, Changes, Validation, Risks, Next Owner.
