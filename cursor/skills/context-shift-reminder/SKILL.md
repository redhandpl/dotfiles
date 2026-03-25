---
name: context-shift-reminder
description: Detects radical topic changes in conversation. Use when the user's current query is clearly unrelated to the recent discussion (e.g. switched from coding/infra to cooking, hobbies, or a different project). When detected, ask if they want to continue in this chat or start fresh to avoid accumulating irrelevant context and inflating token cost.
---

# Context Shift Reminder

## When to trigger

Only when the topic shift is **radical and obvious**:
- Technical/coding → non-technical (cooking, travel, personal)
- Project A → completely unrelated Project B (no shared codebase)
- Deep technical discussion → casual off-topic question

Do NOT trigger for:
- **First message in conversation** (no previous conversation history to compare against)
- Natural follow-ups within same domain (e.g. AWS → Terraform)
- Drill-down on same topic (e.g. S3 → CloudFront)
- Slightly different but related task

## How to detect first message

Check if there is any conversation history before the current user query:
- If there are no previous assistant responses or user messages, this is the first message
- Workspace context (open files, git status, environment info) is NOT conversation history

## What to say

When triggered, before answering:

> Hej – gadamy zupełnie o czymś innym. Chcesz na pewno kontynuować w tym chacie? Nowy chat = mniej tokenów w kontekście = niższy koszt.

Then wait for confirmation or proceed if the user clearly wants to continue.
