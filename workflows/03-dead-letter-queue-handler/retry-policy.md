# Retry Policy

## Max Retries

Default maximum retries: `3`.

The workflow reads `retry_count` and `max_retries` from the failed event. If `max_retries` is absent, use `3`.

## Retry Delay

Recommended retry delay:

- Retry 1: 5 minutes
- Retry 2: 15 minutes
- Retry 3: 60 minutes

Use a Wait node or queue-specific scheduling when implementing the retry branch in production.

## Recoverable Errors

- HTTP 408 timeout
- HTTP 429 rate limit
- HTTP 500, 502, 503, or 504
- Temporary database connection failure
- Temporary DNS or network failure

## Non-Recoverable Errors

- HTTP 400 malformed request
- HTTP 401 or 403 authorization failure
- HTTP 404 missing resource when the resource is required
- Schema validation failure
- Missing required business identifiers

## Manual Review Process

Final dead-letter events should include the original payload, source workflow, error category, retry count, and a manual review status. Reviewers should decide whether to fix the source data, replay the event, or close it as unrecoverable.
