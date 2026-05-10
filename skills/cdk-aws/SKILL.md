---
name: cdk-aws
description: Specialist skill for AWS CDK-based stacks and config repositories. Guides config-to-stack resolution, synth or diff discipline, and approval boundaries around deploy or destroy.
---

# AWS CDK

Use this skill when changing AWS CDK stacks, stack configuration repositories, synthesis inputs, or CloudFormation-oriented deployment helpers.
Pair it with `devops`; if the CDK app is Python-based, keep all Python work inside `.venv`. Load `terminal-context-bridge` before terminal commands that depend on AWS account or region selection.

## Repository patterns to inspect first

- Account-specific or region-specific config files separate from the executable CDK app.
- Stack names derived from config values such as `EnvName`.
- Toolbox containers, local bootstrap scripts, or repository-specific environment setup before CLI use.
- Cross-repository flows where one repository stores configs and another contains the deployable CDK app.
- Config-copy workflows where the changed repository does not deploy directly but feeds another CDK repository.

## Preflight

- Resolve the exact config file, target account, region, and stack name before running any command.
- Determine whether the touched repository stores configs only, the executable CDK app, or both.
- Confirm bootstrap, credential, and toolchain assumptions up front.
- Validate the configuration key that produces stack naming, for example `EnvName`, before synthesizing or diffing.
- Scope commands to explicit stack names; avoid wildcard or deploy-all patterns.
- Inspect whether the change can trigger CloudFormation replacement, export breakage, or stack rename effects.

## Validation

- `cdk synth` or the repository-equivalent synthesis step
- `cdk diff <stack> -c config=<file>` on the exact target stack
- Inspect synthesized CloudFormation or diff output for replacements, deletes, IAM expansion, or networking changes
- Validate config-file path, naming, and account or region mapping before diffing
- If a toolbox container or wrapper is the repository norm, validate through that path instead of inventing a local shortcut
- Run repository-local lint, typecheck, or unit checks when they exist

## Guardrails

- `cdk deploy` and `cdk destroy` are approval-sensitive operations.
- Treat bootstrap version changes, asset publishing, context defaults, and stack renames as high risk.
- Do not diff or deploy all stacks when the change is stack-local.
- Treat config-only repository changes as cross-repository rollout coupling, not as isolated YAML edits.
- Keep config-file naming and account segregation consistent with the repository layout.
- Surface CloudFormation replacement risk explicitly in the rollout and rollback notes.

## Escalation triggers

- Bootstrap or trusted-account changes.
- Cross-account deployment changes.
- Stack rename or logical-ID churn.
- IAM, security-group, networking, or data-plane deletes.
- Unclear relationship between the config repository and the executable CDK repository.

## Output

Config Scope, Stack Targets, Execution Context, Diff Findings, Replacement Risk, Validation Evidence, Rollback Notes, Escalations.