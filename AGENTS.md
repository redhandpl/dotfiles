# Repository Guidelines

## Project Overview

This repository contains dotfiles, OMP profiles, and reusable skills. It has no application source code.

## Active profiles

- **Default — Tadzio:** [`omp/APPEND_SYSTEM.md`](omp/APPEND_SYSTEM.md) supplements OMP's native guidance. Tadzio owns scope, approvals, integration, validation, and final review. Bounded OMP helpers receive the explicit contract defined in the profile.
- **CAD — Basia:** [`omp/profiles/cad-build123d/APPEND_SYSTEM.md`](omp/profiles/cad-build123d/APPEND_SYSTEM.md) is the only maintained CAD profile. Select it as an opt-in OMP append prompt for build123d with `ocp_viewer`.
- [`omp/SYSTEM.md`](omp/SYSTEM.md) is the original single-executor reference. See the [README](README.md) for supported profile selection.

## Key directories

| Directory | Purpose |
|---|---|
| [`omp/`](omp/) | Current OMP profiles and themes |
| [`skills/`](skills/README.md) | Cross-cutting, phase, and stack guidance; also contains terminal-context and project-memory skills |
| [`deprecated/`](deprecated/) | Historical OpenCode, GitHub Copilot, GitHub Built-in, and Pi configurations |
| [`git/`](git/) | Git aliases, LFS, and identity profiles |
| [`nvim/`](nvim/) | Neovim bootstrap and plugin configuration |

Preserve `deprecated/` and other historical artifacts unless the task explicitly targets them. They are outside active routing, skill discovery, and parity checks.

## Development Commands

This repository contains **no build, test, or lint commands** — it is purely configuration and policy files.

Key operational commands:

```bash
# Git (aliases from git/gitconfig):
git gs          # Status + diffstat + staged diffstat (compact overview)
git whoami      # Show user.name and user.email from config sources
git config --show-origin --get user.name
git config --show-origin --get user.email

git config --show-origin --list | rg includeIf
nvim --headless "+Lazy! sync" +qa
```

## Repository conventions

- Write code, comments, and documentation in English. Follow the active profile for chat language.
- Discover existing conventions first. Keep changes minimal and reversible; state material assumptions and risks.
- Skill files live under `skills/` with a `SKILL.md` containing `name` and `description` frontmatter and a Markdown body. See the [skill index](skills/README.md) for task, phase, and stack selection. Load matching skills through OMP discovery; use Datadog guidance only for explicit Datadog tasks.
- A one-off prompt selection does not authorize edits to shared prompts or persistent runtime settings.

## Risk and approval

- Follow the active profile's task modes and phase gates. Obtain explicit approval for public interfaces, schemas or migrations, new dependencies, auth/IAM/secrets, production changes, irreversible actions, protected surfaces, and unclear risk or scope. `Fast-path` is limited to clear, low-risk, reversible work off protected surfaces.
- Protected surfaces include `.github/workflows/`, `infra/`, `terraform/`, `terragrunt/`, `helm/`, `k8s/`, `migrations/`, auth/IAM/secrets/deployment paths, agent prompts and configuration, `skills/`, `.github/agents/`, `.github/instructions/`, and archived agent configurations under `deprecated/`.
- Classify work as `App`, `DevOps`, `Mixed`, or `Policy/Docs`. For `Mixed`, define the App/DevOps interface and ownership before edits. Stack skills guide execution; the active profile retains approval and verification ownership.

### Python environment discipline

- Always create or activate a virtual environment before using Python
- All Python commands and package installations run inside the active venv

## Runtime/Tooling Preferences

- **Git**: Aliases defined in `git/gitconfig`. LFS enabled for binary assets. Default branch: `master`
- **Platform:** macOS.
- **AWS/Kubernetes:** use the terminal-context skills to verify the target before running environment-dependent commands.
- **MCP:** prefer a suitable MCP tool when it materially improves the task. Respect availability and permissions; keep a clear fallback.
- **Context-mode**: MCP tools available (ctx_execute, ctx_search, ctx_index, etc.) for large-output derive-and-summarize workflows. Prefer over native read/grep/shell for outputs exceeding ~20 lines

## Testing & QA

No test framework or test suite exists in this repository. Validation is performed through:

- **Agent governance:** load [`agent-governance`](skills/cross-cutting/agent-governance/SKILL.md) when changing profiles, skills, instructions, or runtime settings. Check schema where applicable, permissions, routing, ownership, and parity between maintained profiles that share a contract. A mismatch in a maintained contract blocks delivery.
- **Phase-level validation gates**: Each phase has explicit pass/fail criteria
- **Final review** (Phase 7): Read-only security pass, acceptance criterion verification, verdict (`APPROVED` or `CHANGES REQUIRED`)
- **Iteration protocol**: Max 3 review cycles; failures escalate to user

## Documentation Strategy

- **Link, do not embed**: keep AGENTS.md high-signal and point to source files for details.
- Put role-specific operational details in role files, not in this global guide.
- Put tool-specific behavior in skill/plugin files, then link them from this document.
