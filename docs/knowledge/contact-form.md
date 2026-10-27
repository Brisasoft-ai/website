# Contact form — how it works

`/vi/contact/` (and EN/JA) posts JSON to `POST /api/contact`, handled by `worker/index.js`.
The static form is progressive: without JavaScript the visitor still sees the email link on the page.

## Validation

- Required: `lastName, firstName, email, company, country, message`
- `email` must match a basic address pattern; body capped at 12 KB
- Hidden `hp` field (honeypot): if filled, the request is answered `{ok:true}` and dropped
- All values are trimmed, newlines collapsed and truncated before being put in an email

## Delivery providers (first match wins)

| Order | Env var | Use |
|---|---|---|
| 1 | `CONTACT_WEBHOOK_URL` | Slack / Teams / Zapier / n8n webhook, receives `{text}` |
| 2 | `RESEND_API_KEY` (+ `CONTACT_FROM`, `CONTACT_TO`) | Resend transactional email |
| 3 | `CONTACT_EMAIL` binding | Cloudflare Email Routing `send_email` binding |

Set one with `npx wrangler secret put CONTACT_WEBHOOK_URL` (or in the dashboard for the Worker).

**If none is configured** the API answers `{ok:false, error:"not_configured", mailto:"..."}` and the
front end opens the visitor's mail client with a prefilled message to `contact@brisasoft.net`.
No lead is silently lost. Current status: **not configured** (mailto fallback active).

## Response codes

| Code | Meaning |
|---|---|
| 200 `{ok:true}` | Sent (or honeypot dropped) |
| 422 `{error:"validation", fields:[…]}` | Missing/invalid fields |
| 502 `{error:"provider", mailto}` | Provider failed; visitor gets the mailto fallback |
| 413 / 405 | Body too large / wrong method |

## Test locally

```bash
npx wrangler dev --port 8799 --local
curl -s -X POST http://127.0.0.1:8799/api/contact -H 'Content-Type: application/json' \
  -d '{"lastName":"Nguyen","firstName":"Nam","email":"nam@example.com","company":"ABC","country":"VN","message":"AI consulting"}'
```

## Related

- Privacy page must stay consistent with the consent line in the form.
- Spam: honeypot only. If spam starts, add Cloudflare Turnstile and verify the token in `worker/index.js`.
