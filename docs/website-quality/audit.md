# Website quality audit (2026-10-16)

Scope: source repository and `https://stg.brisasoft.net` (all 10 pages × JA/EN/VI). Earlier audits: `docs/website-audit/`.

## Architecture (inspected in source)
- Static generator `build.mjs`; templates `src/pages/*.html`; one text file per language `src/i18n/{en,ja,vi}.json` (build fails if keys differ); facts in `src/company.json` (figures and technologies switched by `show`).
- All languages share the same templates and the same fact file, so **facts cannot diverge by language**; wording is edited per language.
- Dynamic parts generated in `build.mjs`: header/footer, company table, figures, technology list, founder card, JSON-LD, sitemap, headers (CSP/HSTS).
- Hosting: Cloudflare Worker (`worker/index.js`) with static assets; staging is `noindex` (header and robots.txt).
- Styling: one stylesheet `assets/style.css` (about 40 KB) built up in layers; later sections override earlier ones. No web fonts, no framework.

## Problems found before this pass

| # | Problem | Where | Origin |
|---|---|---|---|
| A1 | Two different service taxonomies (6 cards on Home, 4 services on Services) | Home, Services | Content model |
| A2 | Six-step process shown twice | Home, Services | Content duplication |
| A3 | Milestones shown twice (会社概要 沿革 and Insights) | About, Insights | Content duplication |
| A4 | Domain experience shown twice (Services "Japan" block and Insights) | Services, Insights | Content duplication |
| A5 | Both products labelled "Flagship product / 主力プロダクト" | BIS, AAB | Copy |
| A6 | BIS status inconsistent: "experimental version", "試験版", "working prototype" | meta, BIS, Products | Copy |
| A7 | Literal Japanese: 「知識はある。しかし知性はスケールしない。」「プロセスが、受信箱とスプレッドシートの中にある」, mixed 製品/プロダクト | BIS, AAB, nav | Translation |
| A8 | Ordinary facts as giant numbers (founded year, headcount, product count) | Home figures | Design / content |
| A9 | Banner repeating the products section; footer note "BIS and AAB are products of Brisasoft" | Home, footer | Low-value content |
| A10 | Jargon pills with no information for buyers ("Meta-schema first", "Relation first") | BIS, AAB | Low-value content |
| A11 | Five CTA variants (Contact us, Send an email, Talk about your project, Discuss…, raw email address as button) | All pages | Component inconsistency |
| A12 | 会社概要 on phones: two narrow columns, long Japanese values wrap into 6–8 lines | About | CSS |
| A13 | 所在地 only in Vietnamese; no 資本金 | About | Content |
| A14 | Dify listed with no confirmed project after AAB dropped it | Technology section | Evidence |

Already fixed in previous passes (kept): company vs founder separation, "10–50" range removed, HTTPS redirect, CSP, mobile menu overflow, founder page.

## Verdict
The content model is sound (single fact source, key parity across languages). Most problems were duplication and copy quality, not architecture. CSS layering is technical debt (see `design-system.md`), not a user-facing defect.
