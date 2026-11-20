---
name: github-create-pr
description: Draft a GitHub pull request title and description, or open a ready or draft PR from a published branch using gh. Use for requests to prepare PR text or create a pull request.
---

# GitHub Pull Requests

## Select the outcome

- **PR text only:** return the proposed title and Markdown body. Use local evidence and any authorized reads; do not publish or invoke `gh pr create --dry-run`, which can still push.
- **Open a PR:** publish only when the user explicitly requests it, the target and scope are clear, and the active profile permits it. A GitHub draft PR is still a remote write. Use draft mode when requested or required by the repository. This skill does not stage, commit, rebase, push, fork, merge, or enable auto-merge. Handle any separately authorized branch preparation before following the publication steps.

## Write for the reviewer

Inspect the intended base-to-head diff and commits. For text-only work that includes unpublished changes, state that the draft covers the local changes. For publication, use only the commits on the verified remote head; do not describe pending local edits as part of the PR.

Follow the target repository's PR title conventions and applicable [PR template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository). Check `.github/`, the root, and `docs/` for `pull_request_template.md` or `PULL_REQUEST_TEMPLATE/`. Preserve required sections and complete the checklist from evidence. If there is no template, use a concise, action-oriented title and these sections:

- **Why:** the problem and expected outcome.
- **What:** reviewer-relevant changes and scope, grouped by behavior.
- **Validation:** checks actually run, with results and meaningful gaps. Distinguish failed, skipped, and pending checks.
- **Risks & rollout:** include only when risk, migration, rollout, or rollback warrants a note.
- **References:** link relevant issues, including Jira when provided. Use `Fixes` or `Closes` only when closing the linked GitHub issue on merge is intended.

Keep secrets and internal-only references out of destinations that should not receive them. Add screenshots, reviewers, labels, or other metadata only when requested or required by project policy and within scope.

## Publish and verify

1. **Resolve the target.** Confirm the host, repository, base branch, and head repository and branch from the request or project policy. Use `gh repo view "$repo" --json nameWithOwner,defaultBranchRef` if the repository default is needed; do not assume `main`. Check the active account with `gh auth status --hostname "$host" --active`, without exposing tokens. If the target or account cannot be confirmed, stop and return the PR text.
2. **Confirm the published diff.** Compare the intended commit to the remote head and review the diff for the chosen base. If the head is absent, stale, or contains unrelated changes, stop rather than pushing. If opening the PR triggers deployment or another side effect that requires separate approval, verify that approval before proceeding. Look for an existing open PR using `gh pr list --repo "$repo" --base "$base" --head "$head_branch" --state open --json url,headRepositoryOwner,headRepository,headRefOid`. Use the unqualified branch in `--head` for the lookup; verify the source repository when forks may share the branch name. Return an existing matching PR rather than creating or editing it.
3. **Submit once.** Use `[HOST/]OWNER/REPO` for `repo` and the verified branch for `head`. For a supported personal fork, use `owner:branch` for `head` and add `--no-maintainer-edit` unless maintainer edits are authorized. GitHub CLI does not support an organization owner in this `--head` syntax; report the limitation instead of selecting another head. Add `--draft` only for the draft PR outcome. Pass the body as data, not shell code:

   ```sh
   printf '%s\n' "$body" | gh pr create --repo "$repo" --base "$base" --head "$head" --title "$title" --body-file -
   ```

4. **Read back by URL.** Run `gh pr view "$pr_url" --repo "$repo" --json url,title,body,baseRefName,headRefName,headRepositoryOwner,headRepository,headRefOid,isDraft`. Verify the title, body, source repository, refs, published commit, and draft state. If creation times out or the outcome is unclear, look for the matching PR by target, head repository and branch, base, and recent creation time. An empty result alone does not establish failure. Report uncertainty rather than retrying until the outcome is known; a returned PR URL already identifies the PR even if later verification fails.

Return the verified PR link, title, base and head, and draft state. If publication is blocked or the user requested text only, return the prepared title and body with any blocker. Do not report CI as passed based on creation or read-back.

CLI reference: [GitHub CLI: `gh pr create`](https://cli.github.com/manual/gh_pr_create).
