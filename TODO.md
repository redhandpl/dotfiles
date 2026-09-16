# TODO

## Runtime and dependency hygiene

- [ ] Pin all OpenCode plugins to exact versions or commit hashes; document the update process in `opencode/opencode.json`.
- [ ] Make `git/gitconfig` portable by replacing user-specific absolute include and excludes paths with an explicit install-time configuration step or supported home-relative paths.

## OMP documentation

- [ ] Document that `omp/APPEND_SYSTEM.md` is a symlink to `../pi/SYSTEM.md` and confirm the OMP runtime consumes the symlinked append prompt.

## Repository cleanup

- [ ] Remove the unused `sessionId` parameter from `generateAITitle` in `opencode/plugins/opencode-autotitle.js`.
- [ ] Decide whether the intentional `console.error` calls in `opencode/plugins/opencode-autotitle.js` should be documented or exempted from the no-console rule.
- [ ] Expand the top-level `README.md` with a concise runtime map, installation notes, and validation commands.
