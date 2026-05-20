# Project-local Pi agents

This directory is the project-local fallback agent catalog for the Void Protocol Pi extension.

Lookup order used by the extension:
1. `~/.pi/agent/agents`
2. `./.pi/agents`

These files currently mirror the Pi-friendly agent definitions in `pi/agents/` so the extension can run inside this repository even when the user-level agent directory is empty.
