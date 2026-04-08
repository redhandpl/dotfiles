---
name: documentalist
description: Use when the user or another agent needs to create or update technical documentation such as a README, changelog/release notes, runbook, onboarding/setup guide, ADR, or internal technical documentation. Produces a complete Markdown document, asks for missing context first when needed, and flags when technical review is required.
---

# Documentalist

Creates or updates technical documentation in English Markdown. Produces a complete, publication-ready draft, prefers links over embedded detail, and includes code examples only when they materially improve clarity.

## When to Use This Skill

Invoke this skill when the user or delegating agent wants to create or update:
- README documentation
- changelog or release notes
- runbook or operational documentation
- setup or onboarding documentation
- ADRs (architecture decision records)
- internal technical documentation

This skill supports three invocation modes:
- **Explicit invocation** — the user or agent directly asks to use `documentalist`
- **Intent-based invocation** — the request is clearly about generating or updating documentation
- **Checklist/reference mode** — use the guidance below to validate or improve a draft without fully re-authoring it

## Required Inputs

Before drafting, confirm or infer the following:
- document type
- create vs. update mode
- intended audience
- purpose and expected outcome
- source material, change scope, or decision being documented
- required constraints, approvals, or mandatory sections
- owner for technical review, if the content is operational, architectural, or implementation-sensitive

If critical context is missing and cannot be inferred safely, ask concise follow-up questions before writing.

## Default Documentation Rules

- Write in English.
- Use Markdown.
- Prefer links over embedded detail.
- Include code, CLI, or config examples only when necessary.
- State assumptions explicitly.
- Preserve repository and domain terminology.
- Keep instructions concrete and verifiable.
- For updates, retain useful existing structure and revise only what needs to change.
- Do not invent behavior, guarantees, or operational facts that are not supported by the source context.

## Workflow

Follow these steps **in order**:

### Step 1 — Identify document mode and type

Determine:
- whether this is `create` or `update`
- which document type best fits the request
- which domain owner is responsible for technical correctness

### Step 2 — Gather context

Collect the relevant source material:
- existing documents
- implementation notes or diffs
- architecture decisions
- operational constraints
- setup prerequisites
- user-provided requirements

### Step 3 — Close context gaps

If any of the following are unclear, ask before drafting:
- audience
- purpose
- scope boundaries
- required sections
- expected level of detail
- technical reviewer or approving owner

### Step 4 — Draft the complete document

Produce a full, ready-to-use Markdown document using either:
- the general document schema, or
- a type-specific template when one applies

### Step 5 — Mark review needs

Explicitly call out when the draft requires technical review before publication.

### Step 6 — For updates, preserve structure

When updating an existing document:
- keep stable headings where reasonable
- update only the affected sections unless a structural rewrite is requested
- avoid unnecessary tone or format churn

## General Document Schema

Use this default structure when no type-specific template is a better fit:

```md
## Overview

## Audience / Scope

## Prerequisites

## Steps / Usage / Operation

## Validation

## Troubleshooting / Rollback

## Risks / Limitations

## References
```

Use only the sections that materially improve the document. Do not add filler headings.

## Type-Specific Templates

### README Template

Use for repository, component, tool, or feature documentation.

```md
# <Name>

## Overview

## Audience / Scope

## Prerequisites

## Setup

## Usage

## Validation

## Limitations

## References
```

### Runbook / Operational Document Template

Use for operational procedures, incidents, deployments, recovery paths, or recurring maintenance.

```md
# <Runbook Title>

## Overview

## Audience / Ownership

## Preconditions

## Procedure

## Validation

## Rollback / Recovery

## Troubleshooting

## Escalation

## References
```

### ADR Template

Use for architecture or design decisions.

```md
# ADR: <Decision Title>

## Status

## Context

## Decision

## Consequences

## Alternatives Considered

## Validation / Follow-up

## References
```

## Guidance for Other Document Types

- **Release notes / changelog:** focus on user-visible or operator-relevant changes, impact, upgrade notes, and known limitations.
- **Setup / onboarding docs:** prioritize prerequisites, ordered setup steps, validation, and common failure points.
- **Internal technical docs:** explain the problem, system boundaries, assumptions, workflows, and operational or implementation caveats.

## Technical Review Triggers

Require or recommend technical review when the document includes any of the following:
- architecture decisions or trade-offs
- operational procedures, rollback steps, or escalation paths
- deployment, infrastructure, IAM, secrets, or security-sensitive details
- migrations, compatibility constraints, or data handling expectations
- public interface contracts or non-obvious implementation behavior
- statements whose correctness depends on code, config, or environment details that were not directly verified

When applicable, identify the likely reviewer:
- `@blueprint` for ADRs and architecture documentation
- `@d43mon` for runbooks, release procedures, and operational docs
- `@forger` for implementation-facing technical docs tied to app/config behavior

## Rules

- Always produce a complete document unless the user explicitly asks for an outline only.
- Ask for missing critical context before drafting.
- Do not silently broaden scope from one document type into a larger documentation set.
- Prefer concise, maintainable documents over exhaustive duplication of source material.
- Link to authoritative sources instead of embedding large copied sections.
- If technical accuracy cannot be established confidently, say so and request review.
