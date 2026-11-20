---
name: aws-cost-optimizer
description: "Analyze AWS costs with read-only AWS CLI and Cost Explorer queries and prepare recommendations for the operator."
risk: safe
source: community
date_added: "2026-02-27"
---

# AWS Cost Optimizer

Analyze AWS spending patterns, identify waste, and provide actionable cost reduction strategies.

## When to Use This Skill

Use this skill when you need to analyze AWS spending, identify cost optimization opportunities, or reduce cloud waste.

Resolve the AWS account, region, and billing scope through `terminal-context-bridge` before querying. Leave resource, budget, tagging, and purchase changes to the authorized operator.

## Core Capabilities

**Cost Analysis**
- Parse AWS Cost Explorer data for trends and anomalies
- Break down costs by service, region, and resource tags
- Identify month-over-month spending increases

**Resource Optimization**
- Detect idle EC2 instances (low CPU utilization)
- Find unattached EBS volumes and old snapshots
- Identify unused Elastic IPs
- Locate underutilized RDS instances
- Find old S3 objects eligible for lifecycle policies

**Savings Recommendations**
- Suggest Reserved Instance/Savings Plans opportunities
- Recommend instance rightsizing based on CloudWatch metrics
- Identify resources in expensive regions
- Calculate potential savings with specific actions

## AWS CLI Commands

Replace the example UTC dates and timestamps with the requested window. Cost Explorer uses an inclusive `Start` and an exclusive `End`.

### Get Cost and Usage
```bash
# Cost by service for a 30-day window
aws ce get-cost-and-usage \
  --time-period Start=2026-10-01,End=2026-10-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Daily costs for the elapsed portion of a month
aws ce get-cost-and-usage \
  --time-period Start=2026-11-01,End=2026-11-20 \
  --granularity DAILY \
  --metrics UnblendedCost
```

### Find Unused Resources
```bash
# Unattached EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,VolumeType,CreateTime]' \
  --output table

# Unused Elastic IPs
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null].[PublicIp,AllocationId]' \
  --output table

# Idle EC2 instances (requires CloudWatch)
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-xxxxx \
  --start-time 2026-11-13T00:00:00Z \
  --end-time 2026-11-20T00:00:00Z \
  --period 86400 \
  --statistics Average

# EBS snapshots older than the chosen UTC cutoff
aws ec2 describe-snapshots \
  --owner-ids self \
  --query 'Snapshots[?StartTime<`"2026-08-22"`].[SnapshotId,StartTime,VolumeSize]' \
  --output table
```

### Rightsizing Analysis
```bash
# List EC2 instances with their types
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,Tags[?Key==`Name`].Value|[0]]' \
  --output table

# Get RDS instance utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=mydb \
  --start-time 2026-10-21T00:00:00Z \
  --end-time 2026-11-20T00:00:00Z \
  --period 86400 \
  --statistics Average,Maximum
```

## Optimization Workflow

1. **Baseline Assessment**
   - Pull 3-6 months of cost data
   - Identify top 5 spending services
   - Calculate growth rate

2. **Cleanup Candidates**
   - Inventory unattached EBS volumes, unused Elastic IPs, idle EC2 instances, and old snapshots.
   - Estimate savings and identify owners, dependencies, and recovery prerequisites for review before recommending removal or shutdown.

3. **Strategic Optimization**
   - Analyze Reserved Instance coverage
   - Review instance types vs. workload
   - Assess S3 lifecycle policies and their retention implications.
   - Consider Spot instances for non-critical workloads

4. **Ongoing Monitoring**
   - Review budget alerts, Cost Anomaly Detection, and cost allocation tag coverage.
   - Monthly cost review meetings

## Cost Optimization Checklist

- [ ] Check Cost Explorer availability and cost allocation tag coverage
- [ ] Review AWS Budget alerts and resource cleanup candidates with their owners
- [ ] Analyze Reserved Instance opportunities
- [ ] Assess S3 Intelligent-Tiering
- [ ] Review data transfer costs
- [ ] Assess Lambda memory allocation and CloudWatch Logs retention
- [ ] Consider multi-region cost differences

## Example Prompts

**Analysis**
- "Show me AWS costs for the last 3 months broken down by service"
- "What are my top 10 most expensive resources?"
- "Compare this month's spending to last month"

**Optimization**
- "Find all unattached EBS volumes and calculate savings"
- "Identify EC2 instances with <5% CPU utilization"
- "Suggest Reserved Instance purchases based on usage"
- "Calculate savings from deleting snapshots older than 90 days"

**Reporting**
- "Recommend cleanup candidates with savings, dependencies, and recovery notes"
- "Recommend a budget alert for $1000/month"
- "Generate a cost optimization report for leadership"

## Best Practices

- Verify ownership, retention, and actual usage before recommending any resource change.
- Document assumptions, projected savings, and operational trade-offs.
- Calculate ROI before recommending recurring commitments.
- Use AWS Trusted Advisor recommendations
- Check whether AWS Cost Anomaly Detection is enabled

## Integration with Kiro CLI

This skill works seamlessly with Kiro CLI's AWS integration:

```bash
# Use Kiro to analyze costs
kiro-cli chat "Use aws-cost-optimizer to analyze my spending"

# Generate optimization report
kiro-cli chat "Create a cost optimization plan using aws-cost-optimizer"
```

## Safety Notes

- Read costs and inventory in the resolved account; report missing access instead of changing permissions or enabling services.
- Send resource changes and financial commitments to the owner with evidence, prerequisites, and recovery notes. A dry-run flag does not authorize a write.

## Additional Resources

- [AWS Cost Optimization Best Practices](https://aws.amazon.com/pricing/cost-optimization/)
- [AWS Well-Architected Framework - Cost Optimization](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
- [AWS Cost Explorer API](https://docs.aws.amazon.com/cost-management/latest/APIReference/Welcome.html)
