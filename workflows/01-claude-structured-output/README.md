# Claude Structured Output Workflow

## Purpose

Accept raw text through a webhook, send it to Claude API, request structured JSON output, validate required fields, and return clean structured data.

## Architecture Flow

Webhook Trigger -> Normalize Input -> Build Claude Request -> HTTP Request to Claude API -> Parse JSON Response -> Validate Required Fields -> Respond Success or Respond Error

## Node-by-Node Explanation

- Webhook Trigger receives a `POST` payload with a `text` field.
- Normalize Input trims the text and creates a request ID.
- Build Claude Request creates a schema-focused prompt and request body.
- HTTP Request to Claude API sends the payload using `CLAUDE_API_CREDENTIAL`.
- Parse JSON Response extracts structured data from the provider response.
- Validate Required Fields checks `title`, `priority`, `category`, `summary`, and `action_items`.
- Respond Success returns the structured object.
- Respond Error returns a clear validation or API error.

## Required Credentials

- `CLAUDE_API_CREDENTIAL`: HTTP header credential for the Claude API.

## Required Environment Variables

- `CLAUDE_API_KEY`
- `CLAUDE_API_URL`: your Anthropic Messages-compatible endpoint URL
- `CLAUDE_MODEL`: a model available to your account; no placeholder model is selected automatically

Configure `CLAUDE_API_CREDENTIAL` to send the provider's API-key header. This template includes the Messages API version header. No live provider call has been verified here; choosing a valid model and testing the full provider contract are required before use.

## Sample Input

See `sample-input.json`.

## Sample Output

See `sample-output.json`.

## How to Import

Import `workflow.json` in n8n, reconnect `CLAUDE_API_CREDENTIAL`, then save the workflow.

## How to Test

Send `sample-input.json` to the test webhook URL with a `POST` request. Confirm the response matches the required structured fields.

## Error Handling

The workflow returns an error response when input text is missing, the API call fails, JSON parsing fails, or required fields are missing.

## How to Customize Schema

Update the Build Claude Request node with your required fields, then update the Validate Required Fields node to match the new schema.

## Production Notes

Set request timeouts, capture execution IDs in logs, and avoid sending sensitive text unless your provider agreement permits it.

## Common Errors

- Missing `text` field
- Invalid Claude API credential
- Provider response is not parseable JSON
- Schema fields missing from the response
