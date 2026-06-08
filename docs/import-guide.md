# Import Guide

## Import a Workflow JSON File

1. Start n8n locally or open your n8n instance.
2. Open the workflow list.
3. Choose **Import from File**.
4. Select one `workflow.json` from a workflow folder.
5. Save the imported workflow with a clear environment-specific name.

## Review Nodes After Import

After importing, open each node and verify:

- Webhook path
- HTTP method
- Request body expressions
- Database table names
- Endpoint URLs
- Branching conditions
- Error handling behavior

## Reconnect Credentials

Imported workflows use placeholder credential names. Create matching credentials in n8n, then reconnect each node:

- `CLAUDE_API_CREDENTIAL`
- `MYSQL_CREDENTIAL`
- `ODOO_API_CREDENTIAL`
- `GENERIC_HTTP_CREDENTIAL`

Never paste API keys into workflow JSON.

## Activate Safely

- Test with sample data first.
- Confirm the response format.
- Confirm write operations target a development database or sandbox endpoint.
- Activate only after a complete test run.
- Keep high-risk workflows inactive until credentials and limits are reviewed.
