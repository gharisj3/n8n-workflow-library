# n8n Workflow Library

**Status: workflow templates, not verified live integrations.** Exports contain sample logic and configurable/placeholder endpoints or credentials. Batching, health-record association and validation logic have offline JavaScript checks. This does not replace importing and executing them in n8n. Dead-letter persistence, real item processing and alert delivery are extension points, not implemented production services. Configure the URL/model/storage requirements documented in each workflow before use.

A practical open-source library of production-style n8n workflow exports for common automation patterns: structured API output, webhook logging, failed-event handling, chunked processing, Odoo sync, API monitoring, and CRM lead routing.

This repository is designed as a developer utility library. Each workflow includes an importable `workflow.json`, architecture notes, sample data, and implementation guidance you can adapt without paid tools or hardcoded credentials.

## What Problem This Solves

Teams often rebuild the same automation patterns from scratch: webhook validation, credential-safe API calls, retry routing, operational logging, rate-limit-aware batching, and error handling. This project provides clean starting points that are easy to inspect, import, and customize.

## Who This Project Is For

- Developers building workflow automation with n8n
- Automation consultants creating reusable implementation patterns
- Freelancers delivering maintainable business workflows
- Small businesses validating automations before production rollout
- Repository maintainers who need transparent examples with no secrets

## Workflow List

| # | Workflow | Purpose | Credentials |
|---|---|---|---|
| 01 | Claude Structured Output | Convert webhook text into validated structured JSON | `CLAUDE_API_CREDENTIAL` |
| 02 | Webhook MySQL Logger | Validate and log webhook payloads into MySQL | `MYSQL_CREDENTIAL` |
| 03 | Dead-Letter Queue Handler | Classify failed events and decide retry vs final queue | None required by default |
| 04 | Chunked Batch Processor | Process large arrays safely in rate-limited chunks | None required by default |
| 05 | Odoo REST Sync Trigger | Map incoming payloads to Odoo REST-style fields | `ODOO_API_CREDENTIAL` |
| 06 | API Health Monitor | Monitor API endpoints and capture health status | `GENERIC_HTTP_CREDENTIAL` optional |
| 07 | CRM Lead Enrichment Router | Score leads and route hot, warm, or cold opportunities | None required by default |

## Architecture Philosophy

- Validate inputs before external calls.
- Keep credentials in n8n credentials or environment variables.
- Separate normalization, transformation, routing, and response steps.
- Include explicit error paths for production debugging.
- Use samples that are original and safe to publish.
- Prefer small, understandable workflow patterns over hidden complexity.

## Repository Structure

```text
n8n-workflow-library/
  workflows/
    01-claude-structured-output/
    02-webhook-mysql-logger/
    03-dead-letter-queue-handler/
    04-chunked-batch-processor/
    05-odoo-rest-sync-trigger/
    06-api-health-monitor/
    07-crm-lead-enrichment-router/
  docs/
  assets/
  tools/
```

## Requirements

- n8n self-hosted or local instance
- Python 3 for JSON validation
- Optional MySQL server for the logger workflow
- Credentials configured inside n8n before live use

No paid tools or cloud services are required to inspect, validate, or import these examples.

## Import Workflows Into n8n

1. Open n8n.
2. Create or open a workspace.
3. Select **Import from File**.
4. Choose a `workflow.json` file from one workflow folder.
5. Review every node after import.
6. Reconnect placeholder credentials.
7. Test manually before activating.

See [docs/import-guide.md](docs/import-guide.md) for the full import checklist.

## Credential Setup Overview

Create n8n credentials with these placeholder names, then connect them after import:

- `CLAUDE_API_CREDENTIAL`
- `MYSQL_CREDENTIAL`
- `ODOO_API_CREDENTIAL`
- `GENERIC_HTTP_CREDENTIAL`

Use `.env.example` as a local reference only. Do not commit real `.env` files.

## Test JSON Validity

Run:

```bash
python tools/validate_workflows.py
node --test tools/test_workflows.mjs
```

The validator checks every workflow export for valid JSON and required top-level fields.

The Node.js checks execute selected Code-node logic and verify graph connections with synthetic inputs, including more than one batch and an injected failure. They do not run an n8n instance, call providers, write MySQL or prove live Odoo sync. Configure credentials, endpoints and storage before testing those integrations locally.

## Security Notes

- No real secrets are included.
- No real customer data is included.
- Webhook inputs should be validated before use.
- API credentials should be stored in n8n credentials.
- Production workflows should include audit logs and retry limits.
- Use environment-specific base URLs and credentials.

## Production Hardening Checklist

- Add idempotency keys for write operations.
- Add retry limits and backoff for transient failures.
- Route unrecoverable failures to a dead-letter workflow.
- Log request IDs and workflow execution IDs.
- Set node-level timeouts for external API calls.
- Validate schemas before database inserts or API requests.
- Use separate credentials for development, staging, and production.

## Troubleshooting

- Import issues: [docs/import-guide.md](docs/import-guide.md)
- Credentials: [docs/credential-setup.md](docs/credential-setup.md)
- Hardening: [docs/production-hardening.md](docs/production-hardening.md)
- Common errors: [docs/troubleshooting.md](docs/troubleshooting.md)

## Technical Merit Inbound Strategy

This repository is built to earn attention through usefulness. The workflows are concrete, inspectable, and reusable. Each example solves a real implementation problem and includes documentation that helps another developer understand the architecture without needing a sales page, paid promotion, testimonials, or platform reviews.

## GitHub Push Commands

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/gharisj3/n8n-workflow-library.git
git push -u origin main
```

## License

MIT License. See [LICENSE](LICENSE).
