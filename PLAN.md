# Plan: Expand the Top-Level README

## Task Assessment

- **Domain:** Mixed documentation — the README will describe multiple runtimes and supporting Git/Neovim configuration.
- **Complexity:** Low.
- **Criticality:** Low.
- **Task mode:** Read-only planning completed; implementation is a separate step.
- **Approval:** Not required. The change is limited to documentation and introduces no dependencies or runtime behavior changes.

## Discovery Findings

- The top-level `README.md` currently contains only a short title and description.
- Detailed runtime and routing information already exists in:
  - `AGENTS.md` — repository architecture and operational commands,
  - `opencode/README.md` — OpenCode runtime,
  - `github/README.md` — GitHub Copilot runtime,
  - `github_builtin/AGENTS.md` — GitHub Built-in profile,
  - `opencode/opencode.json` — OpenCode configuration,
  - `nvim/init.lua` and `nvim/lua/config/lazy.lua` — Neovim setup,
  - `git/gitconfig` — Git configuration.
- The repository has no universal installer, build system, test suite, or lint command.
- `git/gitconfig` contains machine-specific absolute paths and identity-related settings. The README must warn users to review it before inclusion.
- `omp/APPEND_SYSTEM.md` is a symlink to `../pi/SYSTEM.md` and should be documented and validated.
- The working tree contains unrelated changes. The implementation must preserve them.

## Scope Contract

### In scope

- Expand only the top-level `README.md`.
- Add a concise runtime map.
- Add installation and prerequisite notes based on the current repository state.
- Add copyable validation commands.
- Link to authoritative runtime-specific documentation instead of duplicating it.

### Out of scope

- Runtime configuration changes.
- New installation scripts or dependencies.
- Making `git/gitconfig` portable.
- Synchronizing the README with every agent definition.
- Changes to `README.md` in `github/` or `opencode/`.

### Deferred

- Marking the related checkbox in `TODO.md` until the README change and validation pass.
- Portable Git configuration remains a separate TODO item.

## Implementation Plan

1. **Add an overview.**
   - Explain that the repository contains Void Protocol runtime profiles, shared skills, and supporting dotfiles.
   - Keep the text concise and in English.

2. **Add `Runtime map`.**
   Include a table covering:
   - OpenCode — `opencode/`, authoritative hard permissions and skill configuration.
   - GitHub Copilot — `github/`, agent and instruction mirror.
   - GitHub Built-in — `github_builtin/`, instruction-first profile.
   - Pi — `pi/SYSTEM.md`, standalone Nexus runtime.
   - OMP — `omp/SYSTEM.md` and `omp/APPEND_SYSTEM.md`.
   - Shared skills — `skills/`.
   - Supporting configuration — `git/` and `nvim/`.

3. **Add `Installation`.**
   - Show the repository clone step.
   - Explain that runtime profiles are installed selectively through symlinks or copies into the target runtime’s expected configuration directory.
   - Document the known Neovim configuration path: `~/.config/nvim`.
   - Tell users to review `git/gitconfig` before including it globally because it contains machine-specific paths and user settings.
   - State that no universal bootstrap script is currently provided.

4. **Add `Validation`.**
   Document the smallest useful checks:

   ```bash
   git diff --check
   jq -e . opencode/opencode.json
   test -L omp/APPEND_SYSTEM.md
   test "$(readlink omp/APPEND_SYSTEM.md)" = "../pi/SYSTEM.md"
   nvim --headless "+Lazy! sync" +qa
   git config --show-origin --list | rg includeIf
   ```

   Mark the Neovim command as requiring an available Neovim installation and network access.

5. **Review links and scope.**
   - Verify every new relative link points to an existing tracked file or directory.
   - Confirm that only the requested top-level documentation is changed.
   - Mark the `README.md` item in `TODO.md` complete only after validation succeeds.

## Acceptance Criteria

- Given the repository root, when a reader opens `README.md`, then all five runtime profiles and the shared/supporting configuration paths are visible in one concise map.
- Given a fresh clone, when a reader follows the installation notes, then prerequisites, selective setup, and machine-specific Git limitations are clear.
- Given a configured checkout, when a reader runs the listed validation commands, then each command maps to an existing repository configuration or documented runtime behavior.
- Given the implementation diff, when `git diff --check` runs, then it passes and unrelated working-tree changes remain untouched.
- Given the completed task, when the related TODO item is reviewed, then it is marked complete only after the README validation passes.

## Validation Gates

- `git diff --check` passes.
- `jq -e . opencode/opencode.json` passes.
- The OMP append-prompt symlink target is correct.
- Relative README links resolve to existing repository paths.
- The final diff contains the intended README changes and no unrelated edits.

## Rollback

Revert the README-only patch or the commit containing it. Avoid blanket restore commands if another change has subsequently modified `README.md`.

## Phase Status

- **Discovery & Scope:** completed.
- **Architecture:** skipped; no architectural decision is required.
- **Planning:** completed in this file.
- **App/DevOps implementation:** pending explicit implementation request.
- **Testing:** pending implementation; validation commands are defined above.
- **Final review:** pending implementation and validation.
