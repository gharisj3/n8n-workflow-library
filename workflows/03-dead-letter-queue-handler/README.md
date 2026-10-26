# Dead-Letter Queue Handler

## Purpose

Accept failed-event payloads, classify the failure, prepare a storage payload and return a retry decision. The default export does not persist events or execute retries. Its output explicitly reports `persisted: false`; connect a durable database or queue before relying on retention.

## What a Dead-Letter Queue Is

A dead-letter queue is a controlled place for failed events that could not be processed normally. It prevents silent failure and gives operators a repeatable review path.

## Why It Is Useful

Dead-letter handling protects production automations from losing events, retrying forever, or hiding failures inside execution history.

## Architecture Flow

Webhook Trigger for Failed Event -> Normalize Failed Event -> Classify Error -> Check Retry Count -> Retry Allowed Branch or Final Dead-Letter Branch -> Prepare Storage Payload -> Respond with Status

## Node-by-Node Explanation

- Webhook Trigger for Failed Event accepts a failure payload from another workflow.
- Normalize Failed Event standardizes retry fields and metadata.
- Classify Error marks the failure as recoverable or non-recoverable.
- Check Retry Count decides whether retries remain.
- Retry Allowed Branch returns retry guidance.
- Final Dead-Letter Branch marks the event for manual review.
- Prepare Storage Payload prepares the storage payload.
- Respond with Status returns the decision.

## Required Credentials

None by default. Add database, queue, or issue-tracker credentials when you connect the storage node to a real system.

## Required Environment Variables

None by default.

## Sample Input

See `failed-event-sample.json`.

## Sample Output

```json
{
  "ok": true,
  "decision": "retry_allowed",
  "category": "recoverable"
}
```

## Failure Categories

- `recoverable`: transient timeout, rate limit, or service failure.
- `non_recoverable`: schema, authentication, or missing required data.
- `unknown`: error is not confidently classified.

## Retry Policy

See `retry-policy.md`.

## How to Connect This Workflow

In source workflows, add an error branch or error workflow that sends failed payloads to this workflow webhook. Include the original payload, retry count, source workflow name, and error message.

## How to Import

Import `workflow.json`, inspect the webhook path, and keep the workflow inactive until the source workflows are ready to send failed events.

## How to Test

Post `failed-event-sample.json` to the test webhook URL. Change `retry_count` and `error_code` to verify both branches.

## How to Customize

Connect Prepare Storage Payload to MySQL, PostgreSQL, a queue, or an issue tracker.

## Production Notes

Add authentication to the webhook, avoid logging secrets, and define ownership for manual review.

## Common Errors

- Source workflow does not send retry metadata
- Retry count is a string instead of a number
- Error category rules are too broad
- Dead-letter storage is not monitored
