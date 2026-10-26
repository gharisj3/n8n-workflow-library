# Chunked Batch Processor

## Purpose

Process large arrays in controlled chunks to reduce rate-limit, memory, and timeout failures.

## Architecture Flow

Webhook Trigger -> Load Input Array -> Input Valid? -> Expand Items -> Split In Batches (loop output) -> Process Item Placeholder -> Delay / Rate Limit -> back to Split In Batches. The done output goes to Collect Results -> Handle Failed Items -> Return Summary. Invalid input returns HTTP 400 before entering the loop.

## Node-by-Node Explanation

- Webhook Trigger receives an item array in the request body.
- Load Input Array expands the request body into individual items.
- Validate Array checks that `items` is an array.
- Split In Batches processes a fixed number of items per cycle.
- Process Item Placeholder represents your real work node.
- Delay / Rate Limit pauses between batches.
- Collect Results formats processed item results.
- Handle Failed Items separates failed results for review.
- Return Summary reports totals.

The placeholder processes every input item and supports `simulate_failure: true` on an item for an offline failure example. Counts and failed_items are derived from results, not hardcoded. Replace the placeholder with real work while preserving one result per item and its status. Offline tests exercise the Code nodes and graph contract; they do not certify n8n runtime behavior.

The graph follows n8n's [Loop Over Items](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/) contract: loop output for batches and done output for combined results. Code nodes use explicit [all-items mode](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/).

## Required Credentials

None by default.

## Required Environment Variables

None by default.

## Batch Size

Default sample batch size is `3`. Use smaller batches for slow APIs and larger batches for local-only processing.

## Rate Limit Strategy

Keep a Wait node between batches or before external requests. Match the delay to the strictest downstream API limit.

## Retry Behavior

Retries should be bounded and should route exhausted failures to the dead-letter workflow.

## Failed Item Handling

Failed items should keep the original item ID, error reason, and processing timestamp.

## Sample Input

See `sample-batch-input.json`.

## Sample Output

See `sample-batch-output.json`.

## How to Import

Import `workflow.json`, inspect the placeholder processing node, and set your batch size.

## How to Test

Post `sample-batch-input.json` to the test webhook URL and confirm the response summary.

## How to Customize

Replace Process Item Placeholder with an HTTP Request, database operation, or application-specific transformation.

## Production Notes

Use idempotency keys, persistent logs, and dead-letter routing for failed items.

## Common Errors

- Input `items` is not an array
- Batch size is too large
- Downstream API throttles requests
- Failed items are not persisted
