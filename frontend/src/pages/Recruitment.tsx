import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldAlert, X, CalendarClock, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';
import { PageHeader } from '../components/PageHeader';

const STAGES = ['Applied', 'Evaluation', 'Interview', 'Offer'] as const;
type Stage = (typeof STAGES)[number];

const CRITERIA = [
  { key: 'score_case', label: 'Technical / Case Study' },
  { key: 'score_communication', label: 'Communication' },
  { key: 'score_ownership', label: 'Time Management & Ownership' },
  { key: 'score_teamfit', label: 'Openness to Learning & Team Fit' }
] as const;

type ScoreKey = (typeof CRITERIA)[number]['key'];

interface Candidate {
  id: string;
  name: string;
  email: string;
  university: string;
  degree: string;
  year_of_study: string;
  why_join: string;
  status: string;
  created_at: string;
  stage: Stage;
  score_case: number | null;
  score_communication: number | null;
  score_ownership: number | null;
  score_teamfit: number | null;
  evaluation_note: string | null;
  interview_at: string | null;
  interview_note: string | null;
}

/** Average of the criteria that have been scored; null until at least one is. */
const averageScore = (c: Candidate): number | null => {
  const scores = CRITERIA.map(k => c[k.key]).filter((v): v is number => typeof v === 'number');
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const stageTone: Record<Stage, string> = {
  Applied: 'bg-amber-50 text-amber-700 border-amber-100',
  Evaluation: 'bg-sky-50 text-sky-700 border-sky-100',
  Interview: 'bg-magenta/10 text-magenta border-magenta/20',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-100'
};

const StagePill: React.FC<{ stage: Stage }> = ({ stage }) => (
  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${stageTone[stage] || stageTone.Applied}`}>
    {stage}
  </span>
);

type Tab = 'overview' | 'candidates' | 'decision';

export const Recruitment: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'All' | Stage>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/admin/applications');
        setCandidates(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load candidates');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Only pending applications are in the pipeline; approved/rejected ones are closed.
  const pipeline = useMemo(() => candidates.filter(c => c.status === 'pending'), [candidates]);

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase();
    return pipeline.filter(c => {
      const hay = `${c.name || ''} ${c.email || ''} ${c.university || ''} ${c.degree || ''}`.toLowerCase();
      return hay.includes(q) && (stageFilter === 'All' || c.stage === stageFilter);
    });
  }, [pipeline, query, stageFilter]);

  const ranked = useMemo(
    () => pipeline.filter(c => averageScore(c) !== null).sort((a, b) => (averageScore(b) ?? 0) - (averageScore(a) ?? 0)),
    [pipeline]
  );

  const counts = STAGES.map(s => pipeline.filter(c => c.stage === s).length);
  const maxCount = Math.max(1, ...counts);
  const open = candidates.find(c => c.id === openId) || null;

  const handleSaved = (updated: Candidate) => {
    setCandidates(prev => prev.map(c => (c.id === updated.id ? { ...c, ...updated } : c)));
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Manage"
        title="Recruitment"
        description="Move applicants through the pipeline, score them against the standard criteria and compare."
      >
        <Link to="/admin/applications" className="btn-secondary text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
          Final decisions
        </Link>
      </PageHeader>

      <div className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-xl self-start">
        {([['overview', 'Overview'], ['candidates', 'Candidates'], ['decision', 'Decision Support']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tab === key ? 'bg-white text-magenta shadow-sm border border-black/5' : 'text-gray-400 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : tab === 'overview' ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((s, i) => (
              <div key={s} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-subtle">
                <p className="text-xs font-semibold text-gray-400">{s}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{counts[i]}</p>
              </div>
            ))}
          </div>
          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle">
            <h2 className="text-base font-extrabold text-slate-900 mb-5">Pipeline distribution</h2>
            <div className="flex items-end gap-4 h-44 border-b border-gray-100">
              {STAGES.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                  <span className="text-xs font-bold text-gray-600">{counts[i]}</span>
                  <div className="w-1/2 min-w-[22px] rounded-t-lg bg-magenta/80" style={{ height: `${Math.max(8, (counts[i] / maxCount) * 100)}%` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              {STAGES.map(s => (
                <span key={s} className="flex-1 text-center text-xs text-gray-400 font-semibold">{s}</span>
              ))}
            </div>
          </section>
        </div>
      ) : tab === 'candidates' ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-subtle">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or university..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:border-magenta focus:bg-white transition-all"
              />
            </div>
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value as 'All' | Stage)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-magenta"
            >
              <option value="All">All stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-sm font-semibold shadow-subtle">
              No candidates match.
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-subtle overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50/70">
                    <th className="px-5 py-3">Candidate</th>
                    <th className="px-5 py-3">University</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Score</th>
                    <th className="px-5 py-3">Interview</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const avg = averageScore(c);
                    return (
                      <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-5 py-4">
                          <p className="text-sm font-extrabold text-gray-900">{c.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-600 font-semibold">{c.university} · {c.degree}</td>
                        <td className="px-5 py-4"><StagePill stage={c.stage} /></td>
                        <td className="px-5 py-4 text-sm font-extrabold text-gray-900">{avg === null ? '—' : `${avg}/100`}</td>
                        <td className="px-5 py-4 text-xs text-gray-600 font-semibold">
                          {c.interview_at ? new Date(c.interview_at).toLocaleString() : '—'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => setOpenId(c.id)} className="text-xs font-bold text-magenta hover:underline">
                            Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Score comparison</h2>
          <p className="text-xs text-gray-400 font-semibold mb-5">Equal-weight average of the scored criteria. This is decision support only; no one is advanced or rejected automatically.</p>
          {ranked.length === 0 ? (
            <p className="text-sm text-gray-400 font-semibold py-8 text-center">No candidate has been scored yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ranked.map((c, i) => {
                const avg = averageScore(c) ?? 0;
                return (
                  <div key={c.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                      <StagePill stage={c.stage} />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-gray-900">{c.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{c.university}</p>
                    </div>
                    <p className="text-3xl font-extrabold text-magenta">{avg}<span className="text-xs text-gray-400 font-semibold">/100</span></p>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-full rounded-full bg-magenta" style={{ width: `${avg}%` }} /></div>
                    <button onClick={() => setOpenId(c.id)} className="self-start text-xs font-bold text-magenta hover:underline flex items-center gap-1">
                      Review <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {open && <CandidateModal key={open.id} candidate={open} onClose={() => setOpenId(null)} onSaved={handleSaved} />}
    </div>
  );
};

const CandidateModal: React.FC<{
  candidate: Candidate;
  onClose: () => void;
  onSaved: (c: Candidate) => void;
}> = ({ candidate, onClose, onSaved }) => {
  const [stage, setStage] = useState<Stage>(candidate.stage);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({
    score_case: candidate.score_case ?? 0,
    score_communication: candidate.score_communication ?? 0,
    score_ownership: candidate.score_ownership ?? 0,
    score_teamfit: candidate.score_teamfit ?? 0
  });
  // Scores stay null until the reviewer touches a slider, so an unscored candidate is not ranked as 0.
  const [touched, setTouched] = useState<Set<ScoreKey>>(
    new Set(CRITERIA.filter(k => candidate[k.key] !== null).map(k => k.key))
  );
  const [note, setNote] = useState(candidate.evaluation_note || '');
  const [interviewAt, setInterviewAt] = useState(toLocalInput(candidate.interview_at));
  const [interviewNote, setInterviewNote] = useState(candidate.interview_note || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scored = CRITERIA.filter(k => touched.has(k.key));
  const liveAverage = scored.length ? Math.round(scored.reduce((a, k) => a + scores[k.key], 0) / scored.length) : null;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, any> = {
        stage,
        evaluation_note: note,
        interview_at: interviewAt ? new Date(interviewAt).toISOString() : null,
        interview_note: interviewNote
      };
      CRITERIA.forEach(k => {
        payload[k.key] = touched.has(k.key) ? scores[k.key] : null;
      });
      const res = await api.patch(`/admin/applications/${candidate.id}/pipeline`, payload);
      onSaved(res.application);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-2xl max-h-full overflow-y-auto bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-premium flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{candidate.name || 'Unknown'}</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">{candidate.email} · {candidate.university} ({candidate.degree}), {candidate.year_of_study}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-700 leading-relaxed">
          <p className="font-extrabold text-[10px] uppercase text-gray-400 tracking-wider mb-2">Why they want to become a Cube</p>
          <p className="italic whitespace-pre-wrap">"{candidate.why_join}"</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="stage" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stage</label>
          <select id="stage" value={stage} onChange={e => setStage(e.target.value as Stage)} className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:border-magenta">
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evaluation (0–100)</p>
          {CRITERIA.map(k => (
            <div key={k.key} className="grid grid-cols-[1fr_140px_36px] sm:grid-cols-[1fr_200px_40px] items-center gap-3">
              <label htmlFor={k.key} className={`text-sm font-semibold ${touched.has(k.key) ? 'text-gray-800' : 'text-gray-400'}`}>{k.label}</label>
              <input
                id={k.key}
                type="range"
                min={0}
                max={100}
                value={scores[k.key]}
                onChange={e => {
                  const v = Number(e.target.value);
                  setScores(prev => ({ ...prev, [k.key]: v }));
                  setTouched(prev => new Set(prev).add(k.key));
                }}
                className="accent-magenta"
              />
              <span className="text-sm font-extrabold text-magenta text-right">{touched.has(k.key) ? scores[k.key] : '—'}</span>
            </div>
          ))}
          <div className="flex justify-between bg-magenta/5 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900">
            <span>Average</span>
            <span>{liveAverage === null ? '—' : `${liveAverage}/100`}</span>
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Evaluator note..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-magenta"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><CalendarClock className="w-4 h-4" /> Interview</p>
          <input
            type="datetime-local"
            value={interviewAt}
            onChange={e => setInterviewAt(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:border-magenta"
          />
          <textarea
            value={interviewNote}
            onChange={e => setInterviewNote(e.target.value)}
            maxLength={2000}
            rows={2}
            placeholder="Meeting link, agenda or notes..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-magenta"
          />
        </div>

        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-3 border border-gray-200 text-gray-500 font-bold text-xs rounded-2xl hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-3 bg-magenta text-white font-bold text-xs rounded-2xl hover:bg-magenta-hover disabled:opacity-70">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
