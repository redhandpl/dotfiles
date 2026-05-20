# GitHub Built-in Agents Guidelines

## Scope
This directory defines an instruction-first setup for VS Code GitHub Copilot built-in agents.

Goal:
- keep Void Protocol behavior and guardrails,
- rely on instructions instead of custom `github/agents/*.agent.md` role files,
- document enforcement gaps explicitly where GitHub built-in behavior is prompt-level only.

## Structure
- `instructions/general.instructions.md` — language and communication guardrails.
- `instructions/agent-contract.instructions.md` — routing, ownership, risk gates, and operating contract.
- `instructions/skill-policy.instructions.md` — canonical when-to-use policy for shared skills.

## Operational Model
- Built-in GitHub Copilot agents emulate Void Protocol roles through instruction routing.
- Routing remains conceptual (`Ghost`, `Anchor`, `Blueprint`, `Weaver`, `Shard`, `Forger`, `d43mon`, `GL1TCH`, `Sentinel`) even when execution happens inside one built-in agent context.
- For mixed tasks, define the App/DevOps interface before implementation.

## Platform Status
- OpenCode remains the authoritative source for hard command permissions and skill allowlists.
- This folder is an experimental GitHub built-in profile where most guardrails are instruction-enforced.
- If behavior diverges between GitHub built-in and OpenCode, follow the stricter OpenCode policy and report the gap.

## Validation
For edits in this directory:
- check frontmatter presence and consistency in each `*.instructions.md` file,
- verify routing and ownership statements remain aligned with repository-level `AGENTS.md`,
- keep language/style rules in `general.instructions.md`,
- keep operational/routing rules in `agent-contract.instructions.md`,
- keep skill trigger rules in `skill-policy.instructions.md`.
