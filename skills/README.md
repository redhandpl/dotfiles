# Shared skills pack

Tadzio in OMP uses this skill pack with the [append profile](../omp/APPEND_SYSTEM.md). Load skills by task, phase, or stack; the active profile defines ownership and delegation.

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
│   ├── agent-governance/
│   ├── retro/
│   ├── writing-for-agents/
│   ├── github-create-pr/
│   ├── jira-create-ticket/
│   ├── jira-search/
│   └── confluence-search/
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
| `omp/APPEND_SYSTEM.md` | None | OMP append profile |

Optional skill provenance fields such as `origin`, `source`, `date_added`, and `risk` are informational unless a validator explicitly enforces them.

## Suggested usage

An agent loads skills per execution phase. Each per-phase skill complements cross-cutting skills:

- Phase 1 (Discovery) -> `discovery-scope`
- Phase 2 (Architecture) -> `architect`, `documentalist`
- Phase 3 (Planning) -> `planner`, `delivery-gates`
- Phase 4 (App Implementation) -> `coder`, `repo-conventions`, plus `python-patterns` for Python app work
- Phase 5 (DevOps Implementation) -> `devops`, `repo-conventions`, plus stack-specific skills as needed:
  - `terminal-context-bridge` for AWS/K8s context
  - `github-actions` for workflows, actions, and `.github/workflows/actions.lock`; add `github-actions-local` when repository-specific conventions apply.
  - `docker-patterns` for container work
  - `terraform-terragrunt` with `terraform-style-guide` for Terraform HCL
  - `cdk-aws`, `argocd-gitops`, `ansible-ops` as applicable
  - `aws-cost-optimizer` for AWS cost analysis
- Phase 6 (Testing) -> `tester`, `test-strategy`, plus `python-testing` for Python tests
- Phase 7 (Final Review) -> `reviewer`, `review-rubric`
- Agent/customization artifact changes -> `agent-governance`
- Session retrospective, on request -> [`retro`](cross-cutting/retro/SKILL.md); loads `writing-for-agents`.
- Writing or reviewing agent-facing instructions and skills -> [`writing-for-agents`](cross-cutting/writing-for-agents/SKILL.md).
- Memory between sessions -> [`project-memory-hygiene`](project-memory-hygiene/SKILL.md): backend-aware OMP `local` and Mnemopi workflows, plus capability-gated guidance for other runtimes.
- Drafting or publishing GitHub pull requests -> [`github-create-pr`](cross-cutting/github-create-pr/SKILL.md). Follow the target repository's template and use `gh` for authorized publication.
- Drafting or creating Jira issues -> [`jira-create-ticket`](cross-cutting/jira-create-ticket/SKILL.md). Drafts stay local; authorized submissions use ACLI.
- Reading Jira issues and comments, or searching Jira with JQL or a saved filter -> [`jira-search`](cross-cutting/jira-search/SKILL.md), read-only via ACLI.
- Finding announcements, requests, decisions, or conclusions in Confluence -> [`confluence-search`](cross-cutting/confluence-search/SKILL.md). Use ACLI for blog listings and known content; use full-text search for discovery beyond ACLI.

`retro` and `writing-for-agents` carry their upstream source and revision in their frontmatter, with MIT licenses in each skill directory.

OMP discovers only one level below a skill root. Skills under category directories need an appropriate discovery configuration or individual links before `skill://` and `/skill:` can find them.
