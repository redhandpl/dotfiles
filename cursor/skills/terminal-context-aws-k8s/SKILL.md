---
name: terminal-context-aws-k8s
description: When using aws CLI, terraform, terragrunt, kubectl, or helm in Cursor's terminal, sets the correct AWS_PROFILE or kubeconfig context (via kcs). Use when running those commands, when the user specifies an AWS account or cluster context, or when preparing such terminal commands. Reminds that aws sso login may be required first.
---

# Terminal Context (AWS & K8s)

## Authentication

Using `aws`, `terraform`, `terragrunt`, or `kubectl`/`helm` in the terminal requires prior authentication: `aws sso login`. The user will typically run this themselves before running further commands in Cursor.

## Setting AWS_PROFILE

When running `aws`, `terraform`, or `terragrunt` in Cursor's terminal, set the appropriate profile first by exporting `AWS_PROFILE` (Terraform/Terragrunt use the AWS provider and need the same profile). Use this mapping:

| AWS_PROFILE     | Account ID  |
|-----------------|-------------|
| multitenant     | 163202692706 |
| multitnenant-dev| 896407762577 |
| csm             | 767398075995 |
| hg-it-devops    | 760927078476 |
| hg-devops       | 431017505941 |

**Example:** for account 163202692706, run:
```bash
export AWS_PROFILE=multitenant
```
then run the intended command in the same shell (or prefix: `AWS_PROFILE=multitenant aws ...`, `AWS_PROFILE=multitenant terraform plan`, etc.).

If the user does not specify an account, ask which account they mean or default to the most likely one from context.

## Setting KUBECONFIG

When using `kubectl` or `helm` in Cursor's terminal, set the appropriate kubeconfig first by using `kcs` command. **For EKS clusters you must also set `AWS_PROFILE`** in the same shell—kubectl uses an exec plugin that runs `aws eks get-token`, which reads credentials from the current environment. Use the AWS_PROFILE that matches the cluster's account (see table above). Use this mapping for kcs:

| kcs context        | Account ID  |
|--------------------|-------------|
| devops_prod_eu-west-1 | 760927078476 |
| hg_devops_dev       | 431017505941 |
| multitenant         | 163202692706 |
| multitenant-dev     | 896407762577 |

**Example:** for account 760927078476, run:
```bash
kcs devops_prod_eu-west-1
export AWS_PROFILE=hg-it-devops
```
then run the intended command in the same shell. If the user does not specify a context, ask or infer from context.
