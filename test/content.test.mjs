// Content and build checks for the Brisasoft website.
// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'ja', 'vi'];
const read = (p) => readFileSync(join(root, p), 'utf8');
const load = (p) => JSON.parse(read(p));
const dicts = Object.fromEntries(LANGS.map((lang) => [lang, load(`src/i18n/${lang}.json`)]));

const flat = (value, prefix = '') =>
  Object.entries(value).flatMap(([key, child]) =>
    child && typeof child === 'object' && !Array.isArray(child)
      ? flat(child, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );

const keysOf = (dict) => new Set(flat(dict).sort());

const founderKeys = ['eyebrow', 'f1.text', 'f1.title', 'f2.text', 'f2.title', 'f3.text', 'f3.title', 'p1', 'p2', 'p3', 'p4', 'p5', 'quote', 'title'];

test('every language exposes exactly the same i18n keys', () => {
  const en = keysOf(dicts.en);
  for (const lang of LANGS) {
    assert.deepEqual([...keysOf(dicts[lang])], [...en], `${lang} keys differ from English`);
  }
});

test('founder message has the approved structure', () => {
  for (const lang of LANGS) {
    assert.deepEqual([...keysOf(dicts[lang].founderMsg)].sort(), founderKeys, `${lang} founderMsg keys changed`);
  }
});

test('founder message contains no contact block or contact links', () => {
  for (const lang of LANGS) {
    const message = JSON.stringify(dicts[lang].founderMsg);
    assert.doesNotMatch(message, /binhnt@|@brisasoft|brisasoft\.(net|com)|🌐|✉️/i, `${lang} founderMsg still contains contact details`);
  }
});

test('English founder message describes the move from software engineer, not software engineering', () => {
  const p1 = dicts.en.founderMsg.p1;
  assert.match(p1, /from software engineer to project leadership/);
  assert.doesNotMatch(p1, /from software engineering to project leadership/);
});

test('VI and JA founder messages mirror the software engineer career step', () => {
  assert.match(dicts.vi.founderMsg.p1, /kỹ sư phần mềm/);
  assert.doesNotMatch(dicts.vi.founderMsg.p1, /kỹ thuật phần mềm đến lãnh đạo/);
  assert.match(dicts.ja.founderMsg.p1, /ソフトウェアエンジニアから/);
  assert.doesNotMatch(dicts.ja.founderMsg.p1, /ソフトウェアエンジニアリングから/);
});

test('all languages keep the same founder facts and focus areas', () => {
  for (const lang of LANGS) {
    const m = dicts[lang].founderMsg;
    assert.match(m.p1, /15/, `${lang}: years of experience`);
    assert.match(m.p1, /2011/, `${lang}: start year`);
    assert.match(m.p1, /HEDSPI/, `${lang}: HEDSPI`);
    assert.match(m.p2, /2024/, `${lang}: founding year`);
    assert.match(m.p2, /Brisasoft JSC/, `${lang}: legal name`);
    assert.match(m.p3, /Dario Amodei/, `${lang}: Amodei reference`);
    assert.match(m.f1.text, /Shopify/, `${lang}: AI Commerce`);
    assert.match(m.f2.text, /BPMN.*RPA|RPA.*BPMN/, `${lang}: Workflow Automation`);
  }
});

test('founder template no longer renders the contact block', () => {
  const template = read('src/pages/founder.html');
  assert.doesNotMatch(template, /binhnt@|founder-contact|🌐|✉️/);
  assert.match(template, /founderMsg\.f1\.title/);
  assert.match(template, /founderMsg\.f2\.title/);
  assert.match(template, /founderMsg\.f3\.title/);
});

test('site builds and renders the approved founder message', () => {
  execFileSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'pipe' });

  const en = read('dist/en/about/founder/index.html');
  assert.match(en, /from software engineer to project leadership/);
  assert.match(en, /Dario Amodei/);
  assert.match(en, /AI Commerce/);
  assert.match(en, /Life Sciences &amp; Longevity/);
  assert.doesNotMatch(en, /binhnt@|founder-contact/);

  for (const lang of LANGS) {
    const html = read(`dist/${lang}/about/founder/index.html`);
    assert.doesNotMatch(html, /\{\{/, `${lang}: unresolved template placeholder`);
    assert.equal((html.match(/<li><b>/g) || []).length >= 3, true, `${lang}: focus list missing`);
  }
});

test('consent copy does not reference a missing Terms page', () => {
  for (const lang of LANGS) {
    const text = dicts[lang].contactForm.consent;
    assert.doesNotMatch(text, /Terms of Use|利用規約|Điều khoản sử dụng/i, `${lang}: consent references a nonexistent Terms page`);
    assert.match(text, /privacy|プライバシー|riêng tư/i, `${lang}: consent must name the privacy notice`);
  }
});

test('stats note defines both the project split and the engineer ratio', () => {
  assert.match(dicts.en.stats.note, /70|project/i);
  assert.match(dicts.en.stats.note, /engineer/i);
  assert.match(dicts.ja.stats.note, /プロジェクト件数/);
  assert.match(dicts.ja.stats.note, /エンジニア/);
  assert.match(dicts.vi.stats.note, /dự án/i);
  assert.match(dicts.vi.stats.note, /kỹ sư/i);
});

test('BIS is consistently described as a working prototype', () => {
  assert.equal(dicts.en.bis2.status, 'Working prototype');
  assert.equal(dicts.ja.bis2.status, '稼働中のプロトタイプ');
  assert.match(dicts.vi.bis2.status, /prototype đang chạy/i);
  assert.doesNotMatch(dicts.en.meta.bis.description, /in development/i);
  assert.doesNotMatch(dicts.ja.meta.bis.description, /開発中/);
  assert.doesNotMatch(dicts.vi.meta.bis.description, /giai đoạn prototype/i);
});

test('Vietnamese copy uses the standard hoá spelling', () => {
  assert.doesNotMatch(read('src/i18n/vi.json'), /hoá/);
});

test('AAB FAQ renders all four questions', () => {
  execFileSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'pipe' });
  for (const lang of LANGS) {
    const html = read(`dist/${lang}/products/aab/index.html`);
    assert.match(html, new RegExp(dicts[lang].aab.q4.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${lang}: aab.q4 missing`);
  }
});

test('no generated page contains unresolved template placeholders', () => {
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (entry.endsWith('.html')) pages.push(path);
    }
  };
  walk(join(root, 'dist'));
  assert.ok(pages.length > 0);
  for (const page of pages) assert.doesNotMatch(readFileSync(page, 'utf8'), /\{\{/, page);
});
