# Brisasoft website

Static, multilingual (EN / JA / VI) company site. No dependencies, only Node 18+.

## Structure
- `src/i18n/{en,ja,vi}.json`: all text. Every language must have the same keys (the build fails otherwise).
- `src/pages/*.html`: page templates (home, about, bis, contact). `src/layout.html`: shared head and body.
- `src/company.json`: legal name, business registration number, address, phone. **Empty values are hidden**. Fill only verified facts.
- `build.mjs`: generates `dist/` (12 pages, root language redirect, sitemap, robots, headers).
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
Only facts confirmed by the founder. No customers, funding, revenue, employees, partners, certifications or testimonials unless provided.

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
