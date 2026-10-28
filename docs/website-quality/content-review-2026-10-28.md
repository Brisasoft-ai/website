# Multilingual content review — 2026-10-28

Scope: all user-facing copy in EN, JA and VI (`src/i18n/*.json`, hardcoded strings in
`build.mjs`, page templates and `src/portfolio.json`).

## Method

- Three language-specialist review agents (EN, JA, VI) checked the full copy against:
  - `docs/website-quality/{english,japanese,vietnamese}-style-guide.md`
  - `docs/knowledge/content-standards.md`
  - `docs/knowledge/company-profile.md`
  - `docs/website-quality/multilingual-content-registry.md`
  - the other two language files, for factual consistency.
- The English founder message was treated as founder-approved source text. Only the
  requested correction (`software engineer`, not `software engineering`) and the removal
  of the contact block were applied.
- Automated checks were added in `test/content.test.mjs` and run with `npm test`.
  CI and both deploy jobs now run the same checks.

## Applied

### Founder message

- Removed the website/email contact lines from the message.
- Corrected the career step in EN to “from software engineer to project leadership…” and
  aligned VI/JA (`kỹ sư phần mềm`, `ソフトウェアエンジニア`).
- Kept the approved three focus areas and the FDE paragraph; standardised the VI/JA
  translations without changing substance.

### Blockers / factual consistency

- Removed references to a nonexistent “Terms of Use” page from the contact-form consent
  in all three languages.
- Fixed the Japanese legal page typo `事先` → `事前`.
- Aligned BIS status everywhere to “Working prototype” / 「稼働中のプロトタイプ」 /
  “Bản prototype đang chạy”, including meta descriptions and FAQ copy.
- Defined both ratios in the homepage stats note: 70/30 by number of projects, 70% of
  engineers (all three languages).
- Added the company-website field to the privacy notice’s list of collected form data.
- Matched the privacy-notice address to the registered address in `src/company.json`.
- Fixed Vietnamese grammar in the hero (“chịu trách nhiệm về”), the infrastructure
  milestone, and the consent/form wording.
- Standardised Vietnamese spelling `hoá` → `hóa` and `Hoá` → `Hóa`.
- Fixed the Vietnamese skip link and 404 wording.

### Editorial and structural

- Corrected EN grammar and collocations (e.g. “work closely with”, “the documentation
  that Japanese projects require”, “stored for 12 months”, parallel legal rights).
- Removed the unreachable AAB FAQ item `aab.q4`; it now renders on the AAB page.
- Improved JA corporate register and terminology (e.g. `アーキテクチャ設計`,
  `AI学習支援システム`, `プロダクト`, `よくあるご質問`, full-width parentheses).
- Removed VI/EN terminology drift (`review code` → `rà soát mã nguồn`,
  `workflow` → `quy trình nghiệp vụ`, `timer` → `bộ hẹn giờ`).
- Aligned page titles/meta separators and the JA privacy-notice name.

## Deliberately not changed

- Founder-approved wording and structure of the English message beyond the requested
  correction.
- Stylistic suggestions that would rewrite the founder’s voice or introduce new claims.
- “Ontology” in the portfolio copy: it is used as a precise knowledge-modelling term.
- A Terms of Use document: the site does not have one, so the consent no longer links to
  one. Publish a Terms page before referring to it again.

## Verification

`npm test` — 14 checks, 0 failures:

- i18n key parity and founder-message structure
- no contact block in the founder message/template/rendered page
- approved EN wording and VI/JA career-step alignment
- shared facts (15 years, 2011, 2024, HEDSPI, Dario Amodei, focus areas)
- consent no longer references a missing Terms page
- stats definitions, BIS status consistency, VI spelling
- AAB Q4 rendered, no unresolved template placeholders in generated HTML

Local smoke test: all 36 generated pages return HTTP 200.
