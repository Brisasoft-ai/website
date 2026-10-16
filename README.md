# Brisasoft website

Static, multilingual (EN / JA / VI) company site. No dependencies, only Node 18+.

## Structure
- `src/i18n/{en,ja,vi}.json`: all text. Every language must have the same keys (the build fails otherwise).
- `src/pages/*.html`: page templates (home, about, founder, services, products, bis, aab, insights, contact, privacy). `src/layout.html`: shared head and body.
- `src/company.json`: legal name, business registration number, address, phone. **Empty values are hidden**. Fill only verified facts. `stats[]` (home/about figures) and `technologies[]` (technology section) have a `show` flag: switch on only after the fact is confirmed in `docs/knowledge/company-profile.md`.
- `build.mjs`: generates `dist/` (30 pages, root language redirect, 404, sitemap, robots, headers incl. CSP).
- `docs/knowledge/`: verified company and founder facts. `docs/website-audit/`: audit, claim register, IA and release report.
- `assets/`: CSS, JS, flag SVGs, `og.png`. `public/`: copied to the site root (favicon).
- `_archive/`: the previous template pages (not deployed, contains invented content, do not republish).

## Commands
- `node build.mjs`: build into `dist/`
- `node build.mjs && node serve.mjs`: build and preview at http://localhost:8788

## Deploy to Cloudflare Pages
- Build command: `node build.mjs`
- Build output directory: `dist`
- Custom domain: `brisasoft.net` (add it in the Pages project, do not create the CNAME by hand first)

## Content rules
Company facts (since October 2024) and the founder's personal history (since 2011, other organisations) stay separate. Only facts confirmed by the founder. No customers, funding, revenue, employees, partners, certifications or testimonials unless provided.

## Environments and CI/CD
| Env | URL | Trigger |
|---|---|---|
| local | http://localhost:8788 | `npm run dev` |
| staging | https://stg.brisasoft.net (noindex) | push to `main` (automatic) |
| production | https://brisasoft.net | push tag `v*` or manual run, needs approval in the GitHub `production` environment |

- PR: `ci.yml` builds the site. Merge to `main` deploys staging, then smoke tests it.
- Release: `git tag v1.0.1 && git push origin v1.0.1`, then approve the `production` job.
- Secrets (repo or environment): `CLOUDFLARE_API_TOKEN` (scope: Workers Scripts Edit, Workers Routes/Custom Domains, Zone DNS Edit for brisasoft.net) and `CLOUDFLARE_ACCOUNT_ID`.
- Manual deploy: `npm run deploy:stg` / `npm run deploy:prod` (the deploy:stg script uses `SITE_ENV=staging` syntax for bash).
- Cost: Cloudflare Workers free plan, GitHub Actions free minutes. No paid service.
