# Void Protocol mapping for Pi

This document proposes how the existing OpenCode agent set in `opencode/agent/` should be represented in Pi.

## Goal

Preserve the current role boundaries, routing semantics, and single-agent exception model without trying to force a 1:1 platform abstraction.

Pi should treat:
- `skills/` as the reusable instruction layer,
- a Pi extension as the orchestration and policy layer,
- selected roles as real Pi subagents,
- `Nexus` as an opt-in single-agent session profile.

## Core principles

1. `opencode/agent/*.md` remains the source of truth for role intent and boundaries.
2. `skills/` should be reused directly in Pi whenever possible.
3. Do not create a third manually maintained copy of agent prompts just for Pi.
4. Use Pi extensions for routing, tool gating, session control, and delegation.
5. Use Pi subagents only where isolated context, dedicated tool posture, or separate execution ownership materially helps.
6. Keep `Nexus` as the only official end-to-end single-agent exception.

## Proposed Pi architecture

### 1. Skills layer

Reuse the repository `skills/` tree as Pi skills.

Primary categories already available:
- Cross-cutting: `repo-conventions`, `delivery-gates`, `agent-governance`, `project-memory-hygiene`, `documentalist`, `test-strategy`, `review-rubric`
- Nexus phase skills: `discovery-scope`, `architect`, `planner`, `coder`, `devops`, `tester`, `reviewer`
- Stack specialists: `github-actions`, `docker-patterns`, `terraform-terragrunt`, `terraform-style-guide`, `cdk-aws`, `argocd-gitops`, `ansible-ops`, `terminal-context-bridge`, `python-patterns`, `python-testing`, `aws-cost-optimizer`

### 2. Extension layer

Create a Pi extension, for example `pi/extensions/void-protocol/`, responsible for:
- reading and adapting `opencode/agent/*.md`,
- Ghost-style routing,
- Nexus session bootstrapping,
- tool and bash policy enforcement,
- subagent invocation,
- optional workflow commands and prompt shortcuts.

### 3. Subagent layer

Use Pi subagents for the roles that benefit from isolated context windows and dedicated execution posture.

### 4. Session profile layer

Model `Nexus` as an extension-defined dedicated session workflow, not as a built-in Pi mode.

## Mapping of OpenCode agents to Pi

| OpenCode agent | Proposed Pi representation | Rationale |
|---|---|---|
| `ghost` | Pi extension orchestrator | Ghost is routing-first and should own classification, delegation, sequencing, and quality gates. |
| `nexus` | Dedicated Pi session profile / command-driven single-agent workflow | Nexus is the official opt-in, non-delegating exception and fits best as a separate session flow. |
| `anchor` | Lightweight workflow command plus `discovery-scope` skill; optional subagent later | Clarification and scope shaping can start as a structured workflow rather than a full agent runtime. |
| `blueprint` | Lightweight workflow command plus `architect` skill; optional subagent later | Architecture work maps naturally to a skill-backed workflow unless strong isolation is needed. |
| `weaver` | Workflow command plus `planner` and `delivery-gates` skills; optional subagent later | Phase planning does not require heavy runtime isolation at first. |
| `shard` | Small decomposition workflow or lightweight subagent | Task slicing is narrow and can be introduced after core orchestration works. |
| `forger` | Real Pi subagent | App/code implementation benefits from isolated context and explicit execution ownership. |
| `d43mon` | Real Pi subagent | DevOps work needs distinct tools, policy gates, and stronger bash controls. |
| `gl1tch` | Real Pi subagent | Testing and execution evidence benefit from dedicated scope and clean output. |
| `sentinel` | Real Pi subagent | Final read-only quality gate maps cleanly to a dedicated review subagent. |

## Why `ghost` should be an extension, not a skill

`ghost` is primarily responsible for:
- task classification (`App`, `DevOps`, `Mixed`),
- change criticality classification,
- delegation order,
- quality gate routing,
- keeping ownership boundaries intact.

These are runtime concerns. In Pi they belong in an extension, because an extension can:
- expose tools and commands,
- intercept tool calls,
- enforce policy,
- manage sessions,
- invoke subagents.

A skill alone is insufficient for that responsibility.

## Why `nexus` should be a dedicated session workflow

Pi has native sessions and session replacement APIs, but it does not have a built-in concept like `mode = nexus`.

Therefore `Nexus` should be implemented as an extension-defined session-scoped workflow:
- user invokes `/nexus <task>`,
- the extension creates a new session or forks into a dedicated session,
- the extension marks that session as Nexus-scoped,
- the extension injects the Nexus operating contract on each turn,
- no delegation to subagents occurs inside that session.

