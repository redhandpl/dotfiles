---
name: delivery-gates
description: Shared decision gates for read-only work, fast-path changes, approvals, and validation.
---

# Delivery Gates

Use this skill to standardize when work can proceed directly and when it must stop for approval.

## Shared states
- `Read-only`: inspection, analysis, planning, review, or documentation with no repo mutation.
- `Fast-path`: a clear, local, low-risk, reversible change that does not affect protected surfaces or expand dependencies.
- `Approval-required`: any change outside the fast path.

## Approval triggers
Request approval before implementation when any of the following is true:
- public API or interface changes,
- schema or migration changes,
- new dependencies,
- auth, IAM, secrets, or credential changes,
- production deployment behavior changes,
- irreversible or hard-to-rollback changes,
- risk is unclear.

## Fast-path test
Proceed without explicit approval only when all of the following are true:
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
- deployment or operational validation when relevant.

## Handoff contract
Every execution-oriented response should make clear:
- assumptions,
- task state,
- changes or recommendations,
- validation performed,
- remaining risks,
- next owner.
