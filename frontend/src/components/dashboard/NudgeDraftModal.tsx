import React, { useEffect, useState } from 'react';
import { Check, Copy, Mail, RotateCcw, X } from 'lucide-react';
import type { CubeSignals } from '../../utils/cubeSignals';
import { buildNudgeDraft, mailtoFor, type NudgeLang, type NudgeTone } from '../../utils/nudgeDraft';
import { useAuth } from '../../context/AuthContext';

const LANG_KEY = 'ix-nudge-lang';
const TONE_COPY: Record<NudgeTone, string> = {
  friendly: 'Friendly check-in',
  soft: 'Gentle nudge',
  firm: 'Clear ask with a date',
  meeting: 'Asks for a call',
};

const readLang = (): NudgeLang => {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'tr';
  } catch {
    return 'tr';
  }
};

/**
 * A draft message to one Cube, written from the signals on their card. The
 * mentor edits it, then copies it or opens it in their own mail app, so it is
 * sent personally and the portal needs no mail service.
 */
export const NudgeDraftModal: React.FC<{ cube: CubeSignals; onClose: () => void }> = ({ cube, onClose }) => {
  const { user } = useAuth();
  const [lang, setLang] = useState<NudgeLang>(readLang);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [tone, setTone] = useState<NudgeTone>('soft');
  const [copied, setCopied] = useState(false);

  const regenerate = (next: NudgeLang = lang) => {
    const draft = buildNudgeDraft({ cube, mentorName: user?.name || '', portalUrl: window.location.origin, lang: next });
    setSubject(draft.subject);
    setBody(draft.body);
    setTone(draft.tone);
  };

  useEffect(() => {
    regenerate(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cube, lang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const switchLang = (next: NudgeLang) => {
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* per-browser convenience only */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const title = `Message to ${cube.name}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
            <p className="text-xs font-medium text-gray-500">
              Drafted from the signals on this card ({TONE_COPY[tone].toLowerCase()}). Private notes and scores are never used. Edit it before you send.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div role="radiogroup" aria-label="Language" className="flex rounded-xl bg-gray-100 p-1 text-xs font-bold">
            {(['tr', 'en'] as const).map(option => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={lang === option}
                onClick={() => switchLang(option)}
                className={`rounded-lg px-3 py-1.5 transition-colors ${lang === option ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {option === 'tr' ? 'Türkçe' : 'English'}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => regenerate()} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-magenta">
            <RotateCcw className="h-3.5 w-3.5" /> Reset draft
          </button>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase text-gray-500">To</span>
          <span className="text-xs font-semibold text-gray-700">{cube.email}</span>
        </label>
        <label className="mt-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase text-gray-500">Subject</span>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-magenta"
          />
        </label>
        <label className="mt-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase text-gray-500">Message</span>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={16}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-medium leading-relaxed text-gray-800 outline-none focus:border-magenta"
          />
        </label>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-700 hover:border-gray-300"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <a
            href={mailtoFor(cube.email, { subject, body })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-magenta px-4 py-2 text-xs font-extrabold text-white hover:bg-magenta-hover"
          >
            <Mail className="h-3.5 w-3.5" /> Open in mail
          </a>
        </div>
      </div>
    </div>
  );
};
