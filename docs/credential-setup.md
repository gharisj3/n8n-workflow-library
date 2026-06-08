# Credential Setup

## Claude API

Create an HTTP header credential named `CLAUDE_API_CREDENTIAL`.

Recommended header:

```text
Authorization: Bearer {{$env.CLAUDE_API_KEY}}
```

If your Claude API provider requires a different header format, update the credential in n8n rather than editing the workflow export.

## MySQL

Create a MySQL credential named `MYSQL_CREDENTIAL`.

Use environment-specific values:

- Host: `MYSQL_HOST`
- Port: `MYSQL_PORT`
- User: `MYSQL_USER`
- Password: `MYSQL_PASSWORD`
- Database: `MYSQL_DATABASE`

Run the included `mysql-schema.sql` before enabling the logger workflow.

## Odoo REST API

Create an HTTP header credential named `ODOO_API_CREDENTIAL`.

Recommended header:

```text
Authorization: Bearer {{$env.ODOO_API_KEY}}
```

Set the base URL with `ODOO_BASE_URL` and keep endpoint paths configurable inside the HTTP Request node.

## Generic HTTP API Credentials

Create an HTTP header credential named `GENERIC_HTTP_CREDENTIAL` for monitored APIs or future placeholder endpoints.

Recommended header:

```text
Authorization: Bearer {{$env.GENERIC_API_KEY}}
```

Use separate credentials for local, staging, and production environments.
