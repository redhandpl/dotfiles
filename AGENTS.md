# Repository Guidelines

## Project Overview

This is a **dotfiles / policy repository** for "Void Protocol" — an AI agent orchestration system built on top of [OpenCode](https://opencode.ai) and GitHub Copilot. It contains no application source code; instead it defines agent definitions, skills, routing rules, runtime configuration, git settings, and Neovim configuration.

Cursor artifacts may still exist for historical reference, but they are out of support and should not receive routine updates.

## Architecture & Data Flow

This repository defines **five runtime environments**, each with its own agent orchestration layer, plus a GitHub built-in profile. The user chooses which to use for any given task.

```
User prompt (tool choice)
  │
  ├── OpenCode path:       opencode/ (agents, config, shared contract)
  │                         └── skills/ (cross-cutting, per-phase, stack overlays)
  │                         User decides: delegate to @ghost (team routing) or @nexus (single-agent, end-to-end)
  │
  ├── GitHub Copilot:      github/ (agents, instructions)
  │                         └── skills/ (shared — same files loaded by both paths)
  │                         Mirror of the OpenCode agent set; instruction-enforced, not permission-enforced.
  │
  ├── GitHub Built-in:     github_builtin/ (instruction-first, no role files)
  │                         Instructions mimic Void Protocol roles through prompt-level routing.
  │                         OpenCode remains authoritative for hard permissions; report gaps when behavior diverges.
  │
  └── Pi (weapon of choice):  pi/SYSTEM.md (Nexus master prompt for pi.dev)
                               Current preferred agent tool.

  └── OMP (oh-my-pi):       omp/SYSTEM.md (Nexus master prompt, copy of pi.dev)
                              Full Nexus prompt adapted for oh-my-pi.

Runtime config ──→ opencode/opencode.json (providers, models, plugins)
Git config    ──→ git/gitconfig (aliases, LFS, preferences)
```

**Agent routing chain** (default, all paths):
```
Ghost → Anchor / Weaver / Blueprint → (optional) Shard → Forger / d43mon → GL1TCH → Sentinel
```
**Standalone exception**: `User → Nexus` (end-to-end, no delegation)

### Environment selection

| Environment | Directory | Notes |
|-------------|-----------|-------|
| **OpenCode** (primary) | `opencode/` | Full permission enforcement, skill allowlists, agent role files. User chooses: `@ghost` (team routing) or `@nexus` (single-agent). |
| **GitHub Copilot** | `github/` | Mirror of OpenCode agent set. Uses `skills/` (shared) + `github/agents/` (`.agent.md` role files) + `github/instructions/` (shared rules). |
| **GitHub Built-in** | `github_builtin/` | Instruction-first setup for VS Code GitHub Copilot built-in agents. No role files — all behavior from instructions. Mimics Void Protocol roles through prompt routing. OpenCode remains authoritative; report gaps when behavior diverges. |
| **Pi** (weapon of choice) | `pi/SYSTEM.md` | Nexus master prompt for pi.dev. Current preferred agent tool. Responds in Polish (chat), English (code/docs). |
| **OMP** (oh-my-pi) | `omp/SYSTEM.md` | Full copy of pi.dev's Nexus prompt, adapted for oh-my-pi (pi on steroids).  Polish chat default. |

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `opencode/` | OpenCode runtime config, agent definitions (`.md` per agent), shared contract (`AGENTS.md`) |
| `nvim/` | Neovim bootstrap and plugin configuration |
| `opencode/agent/` | Individual agent prompt files (nexus.md, ghost.md, forger.md, etc.) |
| `github/` | GitHub Copilot mirror of agent definitions (agents/, instructions/) |
| `github/agents/` | Per-agent `.agent.md` files for Copilot |
| `github/instructions/` | Shared instruction files (language rules, agent contract, skill policy) |
| `skills/` | Skill definitions — loaded per execution phase (see skills/README.md for routing) |
| `skills/cross-cutting/` | Always available: repo-conventions, delivery-gates, test-strategy, review-rubric, documentalist, agent-governance |
| `skills/per-phase/` | Phase-specific: discovery-scope, architect, planner, coder, devops, tester, reviewer |
| `skills/stack/` | Stack overlays: github-actions, terraform, python, docker, ansible, argocd, cdk-aws, aws-cost-optimizer |
| `skills/datadog/` | Datadog-specific skills (never loaded by default) |
| `skills/terminal-context/` | AWS/K8s context selection (terminal-context-bridge, terminal-context-aws-k8s) |
| `skills/project-memory-hygiene/` | Cross-session memory management |
| `github_builtin/` | GitHub Copilot built-in agents (instruction-first, no role files) — mimics Void Protocol through prompt routing |
| `omp/SYSTEM.md` | Nexus master prompt for OMP (oh-my-pi). Full copy of pi.dev's Nexus, adapted for cloud/OMP. |
| `pi/SYSTEM.md` | Nexus master prompt for pi.dev (weapon of choice). |
| `git/gitconfig` | Git configuration: aliases (gs, whoami), LFS filter, preferences |
| `docs/` | Documentation (skill-structure.md) |
| `media/` | Agent portraits and branding assets |

## Development Commands

This repository contains **no build, test, or lint commands** — it is purely configuration and policy files.

Key operational commands:

```bash
# OpenCode agent delegation (in OpenCode chat):
@ghost "Classify request and route to specialists"
@nexus "Handle end-to-end without delegation"
@forger "Implement feature X"
@d43mon "Update CI/CD workflow"

# Git (aliases from git/gitconfig):
git gs          # Status + diffstat + staged diffstat (compact overview)
git whoami      # Show user.name and user.email from config sources
git config --show-origin --get user.name
git config --show-origin --get user.email

jq -e . opencode/opencode.json
git config --show-origin --list | rg includeIf
nvim --headless "+Lazy! sync" +qa
```

## Code Conventions & Common Patterns

### File conventions
- **Agent files**: `skills/<category>/<name>/SKILL.md` — skill definitions use frontmatter (`name`, `description`, `applyTo`) and Markdown body
- **Agent prompts**: `opencode/agent/<name>.md` and `github/agents/<name>.agent.md` — per-agent system prompts
- **Instructions**: `github/instructions/<name>.instructions.md` — shared rules with frontmatter (`name`, `description`, `applyTo`)
- **Config**: `opencode/opencode.json` — JSON with `$schema`, `plugin`, `provider` sections
- **Agent files (OpenCode)**: `opencode/agent/<name>.md` — YAML with `model`, `description`, and mode/tooling metadata
- **Agent files (GitHub Copilot)**: `github/agents/<name>.agent.md` — extended YAML (`name`, `model`, `description`, `tools`, `agents`, invocability flags)

### Directory boundary rule
- Keep directory responsibilities isolated (`git/`, `nvim/`, `opencode/`, `github/`, `skills/`) unless the task explicitly requires cross-platform synchronization.
- If synchronization is required, keep intent and role boundaries equivalent across all affected platforms.

### Cross-platform synchronization checklist (for equivalent roles):
- Update role intent and boundaries in both supported variants:
  - `opencode/agent/<role>.md`
  - `github/agents/<role>.agent.md`
- Keep routing semantics equivalent even if syntax differs per platform.
- Verify referenced subagents exist in the target platform before adding them to metadata.
- Re-check role ownership after any routing change.
- If workflow-local GitHub Actions guidance is implemented as a skill instead of a child agent, keep ownership, approval gates, and rollout/rollback expectations inside `devops-specialist` across all supported variants.
- If internal specialists are added under `devops-specialist`, verify that `lead` still routes only to `devops-specialist` and that child specialists exist on both supported platforms.
- For any new internal DevOps subdomain specialist, keep risk tiering, approval gates, rollout/rollback expectations, and final ownership in `devops-specialist` rather than duplicating or migrating those policies into the child agent.
- For DevOps-oriented agents, prefer MCP-backed tools when they materially improve the task, but do not assume MCP availability; require clear fallback behavior and avoid embedding server-specific startup instructions in global guidance.
- For `nexus`, keep the standalone-exception semantics aligned across `opencode/agent/nexus.md` and `github/agents/nexus.agent.md`; if GitHub Copilot lags OpenCode in hard enforcement, document the difference explicitly and treat OpenCode as authoritative.

### Agent contract (shared across all agents)
- **Language**: English for communication, code comments, and docs. Chat defaults may vary by agent (Nexus → Polish)
- **Communication guardrails**: No enthusiasm inflation, no hedging phrases, no performative narration, no filler transitions
- **Core principles**: Discover conventions first, follow existing patterns, keep changes minimal/reversible, surface assumptions explicitly
- **Approval triggers**: API changes, schema/migrations, new deps, auth/IAM/secrets, prod behavior changes, irreversible changes, unclear risk
- **Fast-path**: Proceed without approval only when scope is clear, risk is Low, rollback is straightforward, no protected surfaces touched
- **Protected surfaces**: `.github/workflows/`, `infra/`, `terraform/`, `terragrunt/`, `helm/`, `k8s/`, `migrations/`, agent governance artifacts (`skills/`, `github/agents/`, `opencode/agent/`, `github/instructions/`)

### 7-phase execution model
1. **Discovery & Scope** — Acceptance criteria, scope boundaries, edge cases
2. **Architecture** — Options with trade-offs, interface/trust boundaries
3. **Planning** — Phased rollout, validation gates, rollback paths
4. **Implementation (App)** — Minimal change, security impact surfaced
5. **Implementation (DevOps)** — Blast radius, source of truth first
6. **Testing** — Happy/error/edge/security paths
7. **Final Review** — Read-only self-critique, security pass, verdict

### Skill loading protocol
1. Read `skills/README.md` to identify the correct per-phase skill
2. Load that skill (and relevant stack overlays for DevOps work)
3. Cross-cutting skills loaded when scope matches — not all at once
4. Datadog skills never loaded by default

### Python environment discipline
- Always create or activate a virtual environment before using Python
- All Python commands and package installations run inside the active venv

## Important Files

| File | Role |
|------|------|
| `opencode/opencode.json` | OpenCode runtime config: providers (LM Studio local/remote, Google), models, plugins |
| `opencode/AGENTS.md` | Shared Agent Contract — rules applying to all agents (communication, principles, approval gates) |
| `opencode/README.md` | Void Protocol team roster, agent routing, usage examples |
| `skills/README.md` | Skills index — directory layout and phase-to-skill mapping |
| `github/README.md` | GitHub Copilot mirror: team, routing, workspace settings note |
| `github/instructions/shared-agent-contract.instructions.md` | Copilot-specific shared contract (mirrors opencode/AGENTS.md) |
| `github_builtin/AGENTS.md` | GitHub Built-in profile: instruction-first setup, platform status notes |
| `github_builtin/instructions/agent-contract.instructions.md` | Routing, ownership, risk gates for built-in agents |
| `github_builtin/instructions/general.instructions.md` | Language/communication rules for built-in agents (chat defaults to Polish) |
| `github_builtin/instructions/skill-policy.instructions.md` | Skill selection policy for built-in agents |
| `omp/SYSTEM.md` | Full Nexus master prompt for OMP (oh-my-pi). Adapted copy of pi.dev. |
| `pi/SYSTEM.md` | Full Nexus master prompt for pi.dev (weapon of choice). |
| `git/gitconfig` | Git aliases, LFS filter, preferences |
| `git/gitconfig.huuuge` | Context-specific Git identity/profile configuration. |
| `git/gitconfig.priv` | Private Git identity/profile configuration. |
| `nvim/init.lua` | Neovim bootstrap entrypoint. |
| `nvim/lua/config/lazy.lua` | Neovim plugin manager bootstrap/config. |

## Risk and Routing

Classify work before implementation and route ownership accordingly:
- `App`: application code changes.
- `DevOps`: CI/CD, IaC, deployment automation, IAM/secrets automation.
- `Mixed`: explicit app/devops interface split is required.

Ownership defaults:
- App implementation stays with app-focused agents.
- CI/CD, IaC, deploy automation, pipeline IAM, and secret automation stay with DevOps-focused agents.
- Mixed work requires explicit ownership split and interface definition.

## Runtime/Tooling Preferences

- **OpenCode**: Primary runtime. Config at `opencode/opencode.json`. User chooses: `@ghost` (team routing) or `@nexus` (single-agent).
- **GitHub Copilot**: Mirror agent definitions at `github/`. Workspace settings in `.vscode/settings.json` (not committed — approximates OpenCode terminal permissions).
- **GitHub Built-in**: Instruction-first setup for VS Code GitHub Copilot built-in agents. No role files — behavior from `github_builtin/instructions/`. OpenCode remains authoritative for hard permissions; report gaps when behavior diverges.
- **Pi** (weapon of choice): Nexus master prompt at `pi/SYSTEM.md`. Responds in Polish (chat), English (code/docs).
- **OMP** (oh-my-pi): Nexus master prompt at `omp/SYSTEM.md`. Full copy of pi.dev's Nexus, adapted for oh-my-pi (pi on steroids). Polish chat default.
- **Git**: Aliases defined in `git/gitconfig`. LFS enabled for binary assets. Default branch: `master`
- **Platform**: macOS. Some OpenCode model endpoints depend on local or network-available services (e.g., local/remote LM Studio hosts).
- **AWS/Kubernetes**: credentials/profile-context mismatches are a common source of failures.
- **Context-mode**: MCP tools available (ctx_execute, ctx_search, ctx_index, etc.) for large-output derive-and-summarize workflows. Prefer over native read/grep/shell for outputs exceeding ~20 lines

## Testing & QA

No test framework or test suite exists in this repository. Validation is performed through:

- **Agent governance validation** (`agent-governance` skill): Frontmatter/schema consistency, permission/tool alignment, routing/ownership/parity checks
- **Phase-level validation gates**: Each phase has explicit pass/fail criteria
- **Final review** (Phase 7): Read-only security pass, acceptance criterion verification, verdict (`APPROVED` or `CHANGES REQUIRED`)
- **Iteration protocol**: Max 3 review cycles; failures escalate to user

When modifying agent definitions, instructions, skills, or runtime config:
1. Run `agent-governance` as mandatory validation
2. Check frontmatter/schema consistency (where applicable)
3. Verify permission/tool alignment
4. Validate routing, ownership, exception logic, and parity
5. Report explicit parity status — any mismatch is `Blocking`

## Documentation Strategy

- **Link, do not embed**: keep AGENTS.md high-signal and point to source files for details.
- Put role-specific operational details in role files, not in this global guide.
- Put tool-specific behavior in skill/plugin files, then link them from this document.
