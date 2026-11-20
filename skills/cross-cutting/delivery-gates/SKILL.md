---
name: delivery-gates
description: Shared decision gates for read-only work, fast-path changes, approvals, and validation.
---

# Delivery Gates

Use this skill to standardize when work can proceed directly and when it must stop for approval.

## Decide whether work may proceed

1. Apply the active profile, repository, and host restrictions before classifying the work. Approval cannot authorize a prohibited operation.
2. Classify actual effects, including automation triggered downstream. `Read-only` means inspection or analysis without changes to repository files, shared state, or external targets. Local diagnostic artifacts follow the active profile's artifact rules. Publishing, remote workflow dispatch, and a merge that triggers deployment are mutations.
3. For permitted mutations, stop before implementation if a required approval is missing. Otherwise use `Fast-path` when it qualifies, or `Standard-path` when the active profile explicitly provides it. For profiles without `Standard-path`, retain their existing rules; when no rule covers the work, stop for a scope decision outside `Fast-path`.

Use criticality to choose validation depth. Under a profile that defines `Standard-path`, `Medium` alone does not trigger approval.

## Approval triggers
Request approval before implementation when any of the following is true:
- public API or interface changes,
- schema or migration changes,
- new dependencies,
- auth, IAM, secrets, or credential changes,
- production deployment behavior changes,
- protected surface changes,
- irreversible or hard-to-rollback changes,
- risk, scope, or rollback is unclear.

## Fast-path test
Use `Fast-path` only when all of the following are true:
- scope is clear and local,
- risk is low,
- rollback is straightforward,
- no protected surface is affected,
- no dependency or interface expansion is required.

## Validation baseline
For touched areas, use the strongest relevant validation available:
- lint,
- typecheck,
- unit or integration tests,
- config or syntax validation,
- deployment or operational validation when permitted; inspect target, side effects, and approval scope before running it.

## Handoff contract
Every execution-oriented response should make clear:
- assumptions,
- task state,
- changes or recommendations,
- validation performed,
- remaining risks,
- next owner.
