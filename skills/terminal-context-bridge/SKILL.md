---
name: terminal-context-bridge
description: Public bridge skill for AWS and Kubernetes terminal context selection. Resolves when to use the private `terminal-context-aws-k8s` overlay, keeps account or cluster targeting explicit, and prevents running commands in the wrong shell or environment.
---

# Terminal Context Bridge

Use this skill before terminal commands that depend on AWS or Kubernetes targeting, including `aws`, `terraform`, `terragrunt`, `cdk`, `kubectl`, `helm`, and `argocd`.
This skill does not store private mappings itself. It bridges to a private or local overlay such as `terminal-context-aws-k8s` when available.

## Use when

- A terminal command depends on AWS account, region, role, or profile selection.
- A terminal command depends on Kubernetes cluster, namespace, or kubeconfig context.
- The task touches EKS, where both Kubernetes context and AWS credentials must align.
- The user names an account, environment, cluster, or region and the command must execute in that target.

## Resolution flow

1. Determine whether the task is AWS-only, Kubernetes-only, or EKS-crossing.
2. Resolve target account, region, cluster, namespace, and environment from explicit user input or repo context.
3. If the private or local overlay `terminal-context-aws-k8s` is available, use it to derive the concrete `AWS_PROFILE` and Kubernetes context commands.
4. If the overlay is not available or context is still ambiguous, ask instead of guessing.
5. Run the context-setting command and the first target command in the same shell session.

## Guardrails

- Never guess `prod`.
- Never split context export or `kcs` selection from the target command across different shell sessions.
- For EKS, ensure Kubernetes context and `AWS_PROFILE` match the same account.
- Remind that `aws sso login` may be required before further commands.
- Avoid printing secrets or long-lived credentials.
- If the task only edits files and does not need terminal execution, do not load this skill.

## Output

Target Environment, Required Context, Bridge Decision, Preflight Commands, Ambiguities, Next Command.