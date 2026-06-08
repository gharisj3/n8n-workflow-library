# Field Mapping

| Source Field | Odoo Target Field | Notes |
|---|---|---|
| `name` | `name` | Required display name |
| `email` | `email_from` or `email` | Use `email_from` for leads and `email` for contacts |
| `phone` | `phone` | Normalize country code before production use |
| `company_name` | `partner_name` or `company_name` | Target depends on Odoo model |
| `external_reference` | `x_external_reference` | Custom field recommended for idempotency |

For contacts, map to the partner model. For leads, map to the CRM lead model. For invoices, map the external reference to the invoice origin or a custom idempotency field.
