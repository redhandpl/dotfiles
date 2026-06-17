---
name: github-actions-local
description: Repository-local overlay for GitHub Actions conventions in this repo. Layers concrete helper action, runner, summary, and auth-wrapper patterns on top of the shared `github-actions` skill.
---

# GitHub Actions Local Overlay

Use this overlay only together with the shared `github-actions` skill.
It captures repository-specific workflow conventions that should stay out of the portable shared skill.

## Load when

- Existing workflows in this repository already depend on the local conventions below.
- The task touches helper actions, runner wiring, summary rendering, or auth wrappers that are specific to this repository.
- The shared `github-actions` baseline is too generic to preserve repository consistency on its own.

## Repository-local conventions

- Preserve the current composition style (**reusable workflow -> composite action -> script**) if this structure is already implemented in this repository.
- Keep runner resolution consistent with `runner-labels` plus `fromJSON(inputs.runner-labels)` when the workflow interface already uses that contract.
- Use dedicated `render-*` composite actions for deterministic summary rendering only if those actions are already defined in this repository.
- Preserve repository-approved short-lived auth wrappers instead of replacing them with ad hoc inline shell logic.
- Preserve explicit cleanup steps for sensitive temporary files when repository workflows materialize them during builds or releases.

## Repository-local examples to keep consistent

- OIDC secret retrieval through `huuuge-org/devops-github-actions/aws-fetch-secrets@aws-fetch-secrets-v1` when that action is already the approved path.
- Summary rendering via repository-owned `render-*` composite actions.
- Cleanup steps that remove generated sensitive files in `if: always()` blocks.

## Guardrails

- Do not move these repository-local examples back into the shared `github-actions` skill.
- Do not replace approved short-lived auth wrappers with long-lived PAT or static secret alternatives.
- Do not force these conventions into repositories that do not already use them.
- If a local convention conflicts with the shared `github-actions` security posture, prioritize the stricter security posture and escalate to the repository maintainer.

## Output

Shared Baseline Applied, Local Conventions Applied, Validation, Security Notes, Residual Repo Coupling.
