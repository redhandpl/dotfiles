# Shared skills pack

Shared skills used by both OpenCode and GitHub Copilot agent artifacts in this repository.
OpenCode remains the authoritative enforcement target for permission allowlists when platform behavior differs, but the routing and usage guidance here applies to both stacks.

## Cross-cutting skills

- repo-conventions
- delivery-gates
- github-actions
- terminal-context-bridge
- test-strategy
- review-rubric
- documentalist
- agent-governance

## Per-phase skills (Nexus)

- discovery-scope
- architect
- planner
- coder
- devops
- tester
- reviewer

## Stack-specialist skills

- docker-patterns
- aws-cost-optimizer
- terraform-terragrunt
- terraform-style-guide
- python-patterns
- python-testing
- cdk-aws
- argocd-gitops
- ansible-ops

## Private or local overlays

- terminal-context-aws-k8s (keep account, profile, and cluster mappings out of the public repo)

## Suggested usage

### Multi-agent (Void Protocol)

- `coder` -> repo-conventions, delivery-gates, test-strategy, plus `python-patterns` for Python app code and `python-testing` for Python tests
- `devops-specialist` -> repo-conventions, delivery-gates, terminal-context-bridge, github-actions, plus the relevant stack-specialist skill (`docker-patterns`, `aws-cost-optimizer`, `terraform-terragrunt` with `terraform-style-guide` for Terraform HCL, `cdk-aws`, `argocd-gitops`, `ansible-ops`)
- `github-actions` replaces a dedicated GitHub Actions child agent
- `tester` -> repo-conventions, test-strategy
- `code-reviewer` -> repo-conventions, review-rubric
- agent/customization artifact changes -> repo-conventions, agent-governance

### Single-agent (Nexus)

Nexus is the official opt-in single-agent exception. It loads skills per execution phase. Each per-phase skill complements cross-cutting skills:

- Phase 1 (Discovery) -> discovery-scope
- Phase 2 (Architecture) -> architect, documentalist
- Phase 3 (Planning) -> planner, delivery-gates
- Phase 4 (App Implementation) -> coder, repo-conventions, plus python-patterns for Python app work
- Phase 5 (DevOps Implementation) -> devops, repo-conventions, plus stack-specific skills as needed: terminal-context-bridge, github-actions, docker-patterns, aws-cost-optimizer, terraform-terragrunt with terraform-style-guide for Terraform HCL, cdk-aws, argocd-gitops, ansible-ops
- Phase 6 (Testing) -> tester, test-strategy, plus python-testing for Python test implementation
- Phase 7 (Final Review) -> reviewer, review-rubric
- Agent/customization artifact changes -> agent-governance
