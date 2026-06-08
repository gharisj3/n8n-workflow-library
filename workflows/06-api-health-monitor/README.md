# API Health Monitor

## Purpose

Monitor one or more API endpoints and log or return their health status.

## Architecture Flow

Schedule Trigger -> Set Endpoint List -> HTTP Request -> Status Code Check -> Latency Capture -> Success Branch or Failure Branch -> Log Result -> Optional Notification Placeholder

## Node-by-Node Explanation

- Schedule Trigger runs the monitor on an interval.
- Set Endpoint List defines endpoints to check.
- HTTP Request calls each endpoint.
- Status Code Check marks expected codes as healthy.
- Latency Capture records timing metadata where available.
- Success Branch handles healthy results.
- Failure Branch handles unhealthy results.
- Log Result prepares an audit record.
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

Run manually in n8n and inspect the Log Result node output.

## How to Customize

Add per-endpoint thresholds, region labels, or service owner metadata.

## Production Notes

Store health history outside execution logs if you need reporting, uptime calculations, or incident audits.

## Common Errors

- Endpoint requires authentication
- Placeholder URL was not replaced
- Timeout too low for expected API behavior
- Notifications are added before alert noise rules are defined
