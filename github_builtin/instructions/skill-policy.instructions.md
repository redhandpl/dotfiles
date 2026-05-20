---
name: Skill Policy
description: Canonical skill-selection policy for GitHub Copilot built-in Void Protocol profile
applyTo: "**"
---

Use this file as the source of truth for when to apply guidance from `@skills/*`.

## Policy intent
- Keep skill selection deterministic across sessions.
- Prefer the narrowest matching skill for the touched surface.
- Keep OpenCode as the enforcement source of truth when behavior diverges.

## Selection order
1. Classify domain: `App`, `DevOps`, `Mixed`.
2. Apply cross-cutting governance skills if triggered.
3. Apply role-specific skills for the selected specialist semantics.
4. Apply one or more stack-specialist skills for the exact touched technology.
5. Apply testing/review skills when validation or final gate is required.

## Cross-cutting triggers
- `repo-conventions`: any implementation or review touching repository files.
- `delivery-gates`: before deciding `Read-only` / `Fast-path` / `Approval-required`.
- `project-memory-hygiene`: when decisions depend on long-term repo context or prior architecture/workflow choices.
- `documentalist`: when behavior, setup, API/config, or operations docs must change.
- `agent-governance`: when editing agent/instruction/skill/OpenCode governance artifacts.

## Role and phase triggers

### Ghost semantics
- Use `delivery-gates` for mode/risk gating.
- Use `agent-governance` when routing touches agent customization artifacts.

### Anchor semantics
- Primary skill: `discovery-scope`.
- Companion skills: `delivery-gates` (for fast-path vs approval), `project-memory-hygiene` when historical context affects scope.

### Blueprint semantics
- Primary skill: `architect`.
- Companion skills: `documentalist` (when ADR/design docs are required), `project-memory-hygiene` when prior architecture decisions must be reused.

### Weaver semantics
- Primary skill: `planner`.
- Companion skills: `delivery-gates` (for explicit phase gates and approval points), `project-memory-hygiene` when prior rollout constraints exist.

### Shard semantics
- Primary skill: none (decomposition behavior).
- Companion skills: `planner` only when decomposition must preserve phase dependencies from an approved plan.

### Forger semantics
- Primary skills: `coder` + `repo-conventions`.
- Companion skills: `delivery-gates` (risk mode), `python-patterns` for Python app code, `python-testing` for Python test code, `agent-governance` for agent/instruction/skill/OpenCode artifacts, `documentalist` when implementation changes docs.

### d43mon semantics
- Primary skills: `devops` + `repo-conventions` + `delivery-gates`.
- Companion skills (by surface):
  - `github-actions` for workflow-local GitHub Actions,
  - `terminal-context-bridge` for AWS/Kubernetes context-sensitive terminal tasks,
  - `docker-patterns`, `aws-cost-optimizer`, `terraform-terragrunt` (+ `terraform-style-guide` for HCL), `cdk-aws`, `argocd-gitops`, `ansible-ops`,
  - `documentalist` for operational docs/runbooks,
  - `project-memory-hygiene` when rollout history or environment conventions affect execution.

### GL1TCH semantics
- Primary skills: `tester` + `test-strategy`.
- Companion skills: `python-testing` for Python tests, `agent-governance` when validating agent/instruction/skill/OpenCode changes.

### Sentinel semantics
- Primary skills: `reviewer` + `review-rubric`.
- Companion skills: `agent-governance` when reviewing agent/instruction/skill/OpenCode artifacts.

## Surface quick reference
- App specifics: `python-patterns` for Python app code, `python-testing` for Python tests.
- DevOps specifics under `d43mon` semantics: `github-actions`, `terminal-context-bridge`, `docker-patterns`, `aws-cost-optimizer`, `terraform-terragrunt` (+ `terraform-style-guide` for HCL), `cdk-aws`, `argocd-gitops`, `ansible-ops`.

## Datadog policy
- Use `dd-pup` as CLI foundation for Datadog operational tasks.
- `dd-docs`: documentation lookup or product behavior clarification.
- `dd-monitors`: monitor lifecycle/search/create/update practices.
- `dd-logs`: log pipelines/search/archives/cost control.
- `dd-apm`: generic APM onboarding/instrumentation/analysis when SSI chain is not the direct task.
- `dd-apm-service-remapping`: service renaming/normalization/remapping rules.
- `dd-browser-sdk`: Browser SDK setup/migration/troubleshooting.
- `dd-browser-sdk-upgrade-v7`: explicit v6 -> v7 migration and removed-option remediation.

### Datadog SSI chain (Kubernetes)
- If Agent is missing -> `dd-apm-k8s-ssi-agent-install`.
- Then -> `dd-apm-k8s-ssi-enable-ssi`.
- Then -> `dd-apm-k8s-ssi-verify-ssi`.
- If traces/injection fail -> `dd-apm-k8s-ssi-troubleshoot-ssi`.
- After successful install+enable -> `dd-apm-k8s-ssi-onboarding-summary`.

### Datadog SSI chain (Linux)
- If Agent is missing -> `dd-apm-linux-ssi-agent-install`.
- Then -> `dd-apm-linux-ssi-enable-ssi`.
- Then -> `dd-apm-linux-ssi-verify-ssi`.
- If traces/injection fail -> `dd-apm-linux-ssi-troubleshoot-ssi`.
- After successful install+enable -> `dd-apm-linux-ssi-onboarding-summary`.

## Conflict and fallback rules
- When multiple skills match, use the narrowest stack skill plus required cross-cutting skills.
- Do not replace approval gates with skill selection.
- If no specialist skill matches, stay with `repo-conventions` + role semantics and escalate ambiguity.

## Platform note
- This GitHub built-in profile is instruction-enforced.
- OpenCode remains the authoritative source for hard permission enforcement and skill allowlists.
