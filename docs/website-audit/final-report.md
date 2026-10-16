# Final report: Brisasoft website repositioning and audit

Date: 2026-10-16 · Scope: repository `brisa_homepage` and live `brisasoft.net` (read-only checks) · Nothing was deployed and no infrastructure setting was changed.

**Overall status: READY WITH CONDITIONS.** The code builds and passed every check that was run. Before production, the founder must approve the items in section 10 (mainly the founder message, the 30+/70-30 attribution and the practice statements). Release through the normal staging → tag → approval flow.

## 1. Executive summary
The site now presents Brisasoft as an **AI-native engineering company for Japanese and Vietnamese clients**, not a generic "AI products" studio. Company facts and the founder's personal history are separated, with a new founder page and first-person message in three languages. Every figure carries its scope. Unsupported claims (a BPMN certification, over-broad AI promises) were removed or narrowed. Technologies are shown with where they were used. A pre-existing mobile bug that made every page scroll sideways on phones was fixed, and a Content-Security-Policy was added.

## 2. Current-state audit (summary)
See `baseline.md`. Key issues: company and founder timelines mixed; no founder story; generic hero; an unverifiable certification claim; AI claims phrased as guarantees; mobile horizontal overflow; HTTP served without redirect; no HSTS or CSP live.

## 3. Implemented changes
- **Home** rebuilt around the customer journey (see `brand-and-ia.md`): new hero with a localized process diagram, defined figures, 6 problem-based services, 6-step approach showing where AI helps, 4 principles including FDE, BIS/AAB case studies with an AAB process diagram, technology-in-context, founder excerpt, delivery and quality checklist, single CTA.
- **New page** `/{lang}/about/founder/`: full founder message, profile timeline, note that pre-2024 projects are personal experience.
- **About**: company-only milestones (2024 onward), figures, team section, founder quote and link.
- **Services**: 6-step process, corrected AI bullets, pre-filled email CTA. **Contact**: "helpful to include" list, pre-filled localized subject.
- **Data model** (`src/company.json`): `stats[]` and `technologies[]` with `show` flags, `founder.photo`. Held facts are prepared but off.
- **Build**: founder page, generated stats/technology/founder blocks, `founder` in Organization JSON-LD, CSP with the root script allowed by hash, nav highlights About on the founder page, footer link.
- **CSS**: components for the above; mobile menu changed to fade so it no longer widens the page.
- **Docs**: `docs/knowledge/company-profile.md` (fact base), `docs/website-audit/*` (this set, plus `reference-analysis.md`).

## 4. Company and founder content
- Company: "Brisasoft (brand: Brisa) is an engineering company in Hanoi, Vietnam, founded in October 2024. We build software and AI solutions for clients in Japan and Vietnam, and two AI products of our own: BIS and AAB."
- Figures: 2024 founded · 30+ projects in the delivery experience of the founder and core team since 2011 · 70 / 30 Japan/Vietnam share of those projects by number · 2 own AI products in development. Note under the figures states that pre-2024 work is included and how percentages are computed.
- Founder message: six paragraphs (origin since 2011 → problem with ticket-taking outsourcing → why Brisasoft in 2024 → FDE ambition as a standard being built → AI does not replace judgement; non-AI when better → long-term partner). Text: `founderMsg.*` in each `src/i18n/*.json`.

## 5. Technology portfolio
| Technology | Shown | Evidence | Missing |
|---|---|---|---|
| Dify | Yes | AAB agents | Client project, if any |
| Camunda | Yes | AAB core; BPMN project experience | Which past projects used Camunda specifically |
| Microsoft 365 | Yes | AAB; internal system integration | n/a |
| SAP / ERP | Yes, labelled founder experience | Founder's Japan projects | n/a |
| intra-mart, Shopify, Pega | **No** (copy ready, `show:false`) | None in repo or site | One approved project each |

Logos: text marks are used. Official logos were not added because each vendor's brand guidelines must be reviewed and logo use can read as endorsement. To add one, place the approved file in `assets/tech/` and extend `techBlock` in `build.mjs`.

## 6. Security report
| ID | Severity | Component | Evidence | Impact | Remediation | Status |
|---|---|---|---|---|---|---|
| S-01 | Medium | Cloudflare zone | `curl http://brisasoft.net/` → 200, no redirect (also `http://www.`) | First visit over HTTP can be intercepted or altered | Enable Cloudflare **Always Use HTTPS** (zone setting) | Owner reports Always Use HTTPS enabled (2026-10-16), but `curl -I http://brisasoft.net/` still returned 200 afterwards: **still open**, re-check the zone setting |
| S-02 | Low | Response headers | Live: no `Strict-Transport-Security` | Browsers do not pin HTTPS | Already in code (`max-age=15552000`); after S-01 consider `includeSubDomains` and longer max-age | Fixed in code, takes effect on deploy |
| S-03 | Low | Response headers | Live: no CSP | No defence-in-depth against injected script | CSP added: `default-src 'self'`, script hash for root redirect, `frame-ancestors 'none'`, `object-src 'none'` | Fixed in code. Staging check found Cloudflare Web Analytics (edge-injected beacon) blocked; CSP now allows `static.cloudflareinsights.com` / `cloudflareinsights.com`. Re-verified on staging: 0 violations on 6 pages. If Cloudflare Web Analytics, Rocket Loader or email obfuscation is enabled later, update the CSP |
| S-04 | Informational | `www.brisasoft.net` | Serves 200 (duplicate host) | Duplicate content; canonical tags already point to apex | Add a 301 redirect rule www → apex | Confirmed; not changed (infra) |
| S-05 | Informational | Repository / artifacts | `/.git/config`, `/package.json` → 404; only `dist/` is published; no secrets in repo files reviewed; deploy secrets via GitHub environments | n/a | Keep `production` environment reviewers enabled | Not found |
| S-06 | Informational | Dependencies | `npm audit` → 0 vulnerabilities (dev-only `wrangler`) | n/a | Keep Dependabot or periodic audit | Not found |
| S-07 | Informational | Privacy | No forms, no cookies, no third-party scripts; contact via `mailto:`; language choice in localStorage; privacy notice matches this | n/a | Re-review the notice if analytics or a form is added | Reviewed |

