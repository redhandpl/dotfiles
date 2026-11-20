---
name: jira-create-ticket
description: Draft or create a Jira issue from a request, including Polish requests for a ticket or zgłoszenie. Use ACLI for authorized submission; return drafts without Jira access.
---

# Jira Create Ticket

## Decide whether to submit

- **Draft or review only:** return the title, description, and intended fields. Do not invoke ACLI, contact Jira, authenticate, or write a payload file.
- **Create:** an explicit request to create an issue authorizes that submission once the destination and content are clear and the active profile permits it. If the site or project remains ambiguous, ask only for what is missing. Reviewing or editing this skill does not authorize submission.

## Prepare the ticket

Resolve the intended fields once. Use the user's choices first; default to **Major** priority and **DevOps** team for omitted values. Team is a Jira field, not a project key, label, component, or assignee. Preserve the requested issue type, parent, assignee, and other fields. For a generic task, prefer `Task` when the target project supports it. Add sprint assignment only if requested.

Use the requested language or project convention; otherwise use the conversation language. Keep these headings in English. Write a short, action-oriented title and a description with four sections:

```markdown
## Why
The problem, relevant context, and expected benefit.

## What
The scope and relevant systems, environments, or constraints.

## Done when
- An independently checkable acceptance criterion.

## References & findings
- A relevant link or repository finding and what it supports.
```

Keep only evidence relevant to the ticket and appropriate for its destination. Distinguish verified findings from hypotheses. If no supporting material exists, write `No data` under **References & findings**. Ask a focused question if missing context would prevent an actionable ticket.

## Create and verify with ACLI

1. **Preflight.** Locate `acli` on `PATH` or use the executable configured for this workspace. Check `acli jira auth status` and confirm the site and account before submitting. If the CLI or an authenticated session for the target is unavailable, return the draft and state the missing prerequisite. Let the user handle sign-in and installation. Use ACLI for writes; switching transport requires explicit authorization.
2. **Resolve fields.** Confirm the issue type and intended priority against the target project. Resolve the exact Team field ID, the chosen team's ID or allowed value, and the required JSON shape for that site, project, and issue type. Use ACLI or an available read-only Jira metadata tool. If any intended field cannot be set as requested, stop before submission; report the field and its limitation. Do not substitute another value.
3. **Build the payload.** Use the [ACLI create reference](https://developer.atlassian.com/cloud/acli/reference/commands/jira-workitem-create/) and `acli jira workitem create --help`. If a template is needed, run `acli jira workitem create --generate-json` from `tmp/<task-id>/` in the task repository; inspect the generated file or stdout as supported by that ACLI version. Keep both the template and serialized payload under that directory, and clean up task-owned files under the active profile's artifact rules. For a verified schema with top-level `projectKey`, `type`, `summary`, ADF `description`, and `additionalAttributes`, put the resolved priority and Team field in `additionalAttributes`. Encode the description as ADF headings, paragraphs, lists, and link marks; do not put Markdown in an ADF object. Verify the destination and all intended fields in the payload before sending it.
4. **Submit once.** Run `acli jira workitem create --from-json "$payload" --json`, with `payload` set to the absolute path of the verified file. Save the returned issue key. On a timeout or uncertain result, search the target project by recent creation time, creator, and summary; compare the exact summary and scope in the results. No match alone is insufficient to conclude creation failed. Report uncertainty when the write outcome is unresolved, and retry only when confirmed that no issue was created.
5. **Read back.** Run `acli jira workitem view "$issue_key" --fields "summary,issuetype,description,priority,$team_field_id" --json`, adding fields for any other requested attributes. Verify the four sections, links or `No data`, and the intended field values, including user overrides. Compare canonical IDs when Jira returns those instead of names. If a field is wrong, correct only the existing issue when the correction is within the approved scope and supported by ACLI. A returned key already confirms creation; verification failure never warrants creating another issue.

## Report the result

For a verified submission, return the clickable Jira issue key, summary, priority, and team. If creation succeeded but verification is incomplete, return the key and identify the unverified fields. For a draft or blocked submission, return the draft and state why it has not been submitted.
