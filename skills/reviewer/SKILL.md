---
name: reviewer
description: Phase 7 skill for Nexus. Guides self-review mode protocol, audit dimensions, evidence collection, verdict delivery, and phase audit. Use together with review-rubric.
---

# Reviewer

Use this skill before final handoff when `Change Criticality` is `Medium` or `High`, protected surfaces are touched, or a security-sensitive fast-path change was executed.
Complements `review-rubric` with self-review protocol, phase audit, and operational exposure checks.

## Self-review mode switch

When entering the review phase:
- Explicitly transition to read-only mode — no further edits during review.
- Review only the scope that was implemented — do not expand review to unrelated areas.
- If the review finds a blocking issue, exit review, fix the issue, then re-enter review from the start.
- For standalone `Nexus`, this review remains an internal read-only phase and does not imply delegation to `@Sentinel`.

## Audit dimensions

Review every change across these dimensions:

| Dimension | What to check |
|---|---|
| Correctness | Does the change do what the acceptance criteria require? |
| Security | Does it introduce exploitable risk, privilege expansion, or unsafe secret handling? |
| Maintainability | Does it follow existing patterns? Is it understandable to the next person? |
| Permission scope | Does it expand permissions, roles, or access? Is the expansion justified? |
| Secret handling | Are secrets kept out of logs, responses, config files, and version control? |
| Operational exposure | What is the blast radius in production? What are the failure modes? |

## Security-first classification

These findings are **Blocking** by default — non-negotiable:
- Exploitable security vulnerability.
- Privilege expansion without explicit justification.
- Unsafe secret handling (hardcoded, logged, exposed in responses).
- Missing input validation on trust boundaries.
- Auth bypass or insufficient authorization checks.

Do not downgrade these to non-blocking unless the risk is explicitly mitigated and documented.

## Evidence collection

Every finding must be backed by specific evidence:
- **Diff reference** — which file and line(s) the finding applies to.
- **Execution evidence** — test results, linter output, validator output that supports the finding.
- **Behavioral evidence** — observed behavior that demonstrates the issue.

Findings without evidence are not findings — they are opinions. Do not include them.

## Agent artifact review focus

For agent, instruction, skill, and OpenCode settings changes, verify:
- explicit exception language and user-facing clarity,
- permission enforcement versus descriptive-only guardrails,
- tool and skill allowlist consistency,
- routing and ownership consistency,
- cross-platform parity or documented intentional divergence.

Use `agent-governance` findings as supporting evidence when applicable.

## Diff-scoped review technique

Constrain the review to the actual change surface:

1. **Start from the diff** — use `git diff --cached` or `git diff HEAD~1` to identify touched files and lines.
2. **Review touched lines first** — correctness, security, and maintainability of the changed code.
3. **Follow imports one level** — check direct callers and callees of changed functions/types. Do not review the entire dependency graph.
4. **Check test coverage** — verify that touched behavior has corresponding test evidence.
5. **Spot-check context** — read surrounding code only enough to confirm the change fits the existing pattern.

Do not review files that were not touched and are not direct dependencies of the change.
Do not flag pre-existing issues unless they are made exploitable by the current change.

## Verdict protocol

Return exactly one of:
- `APPROVED` — no blocking findings; non-blocking suggestions may exist.
- `CHANGES REQUIRED` — one or more blocking findings exist.

Blocking findings prevent `APPROVED` regardless of how good the rest of the change is.
Do not negotiate on blocking findings. Fix and re-review.

## Phase audit

Verify that each executed phase produced its expected artifacts:
- **Discovery** — scope boundaries and acceptance criteria documented?
- **Architecture** — decision recorded with rationale?
- **Planning** — phases with validation gates defined?
- **Implementation** — minimal cohesive change with no scope drift?
- **Testing** — execution evidence with actual pass/fail?

Missing phase artifacts for executed phases should be flagged as non-blocking unless they indicate a gap in the delivered solution.

## Operational exposure check

For changes with production impact:
- What is the blast radius if this change fails in production?
- What are the failure modes? (graceful degradation, hard failure, data corruption)
- Is there monitoring or alerting that would detect the failure?
- How long would it take to detect and recover?

## Anti-patterns

- Negotiating on blocking findings — a blocking finding is blocking until fixed.
- Conflating style preferences with blocking issues — style is non-blocking unless it creates maintenance risk.
- Skipping evidence — "this looks wrong" is not a finding without a specific reference.
- Self-approving without read-only separation — the review must be a distinct pass, not inline editing.
- Reviewing scope beyond what was implemented — stay within the delegation boundary.

## Output

Blocking Issues, Non-blocking Suggestions, Security Notes, Phase Audit, Operational Exposure, Evidence Summary, Verdict, Next Owner.