This preserves the existing semantics:
- opt-in,
- user-selected,
- end-to-end,
- non-delegating,
- app/devops boundaries still explicit internally.

## Recommended Pi subagents

Start with these four as real subagents:
- `forger`
- `d43mon`
- `gl1tch`
- `sentinel`

These roles have the strongest justification for:
- isolated context,
- clear ownership,
- different tool posture,
- repeatable routing chains.

Typical chains:
- App change: `ghost -> forger -> gl1tch -> sentinel`
- DevOps change: `ghost -> d43mon -> gl1tch -> sentinel`
- Mixed change: `ghost -> forger + d43mon -> gl1tch -> sentinel`

## Invocation model in Pi

### User-facing entry points

Recommended commands:
- `/ghost <task>` or default orchestrated behavior
- `/nexus <task>`
- `/implement <task>`
- `/review <scope>`
- `/test <scope>`
- `/ops <task>`

### Internal delegation entry point

Recommended internal tool:
- `void_delegate`

This tool should let the orchestrator invoke a role with structured arguments such as:
- target agent,
- task,
- scope classification,
- criticality,
- handoff notes,
- optional chain metadata.

## Agent source of truth

Operational lookup order for the Pi extension:
1. `~/.pi/agent/agents`
2. `./.pi/agents`

Current repository support:
- `pi/agents/` stores the Pi-friendly mirror definitions,
- `./.pi/agents/` stores the project-local fallback copy used by the extension when the user-level agent catalog is empty.

Recommended maintenance model:
- keep role intent and boundary decisions aligned with `opencode/agent/*.md`,
- mirror those definitions into the Pi-facing agent catalog instead of letting the Pi catalog drift independently.

Avoid:
- silently maintaining incompatible role semantics between OpenCode and Pi,
- treating the Pi-side agent mirrors as a new independent source of truth.

## Permission mapping strategy

OpenCode permissions do not map 1:1 into Pi, so use an adapter model.

### Translate OpenCode permissions into Pi runtime behavior via:

1. **Active tool profiles**
   - read-only roles: `read`, `grep`, `find`, `ls`
   - implementation roles: add `edit`, `write`
   - operational roles: add `bash` with policy controls

2. **Extension-enforced bash policy**
   - allow safe read-only commands,
   - block known unsafe apply or mutation commands,
   - require confirmation for ask-tier commands.

3. **Skill loading discipline**
   - expose only the role-relevant skills and workflow helpers,
   - keep governance and routing checks aligned with the current repository contract.

## Phased implementation plan

### Phase 1
- Reuse `skills/` directly in Pi.
- Add a minimal `void-protocol` extension skeleton.
- Add `/nexus` bootstrap command.

### Phase 2
- Implement Ghost-style orchestration in the extension.
- Add `void_delegate`.
- Introduce real subagents for `forger`, `d43mon`, `gl1tch`, and `sentinel`.

### Phase 3
- Add ergonomic workflow commands such as `/implement`, `/ops`, `/review`, `/test`.
- Add quality-gate chains and session handoff helpers.

### Phase 4
- Reassess whether `anchor`, `blueprint`, `weaver`, and `shard` need to become full subagents.
- Keep them as workflow-backed roles unless real isolation is justified.

## Initial implementation skeleton in this repository

Implemented draft files:
- `pi/extensions/void-protocol/index.ts` - extension entry point with `/void-agents`, `/nexus`, and `void_delegate`
- `pi/extensions/void-protocol/adapter.ts` - loader from `~/.pi/agent/agents` with fallback to `./.pi/agents`
- `pi/extensions/void-protocol/types.ts` - local Pi-side mapping types
- `pi/extensions/void-protocol/README.md` - scope and next-step notes

Current status:
- `void_delegate` executes real Pi subagents for `forger`, `d43mon`, `gl1tch`, and `sentinel`.
- `ghost_route` classifies a task and can execute the routed chain.
- `/nexus` creates a dedicated Nexus session draft.
- workflow commands now exist for `/ghost`, `/implement`, `/ops`, `/test`, and `/review`.
- the extension now loads agents from `~/.pi/agent/agents` with fallback to `./.pi/agents`.
- routing is currently heuristic and permission translation is intentionally partial rather than a full 1:1 OpenCode policy engine.

## Final recommendation

The most maintainable Pi representation of Void Protocol is:
- `skills/` reused directly,
- `ghost` implemented as a Pi extension orchestrator,
- `forger`, `d43mon`, `gl1tch`, and `sentinel` implemented as real Pi subagents,
- `nexus` implemented as a dedicated extension-defined single-agent session workflow,
- `anchor`, `blueprint`, `weaver`, and `shard` introduced first as lightweight workflow-backed roles, not full subagents.
