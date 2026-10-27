# Cookies & consent — how it works

## What the visitor sees

1. **Banner** (bottom, all pages, first visit): title, one-sentence explanation, links to Cookie policy
   and Privacy notice, then three actions in this order — *Cookie settings* · *Reject all* · *Accept all cookies*.
2. **Settings dialog** (`<dialog>`, native modal): Necessary (always on) · Measurement · Marketing.
   Save or close. Reachable at any time from the footer link "Cookie settings" or `?cookie-settings=1` /
   `#cookie-settings`.

## Storage

`localStorage["brisa-consent"] = { v: 1, analytics: bool, marketing: bool, ts: ISO }`
plus `window.brisaConsent` and `<html data-consent="all|necessary">`.

Nothing non-essential runs before a choice:

- Measurement script is only injected after `analytics === true` **and** a token exists
  (`<html data-cf-beacon="...">`). No token is set today, so no third-party script loads.
- If the visitor clears site data, the banner returns.

## Files

| Purpose | File |
|---|---|
| Banner + dialog markup | `src/layout.html` |
| Behaviour | `assets/main.js` (last block) |
| Styling | `assets/style.css` (`.cookie-*`) |
| Policy page | `src/pages/cookies.html` → `/privacy/cookies/` |
| Privacy notice | `src/pages/privacy.html` → `/privacy/` |
| Strings (VI/EN/JA) | `consent`, `cookies`, `privacy` in `src/i18n/*.json` |

## To enable Cloudflare Web Analytics later

1. Get the beacon token in the Cloudflare dashboard (Web Analytics → add site).
2. Set `data-cf-beacon` on `<html>` in `src/layout.html`.
3. The script loads only for visitors who accepted measurement; the CSP already allows
   `https://static.cloudflareinsights.com`.

## Rules for new scripts

- Anything that identifies a visitor or sets a cookie beyond the necessary ones belongs to
  Measurement or Marketing and must stay behind the consent flag.
- Adding a new cookie means updating `cookies.s2` (text), this file, and bumping the cookie version.
- Never load analytics/marketing in the `<head>`; inject after consent only.
