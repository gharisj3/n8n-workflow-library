# Production Hardening

## Retries

Use bounded retries for transient failures. Avoid infinite retry loops. Track `retry_count` on failed events and route exhausted events to a dead-letter workflow.

## Rate Limits

Add delay nodes or split-in-batches nodes before calling external APIs. Keep batch size configurable and test against the strictest API limit.

## Timeout Handling

Set request timeouts on HTTP nodes. Treat timeout failures as recoverable only when the target operation is idempotent or can be safely checked.

## Input Validation

Validate required fields before writes or external calls. Reject malformed payloads early and return structured error responses.

## Audit Logs

Log request ID, workflow execution ID, source system, event type, decision path, and final status. Avoid logging secrets or sensitive payload fields.

## Idempotency

Use external references, request IDs, or source event IDs to prevent duplicate writes. Store processed IDs where the business process requires exactly-once behavior.

## Dead-Letter Queues

Route unrecoverable or exhausted retry events to a dedicated dead-letter workflow. Include failure category, original payload, error message, and manual review status.

## Secret Management

Store secrets in n8n credentials or environment variables. Do not commit `.env` files. Rotate keys when credentials are exposed or when team access changes.

## Environment Separation

Use separate workflows, credentials, endpoints, and databases for development, staging, and production.
