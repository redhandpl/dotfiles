# Project Guidelines

## Scope
This repository stores personal development environment configuration (dotfiles), not application runtime code.

Primary areas:
- Git configuration and identity switching
- Neovim configuration
- AI agent definitions and role boundaries across OpenCode and GitHub Copilot artifacts
- OpenCode settings and plugins

Cursor artifacts may still exist in the repository for historical reference, but they are out of support and should not receive routine updates.

## Build and Test
There is no project-wide build/test pipeline in this repository.

Validation should be change-scoped:
- For Git config changes, validate with git config queries, includeIf resolution, and local git commands (for example, identity checks).
- For Neovim changes, validate by loading Neovim and checking plugin/config behavior.
- For agent definition changes (OpenCode/GitHub artifacts), validate frontmatter/schema consistency, tool permissions, role routing logic, and documented exception semantics.
- For OpenCode settings/plugins changes, validate JSON schema compatibility and plugin identifier correctness.

Quick validation commands (run only those relevant to your change):
- `git config --show-origin --get user.name`
- `git config --show-origin --get user.email`
- `git config --show-origin --list | rg includeIf`
- `git whoami`
- `nvim --headless "+Lazy! sync" +qa`
- `jq -e . opencode/opencode.json`

## Architecture
Top-level boundaries:
- git/: Git global and context-specific configuration
- nvim/: Neovim bootstrap and plugins
- opencode/: OpenCode agents, settings, and plugins
- github/agents/: VS Code Copilot agent artifacts for provisioning

Do not mix responsibilities between directories unless the task explicitly requires cross-platform synchronization.
If synchronization is required, keep intent and role boundaries equivalent across all affected agent platforms.

## Conventions
- Preserve deterministic role boundaries across agent definitions:
  - lead orchestrates
  - architect is design-only
  - planner owns implementation planning: phases, affected areas, dependencies, validation, and escalation points; no requirements, architecture decisions, or micro-task decomposition
  - big-pickle-simple-tasks decomposes large/ambiguous initiatives into executable sequences
  - coder implements app-code only
  - devops-specialist owns CI/CD, IaC, deployment automation, IAM/secrets automation, including GitHub Actions-local workflow work
  - github-actions is the shared skill used by devops-specialist for GitHub Actions-local workflow work
  - terminal-context-bridge is the public skill that decides when to use private or local AWS/Kubernetes context overlays such as terminal-context-aws-k8s
  - lead never routes GitHub Actions-local work to a separate specialist; such work stays under devops-specialist ownership
  - any future `*-specialist` or other internal DevOps subdomain agent remains a child of devops-specialist; never add such agents to top-level lead routing or move owner policy out of devops-specialist
  - tester validates and reports evidence
  - code-reviewer is read-only quality gate
  - product-manager clarifies requirements and acceptance criteria
  - nexus is the only official single-agent exception: it is user-invocable, opt-in, runs end-to-end without delegation, and keeps app/devops boundaries explicit internally
- Keep instructions concise and execution-oriented; avoid generic filler.
- Prefer minimal, targeted edits over broad rewrites.
- Preserve existing file style and structure unless explicitly asked to refactor.
- When updating equivalent agent roles in multiple directories, avoid silent drift between platform variants.

Agent schema notes (platform-specific):
- opencode/agent/*.md: YAML with `model`, `description`, and mode/tooling metadata.
- github/agents/*.agent.md: extended YAML (`name`, `model`, `description`, `tools`, `agents`, invocability flags).

Cross-platform synchronization checklist (for equivalent roles):
- Update role intent and boundaries in both supported variants:
  - `opencode/agent/<role>.md`
  - `github/agents/<role>.agent.md`
- Keep routing semantics equivalent even if syntax differs per platform.
- Verify referenced subagents exist in the target platform before adding them to metadata.
- Re-check role ownership in `lead`, `planner`, `coder`, and `devops-specialist` after any routing change.
- If workflow-local GitHub Actions guidance is implemented as a skill instead of a child agent, keep ownership, approval gates, and rollout/rollback expectations inside `devops-specialist` across all supported variants.
- If internal specialists are added under `devops-specialist`, verify that `lead` still routes only to `devops-specialist` and that child specialists exist on both supported platforms.
- For any new internal DevOps subdomain specialist, keep risk tiering, approval gates, rollout/rollback expectations, and final ownership in `devops-specialist` rather than duplicating or migrating those policies into the child agent.
- For DevOps-oriented agents, prefer MCP-backed tools when they materially improve the task, but do not assume MCP availability; require clear fallback behavior and avoid embedding server-specific startup instructions in global guidance.
- For `nexus`, keep the standalone-exception semantics aligned across `opencode/agent/nexus.md` and `github/agents/nexus.agent.md`; if GitHub Copilot lags OpenCode in hard enforcement, document the difference explicitly and treat OpenCode as authoritative.

## Risk and Routing
Before implementation, classify work as App, DevOps, or Mixed and route accordingly.

- Any CI/CD, IaC, deployment automation, pipeline IAM, or secret automation work belongs to devops-specialist scope.
- App-code implementation belongs to coder scope.
- For Mixed tasks, split ownership explicitly.

## Environment Notes
- This workspace is used on macOS.
- Some OpenCode model endpoints depend on local or network-available services (for example local/remote LM Studio hosts).
- For AWS/Kubernetes workflows, credentials/profile-context mismatches are a common source of failures.
- If Python is needed at any stage, use a virtual environment as a hard requirement.
- All Python execution and package installation must happen inside the active virtual environment; do not use the system Python environment for repo work.

## Key Reference Files
- README.md
- git/gitconfig
- git/gitconfig.huuuge
- git/gitconfig.priv
- nvim/init.lua
- nvim/lua/config/lazy.lua
- nvim/lua/plugins/colorscheme.lua
- opencode/opencode.json
- opencode/plugins/opencode-autotitle.js
- opencode/agent/ghost.md
- opencode/agent/weaver.md
- opencode/agent/d43mon.md
- opencode/agent/forger.md
- github/agents/ghost.agent.md
- github/agents/weaver.agent.md
- github/agents/d43mon.agent.md

## Documentation Strategy
- Link, do not embed: keep AGENTS.md high-signal and point to source files for details.
- Put role-specific operational details in role files, not in this global guide.
- Put tool-specific behavior in skill/plugin files, then link them from this document.
