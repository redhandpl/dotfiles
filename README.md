# dotfiles
My awesome dotfiles!

## OMP: Tadzio append profile

[`omp/APPEND_SYSTEM.md`](omp/APPEND_SYSTEM.md) is the primary agent profile. Tadzio owns the work end to end, can assign bounded tasks to OMP helpers, and uses Polish chat while retaining OMP's built-in tool guidance. [`omp/SYSTEM.md`](omp/SYSTEM.md) is retained as the original single-executor reference.

From this repository, select the profile for one invocation without changing persistent configuration:

```sh
omp --system-prompt "" --append-system-prompt ./omp/APPEND_SYSTEM.md
```

The empty `--system-prompt` suppresses discovered `SYSTEM.md` and `SYSTEM_TEMPLATE.md` replacements. For automatic discovery, install only `APPEND_SYSTEM.md` in the target project's `.omp/` or the active OMP user configuration directory; an active custom `SYSTEM.md` or `SYSTEM_TEMPLATE.md` still replaces the built-in instruction block.

The append profile defines the App/DevOps handoff, approval gates, validation, and temporary-file rules. It uses OMP's native discovery to load the relevant [skills](skills/README.md).

Safety and delegation constraints are prompt-level unless host enforcement is confirmed. The append does not change tool permissions or automatically propagate its rules to children.

### Delegating safely

Task subagents do not automatically inherit the parent's `APPEND_SYSTEM.md` or `AGENTS.md`. Before every spawn, Tadzio must explicitly send the applicable rules and the approved scope:

- Batch mode: place the self-contained shared goal and contract in `task.context`; OMP renders it in the child's system prompt under `§ Context`.
- Each `tasks[].task`: specify the target, non-goals, allowed mutations or read-only status, acceptance criteria, evidence, and hand-off. OMP sends it as the child's user assignment.
- Single-task mode without shared context: prepend the same contract to the task text. Other helper entry points require equivalent explicit startup instructions.

Inline the relevant safety/trust rules, approval gates and status, protected surfaces, language defaults, workspace/worktree boundaries, and temporary-artifact rules. Do not send only a path to the parent prompt. Refresh the contract and approval scope when reusing or resuming a helper for changed work. Children must return scope/risk changes or missing approvals to Tadzio, never broaden their assignment or spawn more workers. Tadzio retains integration, final behavior checks, and the delivery verdict.

