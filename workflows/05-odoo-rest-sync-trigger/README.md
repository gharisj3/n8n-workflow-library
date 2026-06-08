# Odoo REST Sync Trigger

## Purpose

Receive a webhook payload and sync it to Odoo through a REST API style HTTP request.

## Architecture Flow

Webhook Trigger -> Normalize Incoming Payload -> Map Fields for Odoo -> HTTP Request to Odoo -> Success Branch or Error Branch -> Respond to Webhook

## Node-by-Node Explanation

- Webhook Trigger receives incoming source data.
- Normalize Incoming Payload trims fields and applies defaults.
- Map Fields for Odoo converts generic fields to Odoo-style fields.
- HTTP Request to Odoo sends the mapped body using `ODOO_API_CREDENTIAL`.
- Success Branch formats a successful sync response.
- Error Branch formats API failure details.
- Respond to Webhook returns the final result.

## Required Credentials

- `ODOO_API_CREDENTIAL`: HTTP credential for Odoo REST access.

## Required Environment Variables

- `ODOO_BASE_URL`
- `ODOO_API_KEY`

## REST Endpoint Placeholders

The workflow uses `https://api.example.com/endpoint`. Replace this with your Odoo REST endpoint or middleware endpoint after import.

## Field Mapping

See `field-mapping.md`.

## Sample Input

See `sample-odoo-payload.json`.

## Sample Output

```json
{
  "ok": true,
  "status": "synced",
  "external_reference": "lead-odoo-501"
}
```

## How to Import

Import `workflow.json`, reconnect `ODOO_API_CREDENTIAL`, and replace the placeholder URL with your endpoint.

## How to Test

Post `sample-odoo-payload.json` to the test webhook. Confirm the outgoing body in the HTTP node before sending to production.

## How to Customize

- Leads: map `email` to `email_from` and `company_name` to `partner_name`.
- Contacts: map `email` to `email` and `company_name` to a company relation.
- Invoices: map `external_reference` to an idempotency or origin field.

## Production Notes

Use idempotency, log Odoo record IDs, and avoid retrying non-idempotent create requests without an external reference.

## Common Sync Errors

- Missing required Odoo model fields
- Invalid API token
- Endpoint path points to the wrong model
- Duplicate external reference handling is not defined
