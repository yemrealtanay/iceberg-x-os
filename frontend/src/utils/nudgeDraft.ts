import type { CubeSignals, SignalItem } from './cubeSignals';

/**
 * A ready-to-edit message from a mentor to one of their Cubes, built from the
 * same signals the Cube sees on their own focus panel. Rule-based on purpose:
 * predictable, free, and nothing leaves the browser. Private notes and scores
 * are never part of the input, so they can never end up in a draft.
 */
export type NudgeLang = 'tr' | 'en';
export type NudgeTone = 'friendly' | 'soft' | 'firm' | 'meeting';

export interface NudgeDraft {
  tone: NudgeTone;
  subject: string;
  body: string;
}

export interface NudgeInput {
  cube: Pick<CubeSignals, 'name' | 'status' | 'items' | 'missions' | 'activity' | 'last_feedback_at'>;
  mentorName: string;
  /** Portal origin, e.g. https://portal.example.com, for the link in the message. */
  portalUrl: string;
  lang: NudgeLang;
  now?: Date;
}

const DAY_MS = 86_400_000;
/** Same thresholds as the escalation the mentors agreed on: a nudge, a date, a call. */
export const FIRM_AFTER_DAYS = 14;
export const MEETING_AFTER_DAYS = 21;
/** Matches CHECKIN_DUE_DAYS on the backend: six weeks without the mentor's feedback. */
export const FEEDBACK_OVERDUE_DAYS = 42;
const SEEN_RECENTLY_DAYS = 7;
const FIRM_DEADLINE_DAYS = 4;

const daysSince = (value: string | null | undefined, now: Date) =>
  value ? Math.max(0, Math.floor((now.getTime() - new Date(value).getTime()) / DAY_MS)) : null;

const find = <K extends SignalItem['kind']>(items: SignalItem[], kind: K) =>
  items.find((item): item is Extract<SignalItem, { kind: K }> => item.kind === kind);

/** How long the Cube has been silent, in days; null when nothing is overdue. */
export function silenceDays(cube: NudgeInput['cube'], now: Date): number | null {
  const candidates: number[] = [];
  let sawUnknown = false;
  for (const item of cube.items) {
    if (item.kind === 'quiet_no_contribution' || item.kind === 'quiet_no_visits' || item.kind === 'update_overdue') {
      if (item.days === null) sawUnknown = true;
      else candidates.push(item.days);
    }
  }
  if (candidates.length > 0) return Math.max(...candidates);
  if (!sawUnknown) return null;
  // Never contributed or updated: count from when they joined their mission.
  const joined = cube.missions.map(m => daysSince(m.joined_at, now)).filter((d): d is number => d !== null);
  return joined.length > 0 ? Math.max(...joined) : MEETING_AFTER_DAYS;
}

export function toneFor(cube: NudgeInput['cube'], now: Date): NudgeTone {
  const silence = silenceDays(cube, now);
  if (silence === null) return cube.status === 'on_track' && cube.items.length === 0 ? 'friendly' : 'soft';
  if (silence >= MEETING_AFTER_DAYS) return 'meeting';
  if (silence >= FIRM_AFTER_DAYS) return 'firm';
  return 'soft';
}

interface Facts {
  first: string;
  mission: { id: string; title: string; status: string } | null;
  updateDays: number | null | undefined; // undefined: no overdue update; null: none since joining
  contributionDays: number | null | undefined;
  seenDays: number | null;
  seenRecently: boolean;
  quiet: boolean;
  feedbackDays: number | null;
  feedbackOverdue: boolean;
  blocker: boolean;
  noMission: boolean;
  nda: boolean;
  documents: number;
  deadline: string;
  link: string;
  mentor: string;
}

