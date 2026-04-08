---
name: review-rubric
description: Shared rubric for high-signal, evidence-based final review.
---

# Review Rubric

Use this skill for read-only review before commit, push, or merge.

## Verdict model
- `APPROVED`
- `CHANGES REQUIRED`

## Severity model
- `Blocking`: must be fixed before merge.
- `Non-blocking`: useful improvement, but not merge-blocking.

## Review rules
- Review only the delegated scope.
- Every finding needs evidence.
- Prioritize correctness, safety, maintainability, and blast radius.
- Do not suggest style-only changes unless they materially improve readability, safety, or maintainability.
- Prefer a small number of high-signal comments over many low-value remarks.
- Call out missing validation when it affects confidence.

## Checklist
- Does the change do what it claims?
- Does it preserve existing patterns and constraints?
- Does it introduce avoidable complexity or new layers?
- Does it widen permissions, interfaces, or operational blast radius?
- Is the validation appropriate for the touched surface?

## Output
Verdict, Blocking Issues, Non-blocking Notes, Security Notes.
