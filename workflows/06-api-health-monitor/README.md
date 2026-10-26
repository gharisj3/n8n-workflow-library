# API Health Monitor

## Purpose

Monitor one or more API endpoints and log or return their health status.

## Architecture Flow

Schedule Trigger -> Set Endpoint List -> HTTP Request -> Status Code Check -> Latency Capture -> Success Branch or Failure Branch -> Prepare Health Record -> Optional Notification Placeholder

## Node-by-Node Explanation

- Schedule Trigger runs the monitor on an interval.
- Set Endpoint List defines endpoints to check.
- HTTP Request calls each endpoint.
- Status Code Check marks expected codes as healthy.
- Latency Capture records timing metadata where available.
- `latency_ms` is an optional provider-reported header. `elapsed_ms` is observation time since preparing the endpoint item and can include workflow waiting; it is not precise request latency.
- Success Branch handles healthy results.
- Failure Branch handles unhealthy results.
- Prepare Health Record prepares an audit record.
- The template does not persist health history or send alerts; outputs mark those operations as not performed.
- Optional Notification Placeholder is where email, chat, or incident routing can be added.

## Required Credentials

- `GENERIC_HTTP_CREDENTIAL` if monitored endpoints require authentication.

## Required Environment Variables

- `GENERIC_API_KEY` if using the optional credential.

## Endpoint Configuration

Update Set Endpoint List with name, URL, expected status codes, and timeout expectations.

## Schedule Frequency

Start with every 5 minutes for non-critical APIs. Use tighter intervals only when operations require it.

## Status Code Rules

The default rule treats `200`, `201`, `202`, and `204` as healthy.

## Sample Input

This workflow is scheduled, so no input is required.

## Sample Output

See `sample-health-response.json`.

## Alert Placeholder Setup

Replace Optional Notification Placeholder with email, Slack, webhook, or ticketing integration as needed.

## How to Import

Import `workflow.json`, review the schedule, reconnect optional credentials, and update endpoint URLs.

## How to Test

Run manually in n8n and inspect the Prepare Health Record node output.

## How to Customize

Add per-endpoint thresholds, region labels, or service owner metadata.

## Production Notes

Store health history outside execution logs if you need reporting, uptime calculations, or incident audits.

## Common Errors

- Endpoint requires authentication
- Placeholder URL was not replaced
- Timeout too low for expected API behavior
- Notifications are added before alert noise rules are defined
