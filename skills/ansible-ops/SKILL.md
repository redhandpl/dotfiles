---
name: ansible-ops
description: Specialist skill for Ansible playbooks, inventories, roles, and operator wrappers. Guides inventory scoping, venv discipline, syntax or check-mode validation, and idempotent change design.
---

# Ansible Operations

Use this skill when changing Ansible playbooks, roles, inventories, `ansible.cfg`, vault usage, or repository-specific wrappers such as operator CLIs that orchestrate playbook runs.
Pair it with `devops`; keep Python and Ansible execution inside `.venv`.

## Repository patterns to inspect first

- Root-level `ansible.cfg` and inventory defaults.
- Repository-provided wrappers like `macagent.py` or environment-setup scripts.
- Tag-based or stage-based playbook execution.
- Separate dev and prod inventories, `group_vars`, `host_vars`, and vault usage.
- Role conventions such as FQCN requirements, role tags, and restart or finalize stages.
- Setup helpers that pin the supported Python or Ansible environment before execution.

## Preferred entrypoint

- If the repository ships a wrapper CLI, use it as the primary operator interface unless the task is specifically about raw playbook invocation.
- If the repository ships an environment bootstrap script, use that before local validation rather than constructing an ad hoc environment.
- Use direct `ansible-playbook` only when the wrapper is missing, insufficient for the task, or itself is the changed surface.

## Preflight

- Create or activate `.venv` before Python or Ansible commands.
- Choose the target inventory, host or group, tags, and any `--limit` or host selector up front.
- Determine whether repository convention expects a wrapper CLI instead of direct `ansible-playbook`.
- Identify vault, become, SSH, and host-key assumptions before running changes.
- Map roles or tasks that restart services, rotate certificates, or touch provisioning assets.
- Separate safe syntax validation from disruptive stages such as provisioning, certificates, restarts, or full-machine setup.

## Validation

- `ansible-playbook --syntax-check`
- `ansible-lint` when available
- `ansible-playbook --check --diff` on the smallest safe host set when dry-run meaningfully reflects the real behavior
- Run targeted validations through the repository wrapper when it is the supported entrypoint
- Verify inventory and variable precedence when behavior depends on `host_vars` or `group_vars`
- Validate tag or stage selection when the repository uses tag-based orchestration or staged setup flows

## Guardrails

- Prefer narrow host targeting over `all`.
- Prefer tags, stages, or wrapper subcommands over monolithic full runs.
- Keep secrets in vault or secret stores; never inline sensitive values.
- Preserve FQCN and repository-standard role layout.
- Surface non-idempotent tasks, restarts, and manual follow-up steps explicitly.
- Treat certificate, provisioning profile, or host bootstrap flows as higher-blast-radius than ordinary package changes.
- Treat inventory-wide changes, certificate or provisioning changes, and privilege-escalation changes as approval-sensitive.

## Escalation triggers

- Host targeting or environment selection is unclear.
- Change affects provisioning assets, certificates, or vault model.
- Check mode cannot approximate the real effect and the blast radius is wider than one host group.
- Wrapper CLI and direct playbook expectations conflict.
- Rollback depends on manual host repair or reimaging.

## Output

Inventory Scope, Host Targeting, Validation Evidence, Idempotency Notes, Rollback Notes, Escalations.