const COPY: Record<NudgeLang, {
  subject: (f: Facts, tone: NudgeTone) => string;
  greeting: (f: Facts) => string;
  opening: (f: Facts) => string;
  ownership: (f: Facts) => string;
  blocker: (f: Facts) => string;
  stage: Partial<Record<string, string>>;
  ask: Record<NudgeTone, (f: Facts) => string>;
  pause: string;
  ps: (f: Facts) => string[];
  signoff: (f: Facts, tone: NudgeTone) => string;
}> = {
  tr: {
    subject: (f, tone) =>
      tone === 'meeting'
        ? `${f.first}, kısa bir görüşme yapalım mı?`
        : tone === 'firm'
          ? `${f.first}, kısa bir durum kontrolü`
          : f.mission
            ? `${f.first}, "${f.mission.title}" nasıl gidiyor?`
            : `${f.first}, nasıl gidiyorsun?`,
    greeting: f => `Selam ${f.first},`,
    opening: f => {
      const contribution =
        f.contributionDays === undefined ? '' : f.contributionDays === null ? 'henüz görünür bir katkın yok' : `son katkın ${f.contributionDays} gün önce`;
      const update = !f.mission || f.updateDays === undefined
        ? ''
        : f.updateDays === null
          ? `"${f.mission.title}" mission'ına katıldığından beri hiç update yok`
          : `"${f.mission.title}" için ${f.updateDays} gündür update yok`;
      const facts = [update, contribution].filter(Boolean).join(', ');
      if (f.noMission) return `Şu an üzerinde aktif bir mission görünmüyor${contribution ? `, ${contribution}` : ''}.`;
      if (f.quiet && f.seenRecently) return `Portal'a girdiğini görüyorum ama ${facts || 'bir süredir senden haber alamadık'}.`;
      if (f.quiet && f.seenDays === null) return `Henüz Portal'a giriş yaptığını göremedik${facts ? `; ${facts}` : ''}.`;
      if (f.quiet) return `${f.seenDays} gündür Portal'da seni göremedik${facts ? `; ${facts}` : ''}.`;
      if (facts) return `${facts.charAt(0).toUpperCase()}${facts.slice(1)}.`;
      return f.mission ? `"${f.mission.title}" nasıl gidiyor, kısaca sormak istedim.` : 'Nasıl gittiğini kısaca sormak istedim.';
    },
    ownership: f =>
      f.feedbackDays === null
        ? 'Açık söyleyeyim, ben de sana henüz geri bildirim vermedim; bunda benim de payım var.'
        : `Açık söyleyeyim, ben de ${f.feedbackDays} gündür sana geri bildirim vermedim; bu sessizlikte benim de payım var.`,
    blocker: f => `${f.mission ? `"${f.mission.title}" için t` : 'T'}akıldığın bir yer olduğunu yazmıştın. Hâlâ çözülmediyse birlikte bakalım.`,
    stage: {
      selected: 'Bir mission\'a başlarken nereden gireceğini kestirmek zor olabilir; ilk adımı birlikte belirleyebiliriz.',
      researching:
        'Araştırma aşaması zor bir yer; ne zaman "paylaşılacak kadar hazır" olduğunu kestirmek güç. Ama yarım bulgular da çok değerli: neye baktın, ne öğrendin, nerede takıldın?',
      building_demo: 'Demo henüz hazır değilse sorun değil; yarım kalmış bir ekran, bir commit ya da takıldığın hata da paylaşmaya değer.',
      preparing_handover: 'Teslime çok yaklaştın; son adımda takıldığın bir şey varsa birlikte bitirelim.',
      demo_ready: 'Teslime çok yaklaştın; son adımda takıldığın bir şey varsa birlikte bitirelim.',
    },
    ask: {
      friendly: f => `Aklında bir soru ya da konuşmak istediğin bir şey varsa bu maile cevap yazman yeterli.\n\n${f.link}`,
      soft: f =>
        `Şunlardan biri yeterli:\n1. Kısa bir update gir. Üç satır yeter: ne yaptın, sırada ne var, takıldığın bir yer var mı.\n   ${f.link}\n2. Takıldıysan bu maile cevap yaz; birlikte bakalım ya da 15 dakikalık bir görüşme ayarlayalım.`,
      firm: f =>
        `${f.deadline} tarihine kadar kısa bir update girmeni ya da bu maile cevap vermeni rica ediyorum:\n${f.link}\n\nHaber alamazsak bir görüşme ayarlayıp durumu birlikte konuşacağız.`,
      meeting: f =>
        `Bu hafta 20 dakikalık bir görüşme yapalım${f.mission ? ' ve sonraki adımı birlikte netleştirelim' : ''}. Uygun olduğun iki saat aralığını bu maile yazman yeterli. Öncesinde aklındakileri üç satırlık bir update olarak girebilirsen harika olur:\n${f.link}`,
    },
    pause: 'Okul, iş ya da başka bir sebeple yavaşladıysan onu da söyle, takvimi ona göre ayarlarız.',
    ps: f => [
      ...(f.nda ? ["NDA'n hâlâ imzalanmamış görünüyor; Portal'dan imzalayabilirsin."] : []),
      ...(f.documents > 0 ? [`Reddedilen ${f.documents} belgeni Portal'dan yeniden yüklemen gerekiyor.`] : []),
    ],
    signoff: (f, tone) => (tone === 'soft' || tone === 'friendly' ? `Kolay gelsin,\n${f.mentor}` : f.mentor),
  },
  en: {
    subject: (f, tone) =>
      tone === 'meeting'
        ? `${f.first}, can we have a quick call?`
        : tone === 'firm'
          ? `${f.first}, a quick check-in`
          : f.mission
            ? `${f.first}, how is "${f.mission.title}" going?`
            : `${f.first}, how are things going?`,
    greeting: f => `Hi ${f.first},`,
    opening: f => {
      const contribution =
        f.contributionDays === undefined ? '' : f.contributionDays === null ? 'nothing has been shared yet' : `your last contribution was ${f.contributionDays} days ago`;
      const update = !f.mission || f.updateDays === undefined
        ? ''
        : f.updateDays === null
          ? `there has been no update since you joined "${f.mission.title}"`
          : `there has been no update on "${f.mission.title}" for ${f.updateDays} days`;
      const facts = [update, contribution].filter(Boolean).join(', and ');
      if (f.noMission) return `You don't seem to be on an active mission right now${contribution ? `, and ${contribution}` : ''}.`;
      if (f.quiet && f.seenRecently) return `I can see you've been on the portal, but ${facts || "we haven't heard from you for a while"}.`;
      if (f.quiet && f.seenDays === null) return `We haven't seen you sign in to the portal yet${facts ? `; ${facts}` : ''}.`;
      if (f.quiet) return `We haven't seen you on the portal for ${f.seenDays} days${facts ? `; ${facts}` : ''}.`;
      if (facts) return `${facts.charAt(0).toUpperCase()}${facts.slice(1)}.`;
      return f.mission ? `I wanted to ask how "${f.mission.title}" is going.` : 'I wanted to ask how things are going.';
    },
    ownership: f =>
      f.feedbackDays === null
        ? "To be fair, I haven't given you any feedback yet either, so this is partly on me."
        : `To be fair, I haven't given you feedback for ${f.feedbackDays} days either, so the silence is partly on me.`,
    blocker: f => `You mentioned being stuck${f.mission ? ` on "${f.mission.title}"` : ''}. If it's still not resolved, let's look at it together.`,
    stage: {
      selected: "Getting started on a mission can be hard to pin down; we can work out the first step together.",
      researching:
        "Research is a tricky phase: it's hard to tell when something is \"ready to share\". Half-finished findings are valuable too: what did you look at, what did you learn, where are you stuck?",
      building_demo: "It's fine if the demo isn't ready. A half-done screen, a commit or the bug you're stuck on is worth sharing.",
      preparing_handover: "You're close to the finish; if the last step is holding you up, let's finish it together.",
      demo_ready: "You're close to the finish; if the last step is holding you up, let's finish it together.",
    },
    ask: {
      friendly: f => `If you have a question or anything you'd like to talk through, just reply to this email.\n\n${f.link}`,
      soft: f =>
        `Either of these is enough:\n1. Post a short update. Three lines will do: what you did, what's next, anything blocking you.\n   ${f.link}\n2. If you're stuck, reply to this email and we'll look at it together or set up a 15-minute call.`,
      firm: f =>
        `Could you post a short update or reply to this email by ${f.deadline}?\n${f.link}\n\nIf we don't hear from you, we'll set up a call to talk it through.`,
      meeting: f =>
        `Let's have a 20-minute call this week${f.mission ? ' and agree on the next step together' : ''}. Just reply with two time slots that work for you. If you can post a three-line update before then, even better:\n${f.link}`,
    },
    pause: "If school, work or anything else has slowed you down, just tell me and we'll adjust the plan.",
    ps: f => [
      ...(f.nda ? ['Your NDA still looks unsigned; you can sign it on the portal.'] : []),
      ...(f.documents > 0 ? [`${f.documents === 1 ? 'One document was' : `${f.documents} documents were`} rejected and need re-uploading on the portal.`] : []),
    ],
    signoff: (f, tone) => (tone === 'soft' || tone === 'friendly' ? `Best,\n${f.mentor}` : f.mentor),
  },
};

