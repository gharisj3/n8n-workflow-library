# CRM Lead Enrichment Router

## Purpose

Receive a CRM lead, normalize it, calculate a lead score, classify it as hot, warm, or cold, and route it accordingly.

## Architecture Flow

Webhook Trigger -> Normalize Lead Data -> Validate Required Fields -> Optional Enrichment Placeholder -> Score Lead -> Route Hot Lead, Route Warm Lead, or Route Cold Lead -> Return Structured Response

## Node-by-Node Explanation

- Webhook Trigger accepts lead submissions.
- Normalize Lead Data standardizes field casing and numeric budget.
- Validate Required Fields checks lead identity and contact data.
- Optional Enrichment Placeholder marks where enrichment can be added.
- Score Lead calculates a simple deterministic score.
- Route Hot Lead handles high-priority leads.
- Route Warm Lead handles mid-priority leads.
- Route Cold Lead handles lower-priority leads.
- Return Structured Response returns score and routing decision.

## Required Credentials

None by default. Add CRM or enrichment credentials when connecting to real systems.

## Required Environment Variables

None by default.

## Scoring Logic

- Budget of `10000` or more adds 40 points.
- Budget between `3000` and `9999` adds 25 points.
- Business email domain adds 20 points.
- Automation-related interest adds 20 points.
- Website or referral source adds 5 points.

## Routing Rules

- `hot`: score `70` or higher
- `warm`: score `40` to `69`
- `cold`: score below `40`

## Sample Input

See `sample-lead-input.json`.

## Sample Output

See `sample-lead-output.json`.

## How to Import

Import `workflow.json`, inspect route placeholder nodes, and connect them to your CRM actions.

## How to Test

Post `sample-lead-input.json` to the test webhook. Modify budget and interest to verify all routes.

## How to Customize

Adjust point values in Score Lead. Replace route nodes with CRM updates, notifications, or assignment logic.

## CRM Integration Options

Connect hot leads to sales tasks, warm leads to nurturing sequences, and cold leads to low-priority lists or self-serve follow-up.

## Production Notes

Keep scoring deterministic, document changes, and log the reason for each routing decision.

## Common Errors

- Budget arrives as formatted text instead of a number
- Required fields are missing
- Free email domain rules are too strict
- Route nodes are not connected to the target CRM
