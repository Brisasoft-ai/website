# Final QA report (2026-10-16)

**Status: READY FOR PRODUCTION REVIEW**, with the owner confirmations listed at the end. Nothing has been deployed to production in this pass. Staging (`stg.brisasoft.net`) runs the same build.

## Evidence (commands and checks actually run)
| Check | Result |
|---|---|
| `node build.mjs` | Pass, 30 pages + root; fails on any i18n key mismatch between JA/EN/VI |
| Device-emulated browser check (headless Chrome over DevTools Protocol): 3 languages × 10 pages × 320/390/768/1366/1920 px | 150 of 150 clean: no horizontal overflow, exactly one h1, no `<img>` without alt, no console errors |
| Internal link check on `dist` | 902 links incl. anchors, 0 broken |
| Metadata uniqueness | 0 duplicate titles, 0 duplicate descriptions across 30 pages; sitemap lists 30 URLs |
| Staging, real browser at phone width, 6 pages | 0 console/CSP errors, images load, mobile menu opens |
| Staging headers | CSP, HSTS and `x-robots-tag: noindex` present |
| Staging HTTP→HTTPS | `http://stg.brisasoft.net/ja/` → 301 |
| Visual review of screenshots | Home JA 1366, Services JA 1366, Founder JA 1366, About JA 1366 and 390 (before/after table fix) |
| `npm audit` (earlier in session) | 0 vulnerabilities |
Blue redesign pass: 150/150 clean again after the colour changes; Home and About screenshots reviewed at 1366 and 390 px, and Home in OS dark mode (12 combinations clean). Capital updated to VND 1 billion; address intentionally unchanged.
Not run: Lighthouse, axe or other automated accessibility tooling, real iOS/Android devices, screen-reader testing, production checks of the new build.

## Acceptance criteria
### Content
- [x] No vague headcount range remains: "10–50" absent from `dist` (searched), headcount is 正社員12名（2026年10月現在） / 12 full-time employees / 12 nhân viên chính thức.
- [x] No founder history presented as company history: 沿革 starts October 2024; 2011 and HEDSPI appear only on the founder page and in the attributed experience note.
- [x] Establishment date consistent across languages (single fact file).
- [x] Every published statistic has a definition (30+, 70/30, 70%); evidence is the founder's confirmation (no independent records seen).
- [x] Repeated and low-value copy removed (change register C2–C5, C7, C9, C15, C22).
- [x] Company profile and founder profile separated (About table vs founder page).

### Localization
- [x] Japanese rewritten in corporate register with glossary (`japanese-style-guide.md`). **Not yet reviewed by a native speaker**: do not treat as final.
- [x] English and Vietnamese edited per their guides.
- [x] Terminology unified (プロダクト, プロトタイプ, one CTA wording).
- [x] Facts identical across languages (registry).
- [x] No unverified number published; capital is marked approximate.
- [x] Japanese wrapping verified on 320–1920 px (no overflow); the company table stacks on phones.

### Design
- [x] Hierarchy clear (one h1 per page). [x] Company facts scannable. [x] Cards share one style.
- [ ] Components fully on a consolidated design system: **not done**; stylesheet layers documented as debt in `design-system.md`.
- [x] Images relevant and owned (founder photo supplied by owner; four original SVGs). [x] Links and buttons work (link check, staging browser check).

### Technical
- [x] Build, link, responsive and staging checks pass. [x] SEO metadata, hreflang and sitemap generated per language. [x] Staging and production stay separate (staging noindex).
- [ ] Accessibility and performance: only structural checks; no formal audit or measured scores.

## Remaining issues and owner confirmations
1. **Capital**: resolved (VND 1 billion, owner 2026-10-16).
2. **Address**: kept unchanged by owner decision until the post-reform address is settled; native check of the JA rendering still advised.
3. **Japanese review** of the whole site by a native speaker familiar with SIer communication.
4. **Founder message**: final read in all three languages.
5. **Production**: new build not yet deployed; after release re-run the HTTP→HTTPS and www→apex checks on `brisasoft.net` (the Worker redirect has only been verified on staging).
6. Optional: consolidate `style.css`; run Lighthouse and axe once available.