export function buildNudgeDraft({ cube, mentorName, portalUrl, lang, now = new Date() }: NudgeInput): NudgeDraft {
  const tone = toneFor(cube, now);
  const update = find(cube.items, 'update_overdue');
  const mission = update
    ? cube.missions.find(m => m.id === update.mission_id) || { id: update.mission_id, title: update.mission_title, status: '' }
    : cube.missions[0] || null;
  const contribution = find(cube.items, 'quiet_no_contribution');
  const seenDays = daysSince(cube.activity.last_active_at, now);
  const feedbackDays = daysSince(cube.last_feedback_at, now);
  const deadline = new Date(now.getTime() + FIRM_DEADLINE_DAYS * DAY_MS).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const base = portalUrl.replace(/\/+$/, '');
  const docs = find(cube.items, 'document_rejected');

  const f: Facts = {
    first: (cube.name || '').trim().split(/\s+/)[0] || (lang === 'tr' ? 'merhaba' : 'there'),
    mission,
    updateDays: update ? update.days : undefined,
    contributionDays: contribution ? contribution.days : undefined,
    seenDays,
    seenRecently: seenDays !== null && seenDays < SEEN_RECENTLY_DAYS,
    quiet: cube.status === 'quiet',
    feedbackDays,
    feedbackOverdue: feedbackDays === null || feedbackDays >= FEEDBACK_OVERDUE_DAYS,
    blocker: Boolean(find(cube.items, 'open_blocker')),
    noMission: Boolean(find(cube.items, 'no_mission')),
    nda: Boolean(find(cube.items, 'nda_pending')),
    documents: docs ? docs.count : 0,
    deadline,
    link: mission ? `${base}/missions/${mission.id}` : `${base}/dashboard`,
    mentor: mentorName.trim(),
  };

  const c = COPY[lang];
  const nudging = tone !== 'friendly';
  const middle = [c.opening(f)];
  if (nudging && f.feedbackOverdue) middle.push(c.ownership(f));
  const stage = f.blocker ? c.blocker(f) : mission ? c.stage[mission.status] : undefined;

  const paragraphs = [
    c.greeting(f),
    middle.join(' '),
    ...(nudging && stage ? [stage] : []),
    c.ask[tone](f),
    ...(nudging ? [c.pause] : []),
    ...(c.ps(f).length > 0 ? [`${lang === 'tr' ? 'Not' : 'P.S.'}: ${c.ps(f).join(' ')}`] : []),
    c.signoff(f, tone),
  ];

  return { tone, subject: c.subject(f, tone), body: paragraphs.join('\n\n') };
}

/** mailto: link with the draft filled in; opens the mentor's own mail app. */
export const mailtoFor = (email: string, draft: Pick<NudgeDraft, 'subject' | 'body'>) =>
  `mailto:${email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
