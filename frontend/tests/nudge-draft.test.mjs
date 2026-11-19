import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Load the real module (type-only imports are erased by the transpile).
const source = readFileSync(new URL('../src/utils/nudgeDraft.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
vm.runInNewContext(code, { module: mod, exports: mod.exports, Date, Math, Boolean, encodeURIComponent });
const { buildNudgeDraft, toneFor, mailtoFor } = mod.exports;

const now = new Date('2026-11-16T12:00:00Z');
const ago = days => new Date(now.getTime() - days * 86_400_000).toISOString();
const PRIVATE = 'SECRET PRIVATE NOTE';

// The card from the mentor dashboard: seen today, silent for 46 days, researching.
const yagiz = {
  name: 'Yağız Alp Köse',
  status: 'quiet',
  items: [
    { kind: 'quiet_no_contribution', severity: 'quiet', last_contribution_at: ago(46), days: 46 },
    { kind: 'update_overdue', severity: 'attention', mission_id: 'm1', mission_title: 'Rethinking Form Completion & Creation with AI', last_update_at: null, days: null },
  ],
  missions: [{ id: 'm1', title: 'Rethinking Form Completion & Creation with AI', status: 'researching', role: 'member', joined_at: ago(53) }],
  activity: { active_days_7: 2, active_days_30: 2, last_active_at: ago(0), last_contribution_at: ago(46) },
  last_feedback_at: ago(42),
  private_note: PRIVATE,
};
const input = (cube, lang = 'tr') => ({ cube, mentorName: 'Emre', portalUrl: 'https://portal.test/', lang, now });

test('a Cube silent for 46 days gets the call-request draft, in Turkish', () => {
  const d = buildNudgeDraft(input(yagiz));
  assert.equal(d.tone, 'meeting');
  assert.equal(d.subject, 'Yağız, kısa bir görüşme yapalım mı?');
  assert.match(d.body, /^Selam Yağız,/);
  assert.match(d.body, /Portal'a girdiğini görüyorum ama "Rethinking Form Completion & Creation with AI" mission'ına katıldığından beri hiç update yok, son katkın 46 gün önce\./);
  assert.match(d.body, /ben de 42 gündür sana geri bildirim vermedim/);
  assert.match(d.body, /yarım bulgular da çok değerli/);
  assert.match(d.body, /20 dakikalık bir görüşme/);
  assert.match(d.body, /https:\/\/portal\.test\/missions\/m1/);
  assert.match(d.body, /Emre$/);
  assert.ok(!d.body.includes(PRIVATE));
});

test('the English draft says the same things', () => {
  const d = buildNudgeDraft(input(yagiz, 'en'));
  assert.equal(d.subject, 'Yağız, can we have a quick call?');
  assert.match(d.body, /I can see you've been on the portal, but there has been no update since you joined/);
  assert.match(d.body, /feedback for 42 days either/);
});

test('tone escalates with the silence: nudge, date, call', () => {
  const quietFor = days => ({ ...yagiz, items: [{ kind: 'quiet_no_contribution', severity: 'quiet', last_contribution_at: ago(days), days }] });
  assert.equal(toneFor(quietFor(8), now), 'soft');
  assert.equal(toneFor(quietFor(14), now), 'firm');
  assert.equal(toneFor(quietFor(21), now), 'meeting');
  const firm = buildNudgeDraft(input(quietFor(15)));
  assert.match(firm.body, /tarihine kadar kısa bir update/);
  assert.equal(firm.subject, 'Yağız, kısa bir durum kontrolü');
});

test('an on-track Cube gets a friendly note without the nudging parts', () => {
  const ok = { ...yagiz, status: 'on_track', items: [], last_feedback_at: ago(3) };
  const d = buildNudgeDraft(input(ok));
  assert.equal(d.tone, 'friendly');
  assert.ok(!/payım var|yavaşladıysan/.test(d.body));
});

test('a Cube who never signed in, with an NDA pending and a blocker', () => {
  const cube = {
    ...yagiz,
    activity: { ...yagiz.activity, last_active_at: null },
    items: [
      { kind: 'quiet_no_visits', severity: 'quiet', last_active_at: null, days: null },
      { kind: 'open_blocker', severity: 'attention', mission_id: 'm1', mission_title: 'X', blockers: 'stuck', reported_at: ago(5) },
      { kind: 'nda_pending', severity: 'attention' },
    ],
  };
  const d = buildNudgeDraft(input(cube));
  assert.equal(d.tone, 'meeting'); // counted from joining the mission, 53 days ago
  assert.match(d.body, /Henüz Portal'a giriş yaptığını göremedik/);
  assert.match(d.body, /takıldığın bir yer olduğunu yazmıştın/);
  assert.match(d.body, /Not: NDA'n hâlâ imzalanmamış/);
});

test('mailto link encodes subject and body', () => {
  const link = mailtoFor('a@b.co', { subject: 'Hi & bye', body: 'line 1\nline 2' });
  assert.equal(link, 'mailto:a@b.co?subject=Hi%20%26%20bye&body=line%201%0Aline%202');
});
