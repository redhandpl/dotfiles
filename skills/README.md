# Shared skills pack

Skills available in this repository. Skills are loaded per execution phase.

## Directory layout

```
skills/
├── README.md                          # This file — routing aid
├── cross-cutting/                     # Always available (low volume)
│   ├── repo-conventions/
│   ├── delivery-gates/
│   ├── test-strategy/
│   ├── review-rubric/
│   ├── documentalist/
│   └── agent-governance/
├── per-phase/                         # Loaded when phase trigger fires
│   ├── discovery-scope/               # Phase 1
│   ├── architect/                     # Phase 2
│   ├── planner/                       # Phase 3
│   ├── coder/                         # Phase 4 (App)
│   ├── devops/                        # Phase 5 (DevOps)
│   ├── tester/                        # Phase 6
│   └── reviewer/                      # Phase 7
├── stack/                             # Stack overlays (Phase 4/5)
│   ├── github-actions/
│   ├── github-actions-local/
│   ├── docker-patterns/
│   ├── python-patterns/
│   ├── python-testing/
│   ├── terraform-terragrunt/
│   ├── terraform-style-guide/
│   ├── cdk-aws/
│   ├── argocd-gitops/
│   ├── ansible-ops/
│   └── aws-cost-optimizer/
├── terminal-context/                  # AWS/K8s context selection
│   ├── terminal-context-bridge/
│   └── terminal-context-aws-k8s/
└── project-memory-hygiene/            # Memory between sessions
```

## Frontmatter contract

| Artifact | Required fields | Selection |
|---|---|---|
| `skills/**/SKILL.md` | `name`, `description` | Explicit phase, stack, or named-skill dispatch |
| `github/instructions/*.instructions.md` | `name`, `description`, `applyTo` | Instruction glob matching |
| `github_builtin/instructions/*.instructions.md` | `name`, `description`, `applyTo` | GitHub Built-in instruction matching |
| `pi/SYSTEM.md` | None | Pi runtime prompt |

Optional skill provenance fields such as `origin`, `source`, `date_added`, and `risk` are informational unless a validator explicitly enforces them.

## Suggested usage

An agent loads skills per execution phase. Each per-phase skill complements cross-cutting skills:

- Phase 1 (Discovery) -> `discovery-scope`
- Phase 2 (Architecture) -> `architect`, `documentalist`
- Phase 3 (Planning) -> `planner`, `delivery-gates`
- Phase 4 (App Implementation) -> `coder`, `repo-conventions`, plus `python-patterns` for Python app work
- Phase 5 (DevOps Implementation) -> `devops`, `repo-conventions`, plus stack-specific skills as needed:
  - `terminal-context-bridge` for AWS/K8s context
  - `github-actions` (plus `github-actions-local` when repo-specific overlay is needed) for workflow-local GitHub Actions work
  - `docker-patterns` for container work
  - `terraform-terragrunt` with `terraform-style-guide` for Terraform HCL
  - `cdk-aws`, `argocd-gitops`, `ansible-ops` as applicable
  - `aws-cost-optimizer` for AWS cost analysis
- Phase 6 (Testing) -> `tester`, `test-strategy`, plus `python-testing` for Python tests
- Phase 7 (Final Review) -> `reviewer`, `review-rubric`
- Agent/customization artifact changes -> `agent-governance`
- Memory between sessions -> `project-memory-hygiene`
