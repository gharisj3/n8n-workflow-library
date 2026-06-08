# Webhook MySQL Logger

## Purpose

Receive webhook payloads, validate required metadata, normalize the body, and insert a JSON copy into MySQL.

## Architecture Flow

Webhook Trigger -> Validate Payload -> Normalize Payload -> MySQL Insert -> Success Response or Error Response

## Node-by-Node Explanation

- Webhook Trigger accepts external `POST` events.
- Validate Payload checks `source`, `event_type`, and `payload`.
- Normalize Payload prepares database columns.
- MySQL Insert writes to `webhook_logs`.
- Success Response confirms the event was stored.
- Error Response returns validation or insert failures.

## Required Credentials

- `MYSQL_CREDENTIAL`: n8n MySQL credential.

## Required Environment Variables

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

## Table Creation

Run `mysql-schema.sql` against the target database before importing or activating the workflow.

## Sample Input

See `sample-payload.json`.

## Sample Output

```json
{
  "ok": true,
  "status": "logged"
}
```

## How to Import

Import `workflow.json`, reconnect `MYSQL_CREDENTIAL`, confirm table name, and save.

## How to Test

Post `sample-payload.json` to the test webhook URL. Then query `webhook_logs` to confirm the row was inserted.

## How to Customize

Add columns for source-specific fields, but keep the full payload JSON for traceability.

## Production Notes

Add indexes for high-volume sources, archive old logs, and avoid storing secrets in payloads.

## Common MySQL Errors

- Table does not exist
- JSON column unsupported on older MySQL versions
- Credential port mismatch
- Insert denied by database permissions
