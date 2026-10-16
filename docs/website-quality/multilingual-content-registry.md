# Multilingual content registry

Mechanism: facts live once in `src/company.json` (values, show flags) and are worded per language in `src/i18n/*.json`. `node build.mjs` fails if any language misses or adds a key, so a field cannot exist in one language only.
Last verified: 2026-10-16 (founder confirmation in this session). Evidence detail: `docs/knowledge/company-profile.md`.

| Fact ID | Verified value | Source | Status | JA | EN | VI |
|---|---|---|---|---|---|---|
| company.founded | 2024-10 | Registration, founder | Published | 2024年10月 | October 2024 | Tháng 10/2024 |
| company.legalName | Brisasoft Joint Stock Company | Registration | Published | ブリサソフト株式会社（…） | Brisasoft Joint Stock Company | Công ty Cổ phần Brisasoft |
| company.regNo | 0110870824 | Registration | Published | same | same | same |
| company.capital | VND 1 billion, unchanged since founding | Founder | Published | 10億ベトナムドン（設立時から変更なし） | VND 1 billion (unchanged since founding) | 1 tỷ đồng (không thay đổi từ khi thành lập) |
| company.representative | Nguyễn Thanh Bình, Founder & CEO | Founder | Published | 創業者 兼 CEO | Founder & CEO | Nhà sáng lập & CEO |
| company.address | Tầng 3, số nhà 3, ngõ 114 Kim Quan Thượng… | Registration | Published · kept unchanged (owner: new address not settled) | JA rendering + original | romanised | original |
| company.employees | 12 full-time, as of 2026-10 | Founder | Published | 正社員12名（2026年10月現在） | 12 full-time employees | 12 nhân viên chính thức |
| company.partners | Partner companies for larger projects (no number) | Founder | Published (prose) | 協力会社と連携 | partner companies | công ty đối tác |
| company.email | contact@brisasoft.net | Founder (mailbox tested) | Published | | | |
| exp.projects | 30+ successful projects, founder + core team since 2011, incl. pre-Brisasoft | Founder | Published with note | 成功したプロジェクト | successful projects | dự án thành công |
| exp.marketSplit | 70/30 Japan/Vietnam by project count | Founder | Published with definition | 件数ベース、概算 | by number, approx. | theo số dự án, ước tính |
| team.aiRatio | 70% of engineers are AI engineers (BE+FE) | Founder | Published | AIエンジニア比率 | of our engineers | kỹ sư là kỹ sư AI |
| team.universities | HUST, Hanoi University of Industry, others | Founder | Published | ハノイ工科大学、ハノイ工業大学 | HUST, Hanoi University of Industry | ĐH Bách khoa HN, ĐH Công nghiệp HN |
| founder.education | HEDSPI, HUST (JICA-supported) | Founder + HUST/JICA pages | Published (founder page only) | | | |
| founder.japanSince | 2011 | Founder | Published (founder page only) | | | |
| product.bis.status | Working prototype | Product team | Published | プロトタイプ | Working prototype | Bản prototype |
| product.aab.status | In development | Product team | Published | 開発中 | In development | Đang phát triển |
| tech.* | Camunda, M365, SAP/ERP, intra-mart, Shopify, Pega shown; Dify hidden | Founder | Published / hidden | | | |
| removed | "10–50" range; BPMN certification; 2011 as company milestone | Standards / founder | Not published | | | |
