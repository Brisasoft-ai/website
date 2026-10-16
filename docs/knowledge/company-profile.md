# Brisasoft knowledge base: company and founder facts

Source of truth for facts used on the website. Presentation rules: `content-standards.md`. Each fact has a source and a publication status.
Update this file first, then the site (`src/company.json`, `src/i18n/*.json`).

Status legend:
- **Published**: on the site, wording approved or already public before this revision.
- **Published, confirm**: on the site with conservative wording; founder should confirm the exact wording.
- **Held**: supplied, but not published until the open question is answered (switch on in `src/company.json`).

## 1. Company (legal entity)

| Fact | Value | Source | Status |
|---|---|---|---|
| Brand | Brisasoft, brand element "Brisa" | Existing site | Published |
| Legal name | Brisasoft Joint Stock Company / Công ty Cổ phần Brisasoft | `src/company.json` | Published |
| Business registration no. | 0110870824 | `src/company.json` | Published |
| Established | October 2024 (JSON-LD `foundingDate` 2024-10-23) | Founder brief (2024) + existing site | Published |
| Capital (資本金) | **VND 1 billion** (registered charter capital, unchanged since founding; founder 2026-10-16). Founder also said it was about JPY 7 million at founding; the site shows the VND figure only (the yen value moves with the exchange rate) | Founder | Published |
| Address | Tầng 3, số nhà 3, ngõ 114 Kim Quan Thượng, Việt Hưng, Long Biên, Hà Nội | `src/company.json` | Published. JA rendering added (ヴィエットフン坊 …, original in brackets); EN romanised. Founder 2026-10-16: **keep unchanged** because the post-reform address is not yet settled; update when it is confirmed |
| Contact | contact@brisasoft.net (mailbox confirmed receiving, 2026-10-16), +84 927 997 699 | `build.mjs`, `src/company.json` | Published |
| Own products | BIS (Biology Intellectual System, working prototype), AAB (AI Automation BPMN: Camunda BPMN + AI agents + Microsoft 365, in development; no Dify) | Existing site, founder 2026-10-16 | Published |

## 2. Experience figures (founder brief, 2026-10-16)

| Fact | Supplied value | Definition used on site | Status |
|---|---|---|---|
| Project experience | 30+ successful projects (site label: "successful projects") | Projects in the delivery experience of the founder and core engineers **since 2011, including before Brisasoft was founded**. Not presented as projects delivered by Brisasoft the legal entity. | Published, **confirmed by founder 2026-10-16** (founder + core team) |
| Market split | ~70% Japan / ~30% Vietnam | Share **by number of projects** of the same 30+ projects; Vietnam work mainly digital transformation. | Published, confirmed 2026-10-16 |
| Company size | **12 full-time employees (正社員12名), as of October 2026.** Larger projects staffed with partner companies (no number published). The earlier "10–50 people" range is **withdrawn** (2026-10-16, content standards: ranges are not published). | Founder, 2026-10-16 | Published |
| AI engineers | 70% of engineers are AI engineers who also work back end and front end | Founder, 2026-10-16 | Published, confirmed |
| Education | Engineers from Vietnamese universities incl. Hanoi University of Science and Technology (HUST) and "University of Industry" | Founder confirmed: leading Vietnamese IT universities such as HUST (Bách khoa) and Hanoi University of Industry (Công nghiệp). | Published, confirmed 2026-10-16 |

## 3. Founder (personal profile, separate from the company)

Shown only in 代表者紹介 / 代表メッセージ (founder page), never in 会社概要. 2011 is the founder's milestone, not the company's.

| Fact | Value | Source | Status |
|---|---|---|---|
| Name | Nguyễn Thanh Bình | `src/company.json` | Published |
| Title | Founder & CEO (JA: 創業者 兼 CEO, 代表メッセージ; VI: Nhà sáng lập kiêm CEO) | Founder, 2026-10-16 | Published, confirmed |
| Education | HEDSPI programme, Hanoi University of Science and Technology (Vietnam–Japan IT engineering programme supported by JICA, started 2006; Japanese language and working culture in depth) | Founder, 2026-10-16; programme facts: HUST SoICT and JICA pages | Published |
| Japan market | Since 2011, after graduating from HEDSPI (replaces the earlier "before graduating" wording) | Founder, 2026-10-16 | Published, confirmed |
| Projects | Worked on and led projects in SAP/ERP, embedded, BPMN workflow, healthcare, AI; part of the 30+ projects of founder + core team, before Brisasoft, in other organisations | Founder, 2026-10-16 | Published, confirmed |
| Career path | Engineering, then project and delivery management (requirements, quality, team and customer coordination) | Founder brief | Published, confirm |
| Philosophy | AI-native engineering; Forward Deployed Engineer (FDE) mindset; professionalism and ownership; customer value, including non-AI solutions when better | Founder brief | Published (founder message, needs founder sign-off on voice) |
| Portrait | Supplied 2026-10-16. Original: `docs/knowledge/founder-photo-original.png`; published crops `assets/founder/avatar.jpg`, `portrait.jpg` | Founder | Published |

## 3b. Practices (confirmed by founder 2026-10-16)

AI use in each of the 6 process steps, "every engineer uses AI tools in daily development", and the 8 delivery/quality practices (Q&A list, design review, code review, testing, security checks, documentation, progress reporting, knowledge transfer) are current practice.

## 4. Technologies

| Technology | Evidence | Status |
|---|---|---|
| Dify | AAB does not use Dify; no confirmed project. **Hidden** (`show: false`, founder decision 2026-10-16) | Hidden |
| Camunda / BPMN 2.0 | AAB core; founder's BPMN workflow projects | Published |
| Microsoft 365 | AAB (requests, approvals) and internal system integration | Published |
| SAP / ERP | Founder's Japanese-market projects (pre-Brisasoft) | Published, labelled as founder experience |
| intra-mart | Confirmed by founder 2026-10-16 as used in real projects | Published |
| Shopify | Confirmed by founder 2026-10-16 as used in real projects | Published |
| Pega | Confirmed by founder 2026-10-16 as used in real projects | Published |

To publish a held technology: provide one approved project description (domain, role, what was delivered, whether the client can be named), then set `show: true` in `src/company.json`.

## 5. Positioning (agreed direction)

- Primary promise: **AI-native engineering for real business impact.**
- Supporting messages: engineers who understand your business (FDE mindset); AI in every step, engineers own every result; the simplest solution that works, including non-AI.
- Markets: Japanese enterprises (main), Vietnamese businesses (digital transformation).

## 6. Removed or corrected claims

- "BPMN workflow certification" (Oct 2025 milestone): no certificate name, issuer or holder on record. Removed. Founder decision 2026-10-16: leave it out for now.
- "AI agents ... with source citations" as a general service promise: narrowed to the BIS approach. Citations are a design feature of BIS, not a guarantee for every project.
- "Evaluation and safety checks, so AI answers can be trusted": rewritten as concrete practices (test-question evaluation, human review).
- Home stat "2011: working with the Japanese market since": was the founder's date shown as a company stat. Replaced with company-founding date plus an attributed experience figure.