Source: [`task/index.ts`](https://github.com/can1357/oh-my-pi/blob/7414b7c919b59dd14db354a8f6b9164426237dff/packages/coding-agent/src/task/index.ts#L308-L322), [`task/executor.ts`](https://github.com/can1357/oh-my-pi/blob/7414b7c919b59dd14db354a8f6b9164426237dff/packages/coding-agent/src/task/executor.ts#L3787-L3820), and [session input inheritance](https://github.com/can1357/oh-my-pi/blob/7414b7c919b59dd14db354a8f6b9164426237dff/docs/system-prompt-customization.md#inputs-by-session-type).

Source contract: [OMP prompt customization](https://github.com/can1357/oh-my-pi/blob/7414b7c919b59dd14db354a8f6b9164426237dff/docs/system-prompt-customization.md) and the [bundled prompt templates](https://github.com/can1357/oh-my-pi/tree/7414b7c919b59dd14db354a8f6b9164426237dff/packages/coding-agent/src/prompts/system), pinned to `7414b7c`.

## OMP: CAD Designer profile (build123d)

[`omp/profiles/cad-build123d/APPEND_SYSTEM.md`](omp/profiles/cad-build123d/APPEND_SYSTEM.md) is an opt-in append profile for Python/build123d and standalone `ocp_viewer`. For requests that call for a 3D result, Basia works through a reviewable draft by default; an explicit request to stop earlier or require drawing approval takes precedence. Existing and purchased-part dimensions and critical engineering choices still require verified inputs or explicit delegation. The named model revision requires engineer approval before final STL/STEP exports, and geometric validation does not establish physical fit or strength.

From the repository root, select this append profile instead of Tadzio for one invocation:

```sh
omp --system-prompt "" --append-system-prompt ./omp/profiles/cad-build123d/APPEND_SYSTEM.md
```

Basia maintains the project's authoritative documentation and direct consumers within the approved scope, distinguishes working artifacts from published deliverables, and records validation and physical-test limitations.

This is the only maintained CAD profile in OMP. Its safety and approval rules are prompt-level unless host enforcement is verified.

## Historical agent profiles

[`deprecated/`](deprecated/) preserves the former [OpenCode](deprecated/opencode/), [GitHub Copilot](deprecated/github/), [GitHub Built-in](deprecated/github_builtin/), and [Pi](deprecated/pi/) setups for reference. They are outside active routing and maintenance. The current OMP profiles and skills do not require them.

## Ghostty: Monokai redhand

[`ghostty/themes/Monokai redhand`](ghostty/themes/Monokai%20redhand) restores the theme from [`ghostty/iterm_monokai_redhand.itermcolors`](ghostty/iterm_monokai_redhand.itermcolors). Display P3 colors are converted to sRGB, with out-of-gamut channels clipped. It includes all 16 ANSI colors, background/foreground, bold text, cursor, selection, and search-match background.

From this repository, install it outside the application bundle so Ghostty updates do not replace it:

```sh
mkdir -p "$HOME/.config/ghostty/themes"
ln -s "$PWD/ghostty/themes/Monokai redhand" "$HOME/.config/ghostty/themes/Monokai redhand"
```

Keep the checkout at the linked path, or copy the theme instead. In `~/.config/ghostty/config`, use:

```ini
theme = Monokai redhand
```

Reload Ghostty's configuration or restart the application. iTerm-only interface colors (badge, cursor guide, IME cursor, link, active-pane border, and tab tint) are not mapped.

## Oh My Posh: Takuya Unicorn

[`oh-my-posh/takuya-unicorn.omp.json`](oh-my-posh/takuya-unicorn.omp.json) combines the Takuya layout with Unicorn colors, an Apple icon, and command execution time beside the clock. A Nerd Font is required for the icons.

To use it with a checkout at `~/Projects/OWN/GIT/dotfiles`, initialize Oh My Posh in `~/.zshrc`:

```zsh
eval "$(oh-my-posh init zsh --strict --config "$HOME/Projects/OWN/GIT/dotfiles/oh-my-posh/takuya-unicorn.omp.json")"
```

Adjust the path for a different checkout location and start a new shell.

For Herdr's Gruvbox theme, replace `takuya-unicorn.omp.json` in the command with [`takuya-herdr.omp.json`](oh-my-posh/takuya-herdr.omp.json). It keeps the same layout with terminal and folder icons, shortens paths deeper than three folders, and displays the active Python virtual environment.

In this theme, a green Git segment with `↑N` indicates commits ahead of the configured upstream. Green with `?` means no upstream is configured, so the push status is unknown. Local working or staged changes take precedence in the segment color.

## Herdr App: Takuya Vivid

[`herdr-app/themes/takuya-vivid.json`](herdr-app/themes/takuya-vivid.json) pairs the Takuya Herdr prompt with brighter blue, green, pink, and gold accents.

Copy the file to `~/.config/herdr-app/themes/takuya-vivid.json`, then select `takuya-vivid` in Herdr App's theme picker. A layout may override individual colors.

## Neovim and OMP: Takuya Vivid

The Neovim [`monokai-pro` configuration](nvim/lua/plugins/colorscheme.lua) uses the Takuya Vivid palette with its existing syntax and plugin highlights. Restart Neovim after updating the configuration; restoring the previous palette requires removing its `override_palette` setting.

The matching [OMP theme](omp/themes/takuya-vivid.json) uses the same colors and ANSI palette as Herdr App. From the repository root, install it for the default OMP profile:

```sh
mkdir -p "$HOME/.omp/agent/themes"
cp omp/themes/takuya-vivid.json "$HOME/.omp/agent/themes/takuya-vivid.json"
```

In OMP, choose `takuya-vivid` under **Settings → Appearance → Dark Theme**. Named profiles use their own `~/.omp/profiles/<name>/agent/themes` directory. Select the previous dark theme to revert. OMP does not change the terminal palette; configure the terminal separately.

## bat: Takuya Vivid

[`bat/themes/Takuya Vivid.tmTheme`](bat/themes/Takuya%20Vivid.tmTheme) uses the same palette for syntax highlighting, including pink inline code and green underlined link destinations in Markdown. From the repository root, install and rebuild bat's theme cache:

```sh
mkdir -p "$(bat --config-dir)/themes"
cp "bat/themes/Takuya Vivid.tmTheme" "$(bat --config-dir)/themes/"
bat cache --build
bat --theme="Takuya Vivid" README.md
```

To select it by default, set `--theme="Takuya Vivid"` in the file shown by `bat --config-file`, replacing any existing `--theme` option. To revert, restore the previous option and rebuild the cache if the theme file is removed.

## K9s: Takuya Vivid

[`k9s/skins/takuya-vivid.yaml`](k9s/skins/takuya-vivid.yaml) matches the OMP, bat, and Herdr App palettes, including colors for resource status, YAML, logs, and selected rows. Selected table rows use dark text for contrast against status-colored backgrounds. On macOS, install or update it from the repository root:

```sh
mkdir -p "$HOME/Library/Application Support/k9s/skins"
cp k9s/skins/takuya-vivid.yaml "$HOME/Library/Application Support/k9s/skins/"
K9S_SKIN=takuya-vivid k9s
```

If K9s uses a different configuration directory, copy the file to the `Skins` path shown by `k9s info`. For a persistent selection, set `k9s.ui.skin: takuya-vivid` in the existing K9s `config.yaml`; context-specific skin settings or `K9S_SKIN` can override it. Restore the previous setting to revert.

## Oh My Posh and Herdr: Monokai redhand

[`oh-my-posh/takuya-monokai-redhand.omp.json`](oh-my-posh/takuya-monokai-redhand.omp.json) keeps the Takuya Herdr layout and uses the Ghostty Monokai redhand palette. Select it with the Oh My Posh initialization command above, replacing the theme filename.

For the separate Herdr terminal application, set `name = "terminal"` in the existing `[theme]` section of `~/.config/herdr/config.toml` and remove any `[theme.custom]` overrides, leaving other settings intact. Reload with `herdr server reload-config`. This follows the active terminal palette; use Ghostty's Monokai redhand theme for the colors described here.
