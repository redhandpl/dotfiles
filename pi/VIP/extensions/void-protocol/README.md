# void-protocol Pi extension skeleton

This directory contains the first functional Pi-side Void Protocol draft.

## Files

- `index.ts` - extension entry point, commands, and tools
- `adapter.ts` - loads Pi agent definitions from `~/.pi/agent/agents` with fallback to `./.pi/agents`
- `router.ts` - Ghost-style heuristic routing
- `runner.ts` - real subagent runner using spawned `pi` subprocesses
- `types.ts` - shared local types

## Current scope

Implemented:
- discovery of Pi agent definitions from `~/.pi/agent/agents` with fallback to `./.pi/agents`
- adapter output for Pi runtime planning
- real subagent execution for `forger`, `d43mon`, `gl1tch`, and `sentinel`
- Ghost-style route planning and chain execution
- `/void-agents` command for quick inspection
- `/nexus <task>` command that creates a dedicated Nexus session draft
- workflow commands:
  - `/ghost <task>`
  - `/implement <task>`
  - `/ops <task>`
  - `/test <scope>`
  - `/review <scope>`
- tools:
  - `void_delegate`
  - `ghost_route`
- Nexus session overlay injection via `before_agent_start`

Still simplified:
- Ghost routing uses heuristics, not model-driven classification
- OpenCode permission rules are translated mainly via tool allowlists and prompt overlays, not a full 1:1 runtime policy engine
- workflow command output is currently written to the Pi editor as a structured handoff summary
- session naming and richer persisted runtime state are still minimal

## Recommended next step

Strengthen the runtime policy layer:
- translate more of the original OpenCode bash allow/deny model into explicit Pi `tool_call` gates,
- improve Ghost routing with richer classification inputs,
- decide whether `anchor`, `blueprint`, `weaver`, and `shard` should stay workflow-backed or become real subagents.
