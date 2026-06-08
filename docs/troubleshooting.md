# Troubleshooting

## Invalid JSON Import

Run `python tools/validate_workflows.py`. If a file fails, fix the JSON syntax before importing. Avoid editing workflow JSON with tools that add comments or trailing commas.

## Missing Credentials

Create the placeholder credentials in n8n and reconnect them after import. Credential IDs may differ between environments, so always review credential fields manually.

## Webhook URL Not Working

Confirm the workflow is active for production webhooks. In test mode, use the test webhook URL while the workflow editor is listening.

## MySQL Connection Failed

Check host, port, database name, user, password, and network access. Confirm the `webhook_logs` table exists before running inserts.

## HTTP 401 or 403

Review the credential header name, token format, and API permissions. Confirm the endpoint is not restricted by IP allowlists or missing scopes.

## Odoo API Errors

Confirm the Odoo base URL, model endpoint, required fields, and authentication method. Check whether the target Odoo module requires extra fields.

## Claude API Errors

Check authentication headers, request body shape, model name, token limits, and provider-specific response structure.

## Workflow Not Activating

Review trigger nodes, missing credentials, invalid expressions, and disconnected nodes. Import one workflow at a time and activate only after a successful test execution.