Not applicable: authentication, sessions, CSRF, injection, uploads, SSRF, IDOR (static site with no backend). Not tested: TLS configuration details, DNS records, backups and monitoring (no access; outside an unauthorized audit).

## 7. SEO, accessibility, performance
- **SEO**: unique localized title/description per page (founder page added), canonical + hreflang (incl. x-default) on every page, sitemap now 30 URLs, staging sends `X-Robots-Tag: noindex` and `Disallow: /`. JSON-LD Organization now includes `founder` and `addressLocality`; no Service/Review markup added (nothing to substantiate it).
- **Accessibility** (automated checks only, not a WCAG audit): exactly one `<h1>` and no `<img>` without `alt` on all 30 pages; diagrams are real HTML lists (screen-reader readable, localized); figures section has a visually hidden heading; existing skip link, focus styles and reduced-motion rules kept. Manual keyboard and screen-reader testing not done.
- **Performance** (no Lighthouse available, no score claimed): home HTML 20.9 KB (6.4 KB gzipped), CSS 34.8 KB (8.1 KB gzipped), JS 1.4 KB, no web fonts, no third-party requests, no images added; the decorative hero SVG was replaced by lighter HTML.

## 8. Test results (commands actually run)
| Command / check | Result |
|---|---|
| `node build.mjs` | Pass: "Built 30 pages + root" (i18n key parity enforced) |
| `npm audit` | 0 vulnerabilities |
| Device-emulated check, headless Chrome over CDP: 3 languages × 10 pages × widths 320/390/768/1366/1920 | Before menu fix: 90 of 150 with horizontal overflow (closed mobile menu). After: **0 of 150** with overflow, missing alt, extra/missing h1 or console errors |
| CSP check: `dist` served with the generated CSP, 5 pages incl. `/` | 0 violations; `/` redirected to `/ja/` for a Japanese browser; menu script ran |
| Internal link check over `dist` (881 links incl. in-page anchors) | 0 broken |
| Visual review of screenshots (EN 1366, EN 768, JA 390) | Layout as intended |
Not run: Lighthouse, axe, visual regression, real iOS/Android devices, staging deploy.

## 9. Files changed
`src/pages/home.html` (rebuilt), `src/pages/founder.html` (new), `src/pages/about.html`, `src/pages/services.html`, `src/pages/contact.html`, `src/i18n/{en,ja,vi}.json` (new sections; removed `home.build`, `home.about`, `numbers`, `about2.t0`), `src/company.json` (stats, technologies, founder.photo), `build.mjs` (founder page, blocks, mailto, JSON-LD, CSP), `assets/style.css` (new components, menu fix), `README.md`, `docs/**` (new). The owner's earlier uncommitted changes (privacy, 404, HSTS, a11y) are preserved.

## 10. Founder approval list
Resolved 2026-10-16: 30+ = founder + core team (all pages aligned); universities; AI-per-step and the 8 practices are current; title Founder & CEO with portrait; Always Use HTTPS enabled by the owner (re-verify, see S-01).

Still open:
1. Founder message text in EN/JA/VI (voice, the "ticket-takers" framing).
2. 70/30 is by number of projects.
3. Team: dated headcount (to enable `team`), and whether to publish "70%+ of engineers" (to enable `aiEngineers`).
4. BPMN certification: provide details or confirm removal.
5. intra-mart / Shopify / Pega: one approved project each, or keep hidden.
6. Japanese copy review by a native speaker familiar with SIer communication.

## 11. Production deployment checklist
1. Founder approves section 10 (edit `src/i18n/*` or `src/company.json` as needed; `node build.mjs`).
2. Commit and push to `main` → staging deploy and smoke test run automatically. Add `/en/about/founder/` and `/en/privacy/` to the smoke-test list in `deploy.yml` (recommended).
3. On `stg.brisasoft.net`: check response headers include CSP and HSTS; open browser console on `/`, `/ja/`, a product page; confirm no CSP errors; test the mobile menu on a real phone; test the language switcher on the founder page.
4. With authorization: enable Always Use HTTPS (S-01) and the www → apex redirect (S-04).
5. Tag `vX.Y.Z` and approve the `production` job; verify the same headers on `brisasoft.net`.
6. **Rollback**: re-deploy the previous tag (`workflow_dispatch` on the old tag) or `wrangler rollback`. The CSP is the only change that can block functionality; if it causes problems, remove that one line from `_headers` generation and redeploy.
Remaining risks: unapproved founder-voice text going live; CSP interaction with Cloudflare features not visible from the repo.
