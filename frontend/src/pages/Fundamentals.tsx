import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Layers,
  AlertCircle,
  Trophy,
  ArrowRight,
  Lock,
  Globe,
  ArrowLeftRight,
  Code,
  Plug,
  Key,
  Shield,
  Database,
  Timer,
  Cloud,
  GitBranch,
  X
} from 'lucide-react';
import { BadgeMedal, BadgeDisc, RarityPill } from '../components/BadgeMedal';
import {
  FUNDAMENTALS_TOPICS,
  FUNDAMENTALS_GLOSSARY,
  FUNDAMENTALS_FAQS,
  FUNDAMENTALS_STR,
  LEARNING_RESOURCES,
  TOPIC_DEEPENING,
  TopicContent
} from '../data/fundamentals/topicsData';
import '../styles/fundamentals.css';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  globe: Globe,
  swap: ArrowLeftRight,
  code: Code,
  plug: Plug,
  key: Key,
  shield: Shield,
  db: Database,
  clock: Timer,
  cloud: Cloud,
  branch: GitBranch
};

interface QuizStatus {
  isStaff?: boolean;
  canAttemptToday: boolean;
  completedToday: boolean;
  nextAttemptAt: string | null;
  activeAttempt: {
    id: string;
    started_at: string;
    remaining_seconds: number;
  } | null;
  totalAttempts: number;
  bestScore: number;
  bestAttemptId: string | null;
  currentBadge: {
    id: string;
    name: string;
    rarity: string;
    icon: string;
    awarded_at: string;
  } | null;
  recentAttempts: Array<{
    id: string;
    score: number;
    correct_count: number;
    wrong_count: number;
    hint_penalty: number;
    duration_seconds: number;
    completed_at: string;
    badge: {
      id: string;
      name: string;
      rarity: string;
      icon: string;
    } | null;
  }>;
}

interface ActiveQuizData {
  attemptId: string;
  resumed: boolean;
  questions: {
    multipleChoice: Array<{
      id: string;
      index: number;
      topic: string;
      question: string;
      options: string[];
      hasHint: boolean;
    }>;
    matching: {
      definitions: Array<{ index: number; definition: string }>;
      terms: Array<{ id: string; term: string }>;
    };
  };
  hintsUsed: number[];
  userAnswers?: {
    multipleChoice: (number | null)[];
    matching: (string | null)[];
  } | null;
  startedAt: string;
  durationSeconds: number;
  remainingSeconds: number;
}

interface QuizResultData {
  attemptId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  multipleChoiceCorrect: number;
  matchingCorrect: number;
  hintPenalties: number;
  durationSeconds: number;
  timedOut: boolean;
  completedAt: string;
  isStaffTest?: boolean;
  badgeAwarded?: {
    name: string;
    rarity: string;
    icon: string;
    isUpgrade: boolean;
  } | null;
  badge?: {
    earnedRarity: string | null;
    badgeAwardedId: string | null;
    badgeName: string | null;
    action: 'awarded' | 'upgraded' | 'retained' | 'none';
    message: string;
  };
  detailedReview: {
    multipleChoice: Array<{
      index: number;
      question: string;
      topic: string;
      options: string[];
      selectedOption: number | null;
      correctOption: number;
      isCorrect: boolean;
      hintUsed: boolean;
      pointsAwarded: number;
    }>;
    matching: Array<{
      index: number;
      definition: string;
      selectedTermId: string | null;
      correctTermId: string;
      isCorrect: boolean;
      pointsAwarded: number;
    }>;
  };
}

export const Fundamentals: React.FC = () => {
  const { user } = useAuth();
  const [lang, setLang] = useState<'tr' | 'en'>('en');
  const [activeTab, setActiveTab] = useState<'topics' | 'quiz' | 'glossary' | 'faq'>('topics');
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<{
    title: string;
    definition: string;
    topic: number;
  } | null>(null);

  // Quiz state
  const [quizStatus, setQuizStatus] = useState<QuizStatus | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuizData | null>(null);
  const [quizStep, setQuizStep] = useState<number>(0); // 0-19: MC, 20: Matching
  const [mcAnswers, setMcAnswers] = useState<(number | null)[]>(Array(20).fill(null));
  const [matchingAnswers, setMatchingAnswers] = useState<(string | null)[]>(Array(5).fill(null));
  const [hintsUnlocked, setHintsUnlocked] = useState<Record<number, string>>({});
  const [hintConfirmIndex, setHintConfirmIndex] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Fetch status on mount or tab change
  const fetchQuizStatus = async () => {
    try {
      setQuizLoading(true);
      const data = await api.get<QuizStatus>('/quiz/status');
      setQuizStatus(data);
    } catch (err) {
      console.error('Failed to fetch quiz status:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const data = await api.get<any[]>('/quiz/leaderboard');
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  useEffect(() => {
    fetchQuizStatus();
    fetchLeaderboard();
  }, []);

  // Timer loop for active quiz
  useEffect(() => {
    if (!activeQuiz) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuiz]);

  const handleStartOrResumeQuiz = async () => {
    try {
      setQuizLoading(true);
      const session = await api.post<ActiveQuizData>('/quiz/start', {});
      setActiveQuiz(session);
      setSecondsRemaining(session.remainingSeconds);
      setQuizResult(null);

      if (session.userAnswers?.multipleChoice) {
        setMcAnswers(session.userAnswers.multipleChoice);
      } else {
        setMcAnswers(Array(20).fill(null));
      }

      if (session.userAnswers?.matching) {
        setMatchingAnswers(session.userAnswers.matching);
      } else {
        setMatchingAnswers(Array(5).fill(null));
      }

      setQuizStep(0);
      setActiveTab('quiz');
    } catch (err: any) {
      alert(err.message || 'Failed to start quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleRequestHint = async (qIndex: number) => {
    if (!activeQuiz) return;
    try {
      const res = await api.post<{ questionIndex: number; hint: string }>('/quiz/hint', {
        attemptId: activeQuiz.attemptId,
        questionIndex: qIndex
      });
      setHintsUnlocked((prev) => ({ ...prev, [qIndex]: res.hint }));
      setHintConfirmIndex(null);
    } catch (err: any) {
      alert(err.message || 'Failed to request hint');
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || submittingQuiz) return;
    try {
      setSubmittingQuiz(true);
      const result = await api.post<QuizResultData>('/quiz/submit', {
        attemptId: activeQuiz.attemptId,
        answers: mcAnswers,
        matchingAnswers: matchingAnswers
      });
      setQuizResult(result);
      setActiveQuiz(null);
      setSubmitConfirmOpen(false);
      fetchQuizStatus();
      fetchLeaderboard();
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz();
  };

  const selectedTopic = useMemo(() => {
    return FUNDAMENTALS_TOPICS.find((t) => t.id === selectedTopicId) || FUNDAMENTALS_TOPICS[0];
  }, [selectedTopicId]);

  const filteredGlossary = useMemo(() => {
    const list = FUNDAMENTALS_GLOSSARY[lang] || [];
    if (!glossaryQuery.trim()) return list;
    const q = glossaryQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.terms.some((term) => term.toLowerCase().includes(q))
    );
  }, [lang, glossaryQuery]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const timerRatio = activeQuiz ? secondsRemaining / (activeQuiz.durationSeconds || 1800) : 1;
  const isTimerWarning = timerRatio <= 0.33 && timerRatio > 0.1;
  const isTimerCritical = timerRatio <= 0.1;

  const currentTopicIcon = (iconName: string) => {
    const Comp = ICON_MAP[iconName] || Globe;
    return <Comp className="w-5 h-5" />;
  };

  return (
    <div className="fundamentals-container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 mb-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-magenta/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-magenta/20 text-magenta border border-magenta/30">
                ICEBERG X ACADEMY
              </span>
              <span className="text-xs font-mono text-cyan-300">11 TOPICS · 100-POINT QUIZ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Web Fundamentals Crash Course
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'tr'
                ? 'Web mimarisini bir buzdağının görünmeyen kısmı gibi katman katman keşfedin, bilginizi sınavla ölçün ve rozet kazanın.'
                : 'Explore the full stack of web architecture layer by layer, validate your skills with the certification quiz, and earn badges.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setLang('tr')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  lang === 'tr'
                    ? 'bg-magenta text-white shadow-md shadow-magenta/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-magenta text-white shadow-md shadow-magenta/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Quick Quiz Action Button */}
            {!activeQuiz && (
              <button
                onClick={() => {
                  setActiveTab('quiz');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-magenta to-pink-600 hover:from-pink-600 hover:to-magenta text-white shadow-lg shadow-magenta/25 hover:shadow-magenta/40 transition-all transform hover:-translate-y-0.5"
              >
                <Trophy className="w-4 h-4" />
                <span>
                  {user?.role === 'CUBE'
                    ? (lang === 'tr' ? "Quiz'e Git" : 'Go to Quiz')
                    : (lang === 'tr' ? "Quiz'i Test Et" : 'Test Quiz (Staff)')}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'topics'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'tr' ? '1. Konular & Müfredat' : '1. Topics & Curriculum'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-magenta text-white shadow-md shadow-magenta/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{lang === 'tr' ? '2. Sertifikasyon Quiz' : '2. Certification Quiz'}</span>
            {quizStatus?.currentBadge && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'tr' ? '3. Terimler Sözlüğü' : '3. Glossary'}</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </button>
        </div>
      </div>

      {/* ======================================================================
          TAB 1: TOPICS & CURRICULUM
          ====================================================================== */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation: Topics Selector */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'tr' ? 'Bölüm Listesi' : 'Chapters'}
              </span>
              <span className="text-xs font-mono font-bold text-magenta">11 {lang === 'tr' ? 'Konu' : 'Topics'}</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[620px] overflow-y-auto pr-1">
              {FUNDAMENTALS_TOPICS.map((topic) => {
                const isSelected = topic.id === selectedTopicId;
                const IconComponent = ICON_MAP[topic.icon] || Globe;
                const title = topic[lang].title;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'hover:bg-slate-50 text-gray-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-magenta text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-gray-400'}`}>
                          #{String(topic.id).padStart(2, '0')} · {topic.depth}
                        </span>
                      </div>
                      <div className="text-xs font-bold truncate leading-tight mt-0.5">{title}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 bg-gradient-to-br from-magenta/5 to-cyan-500/5 rounded-xl p-4 border border-magenta/10">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                <Trophy className="w-4 h-4 text-magenta" />
                <span>{lang === 'tr' ? 'Öğrendiklerini Sına' : 'Test What You Learned'}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {lang === 'tr'
                  ? 'Konuları bitirdikten sonra 100 puanlık quizi çözüp rozet kazanabilirsin.'
                  : 'After studying, take the 100-point quiz to claim your badge.'}
              </p>
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-magenta hover:bg-magenta/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{lang === 'tr' ? "Quiz'e Başla" : 'Start Quiz'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Area: Topic Reader */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-10 text-white shadow-xl">
            {/* Header info */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  TOPIC {String(selectedTopic.id).padStart(2, '0')} / 11
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedTopic.depth} depth</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={selectedTopic.id <= 1}
                  onClick={() => setSelectedTopicId(selectedTopic.id - 1)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Previous topic"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  disabled={selectedTopic.id >= 11}
                  onClick={() => setSelectedTopicId(selectedTopic.id + 1)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Next topic"
                >
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>

            <div className="mt-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2 rounded-xl bg-magenta/20 text-magenta border border-magenta/30">
                  {currentTopicIcon(selectedTopic.icon)}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedTopic[lang].title}
                </h2>
              </div>
              <p className="text-base text-slate-400 leading-relaxed mt-2 pl-12 border-l-2 border-magenta/40">
                {selectedTopic[lang].summary}
              </p>
            </div>

            {/* Topic Article Body */}
            <div
              className="topic-html-content prose prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: selectedTopic[lang].html }}
            />

            {/* Deep Dive Callout */}
            {TOPIC_DEEPENING[selectedTopic.id] && (
              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-magenta/15 to-purple-950/40 border border-magenta/30 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-magenta text-white">
                    {lang === 'tr' ? 'DERİNLEŞTİR' : 'DEEP DIVE'}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {lang === 'tr' ? 'Gerçek Proje Perspektifi' : 'Real-Project Perspective'}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {TOPIC_DEEPENING[selectedTopic.id][lang]}
                </p>
              </div>
            )}

            {/* External Resource Card */}
            {LEARNING_RESOURCES[selectedTopic.id] && (
              <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    {lang === 'tr' ? 'ÖNERİLEN KAYNAK' : 'RECOMMENDED RESOURCE'}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    {LEARNING_RESOURCES[selectedTopic.id].title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {LEARNING_RESOURCES[selectedTopic.id].source}
                  </p>
                </div>
                <a
                  href={LEARNING_RESOURCES[selectedTopic.id].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all shrink-0"
                >
                  <span>{lang === 'tr' ? 'Dokümantasyonu Oku' : 'Read Docs'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Navigation Bottom Footer */}
            <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              {selectedTopic.id > 1 ? (
                <button
                  onClick={() => {
                    setSelectedTopicId(selectedTopic.id - 1);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Önceki Konu' : 'Previous Topic'}</span>
                </button>
              ) : (
                <div />
              )}

              {selectedTopic.id < 11 ? (
                <button
                  onClick={() => {
                    setSelectedTopicId(selectedTopic.id + 1);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  <span>{lang === 'tr' ? 'Sonraki Konu' : 'Next Topic'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('quiz');
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-magenta text-white hover:bg-magenta/90 shadow-md shadow-magenta/30 transition-all"
                >
                  <span>{lang === 'tr' ? "Tüm Konular Bitti! Quiz'e Geç" : 'All Done! Take the Quiz'}</span>
                  <Trophy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 2: CERTIFICATION QUIZ
          ====================================================================== */}
      {activeTab === 'quiz' && (
        <div className="space-y-8">
          {/* Active Quiz Running Screen */}
          {activeQuiz && (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative text-white">
              {/* Sticky Top Timer Bar */}
              <div className="sticky top-20 z-40 mb-8 bg-slate-900/95 backdrop-blur border border-slate-700/80 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Timer className={`w-4 h-4 ${isTimerCritical ? 'text-red-500 animate-pulse' : isTimerWarning ? 'text-magenta' : 'text-cyan-400'}`} />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                      {isTimerCritical ? 'CRITICAL TIME REMAINING' : 'QUIZ COUNTDOWN'}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-base font-extrabold tracking-wider ${
                      isTimerCritical
                        ? 'text-red-500 animate-pulse'
                        : isTimerWarning
                        ? 'text-magenta'
                        : 'text-cyan-400'
                    }`}
                  >
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isTimerCritical
                        ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                        : isTimerWarning
                        ? 'bg-gradient-to-r from-magenta to-pink-500 shadow-[0_0_12px_rgba(255,38,153,0.8)]'
                        : 'bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_12px_rgba(95,227,255,0.8)]'
                    }`}
                    style={{ width: `${Math.max(0, timerRatio * 100)}%` }}
                  />
                </div>
              </div>

              {/* Navigation Dots (Questions 1 to 20 + Matching) */}
              <div className="mb-8 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                  <span>NAVIGATE QUESTIONS (1–20 MULTIPLE CHOICE, 21 MATCHING)</span>
                  <span>{mcAnswers.filter((a) => a !== null).length} / 20 ANSWERED</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: 20 }).map((_, idx) => {
                    const isCurrent = quizStep === idx;
                    const isAnswered = mcAnswers[idx] !== null;
                    return (
                      <button
                        key={idx}
                        onClick={() => setQuizStep(idx)}
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-white text-slate-950 scale-110 shadow-lg shadow-white/30 border border-white'
                            : isAnswered
                            ? 'bg-magenta text-white shadow-sm shadow-magenta/40 border border-magenta/60'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                  {/* Matching step button */}
                  <button
                    onClick={() => setQuizStep(20)}
                    className={`px-3 h-8 rounded-xl font-mono text-xs font-bold flex items-center gap-1 transition-all ${
                      quizStep === 20
                        ? 'bg-white text-slate-950 scale-105 shadow-lg shadow-white/30 border border-white'
                        : matchingAnswers.every((a) => a !== null)
                        ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-800 text-cyan-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>Match (21)</span>
                  </button>
                </div>
              </div>

              {/* STEP: MULTIPLE CHOICE QUESTION (0 to 19) */}
              {quizStep >= 0 && quizStep < 20 && (
                <div>
                  {(() => {
                    const q = activeQuiz.questions.multipleChoice[quizStep];
                    if (!q) return null;
                    const selectedOpt = mcAnswers[quizStep];
                    const hintText = hintsUnlocked[quizStep];

                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between gap-4">
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-magenta/20 text-magenta border border-magenta/30">
                            {q.topic}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            QUESTION {quizStep + 1} OF 20 · 4 POINTS
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                          {q.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3 pt-2">
                          {q.options.map((optionText, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            return (
                              <label
                                key={optIdx}
                                onClick={() => {
                                  const updated = [...mcAnswers];
                                  updated[quizStep] = optIdx;
                                  setMcAnswers(updated);
                                }}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-magenta/15 border-magenta text-white shadow-md shadow-magenta/20'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question_${quizStep}`}
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="mt-1 accent-magenta shrink-0"
                                />
                                <div className="text-sm sm:text-base leading-relaxed">
                                  <span className="font-bold mr-2 font-mono text-magenta">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  {optionText}
                                </div>
                              </label>
                            );
                          })}
                        </div>

                        {/* Hint Button & Panel */}
                        <div className="pt-2">
                          {!hintText ? (
                            <button
                              onClick={() => setHintConfirmIndex(quizStep)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Show Hint (-1 point if correct)</span>
                            </button>
                          ) : (
                            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>UNLOCKED HINT (-1 POINT PENALTY ON CORRECT ANSWER)</span>
                              </div>
                              <p className="text-xs sm:text-sm leading-relaxed">{hintText}</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-800">
                          <button
                            disabled={quizStep === 0}
                            onClick={() => setQuizStep(quizStep - 1)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white flex items-center gap-1"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>

                          <button
                            onClick={() => setQuizStep(quizStep + 1)}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-magenta hover:bg-magenta/90 text-white shadow-md shadow-magenta/30 transition-all flex items-center gap-1"
                          >
                            <span>{quizStep === 19 ? 'Proceed to Matching' : 'Next Question'}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* STEP 20: MATCHING SECTION (5 items) */}
              {quizStep === 20 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      FINAL STAGE · CONCEPT MATCHING
                    </span>
                    <span className="text-xs font-mono text-slate-400">5 MATCHES · 4 POINTS EACH</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Match each concept with its correct definition.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Select the term that best defines each description below. Each match is worth 4 points.
                  </p>

                  <div className="space-y-4 pt-2">
                    {activeQuiz.questions.matching.definitions.map((defItem, defIdx) => {
                      return (
                        <div
                          key={defIdx}
                          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                        >
                          <div className="md:col-span-7">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">
                              MATCH #{defIdx + 1}
                            </span>
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                              {defItem.definition}
                            </p>
                          </div>
                          <div className="md:col-span-5">
                            <select
                              value={matchingAnswers[defIdx] || ''}
                              onChange={(e) => {
                                const updated = [...matchingAnswers];
                                updated[defIdx] = e.target.value || null;
                                setMatchingAnswers(updated);
                              }}
                              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-medium focus:border-cyan-400 focus:outline-none"
                            >
                              <option value="">-- Choose matching concept --</option>
                              {activeQuiz.questions.matching.terms.map((term) => (
                                <option key={term.id} value={term.id}>
                                  {term.term}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Actions */}
                  <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-800">
                    <button
                      onClick={() => setQuizStep(19)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Question 20</span>
                    </button>

                    <button
                      onClick={() => setSubmitConfirmOpen(true)}
                      className="px-6 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-magenta to-pink-600 hover:from-pink-600 hover:to-magenta text-white shadow-lg shadow-magenta/30 hover:shadow-magenta/50 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish & Submit Quiz</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result Review Screen (Shown after submission) */}
          {quizResult && !activeQuiz && (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl text-white space-y-8">
              <div className="text-center max-w-xl mx-auto py-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-magenta/20 text-magenta border border-magenta/30 mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {quizResult.isStaffTest
                      ? 'STAFF SANDBOX TEST COMPLETE (NOT SAVED TO DIRECTORY / LEADERBOARD)'
                      : 'QUIZ EVALUATION COMPLETE'}
                  </span>
                </div>

                <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-magenta via-pink-400 to-cyan-300">
                  {quizResult.score} / 100
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mt-4 text-white">
                  {quizResult.correctCount} / 25 Correct Answers
                </h2>

                <p className="text-sm text-slate-400 mt-2">
                  Multiple Choice: {quizResult.multipleChoiceCorrect}/20 · Matching: {quizResult.matchingCorrect}/5
                  {quizResult.hintPenalties > 0 && ` · Hint penalty: -${quizResult.hintPenalties} pt`}
                  {` · Time: ${Math.floor(quizResult.durationSeconds / 60)}m ${quizResult.durationSeconds % 60}s`}
                </p>

                {quizResult.timedOut && (
                  <div className="mt-3 inline-block px-3 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    Time expired — answers were evaluated automatically.
                  </div>
                )}
              </div>

              {/* Badge Award/Upgrade Showcase Card */}
              {quizResult.isStaffTest ? (
                <div className="max-w-lg mx-auto">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center shadow-lg">
                    {quizResult.badgeAwarded ? (
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold block mb-3">
                          🏆 STAFF PREVIEW: WOULD EARN {quizResult.badgeAwarded.rarity.toUpperCase()} BADGE
                        </span>
                        <div className="flex justify-center mb-4">
                          <BadgeMedal
                            badge={{
                              name: quizResult.badgeAwarded.name,
                              rarity: quizResult.badgeAwarded.rarity,
                              description: `Preview badge for scoring ${quizResult.score}/100.`,
                              icon: quizResult.badgeAwarded.icon || 'TechScout'
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-300">
                          A Cube scoring {quizResult.score}/100 would be awarded or upgraded to the <b>{quizResult.badgeAwarded.name}</b> ({quizResult.badgeAwarded.rarity}) badge.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-slate-300">Passing score not reached (&lt; 50 pts)</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          A Cube scoring below 50 would not earn a badge on this attempt.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : quizResult.badge && (
                <div className="max-w-lg mx-auto">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center shadow-lg">
                    {quizResult.badge.earnedRarity ? (
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold block mb-3">
                          {quizResult.badge.action === 'upgraded'
                            ? '🚀 BADGE UPGRADED!'
                            : quizResult.badge.action === 'awarded'
                            ? '🎉 NEW BADGE EARNED!'
                            : 'CURRENT BADGE RETAINED'}
                        </span>

                        <div className="flex justify-center mb-4">
                          <BadgeMedal
                            badge={{
                              name: quizResult.badge.badgeName || `${quizResult.badge.earnedRarity} Badge`,
                              rarity: quizResult.badge.earnedRarity,
                              description: `Awarded for scoring ${quizResult.score}/100 on the Web Fundamentals Certification Quiz.`,
                              icon: 'TechScout'
                            }}
                          />
                        </div>

                        <p className="text-xs text-slate-300">{quizResult.badge.message}</p>
                      </div>
                    ) : (
                      <div>
                        <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-slate-300">Passing score not reached (50+)</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Review the 11 topics and retake the quiz tomorrow to earn your badge!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Question By Question Breakdown */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>Answer Breakdown & Explanations</span>
                </h3>

                <div className="space-y-4">
                  {quizResult.detailedReview.multipleChoice.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-xs sm:text-sm ${
                          item.isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                            : 'bg-red-950/20 border-red-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                          <span className="font-bold text-white">Q{idx + 1}: {item.topic}</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded ${
                              item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            +{item.pointsAwarded} pts {item.hintUsed && '(Hint used)'}
                          </span>
                        </div>
                        <p className="font-semibold text-white mb-2">{item.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className={item.isCorrect ? 'text-emerald-300' : 'text-red-300'}>
                            <b>Your Answer:</b>{' '}
                            {item.selectedOption !== null
                              ? `${String.fromCharCode(65 + item.selectedOption)}. ${item.options[item.selectedOption]}`
                              : 'Left Blank'}
                          </div>
                          {!item.isCorrect && (
                            <div className="text-emerald-400">
                              <b>Correct Answer:</b>{' '}
                              {`${String.fromCharCode(65 + item.correctOption)}. ${item.options[item.correctOption]}`}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setQuizResult(null);
                    fetchQuizStatus();
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return to Quiz Hub</span>
                </button>
              </div>
            </div>
          )}

          {/* Quiz Hub Overview Screen (When NOT taking quiz and NO result open) */}
          {!activeQuiz && !quizResult && (
            <div className="space-y-8">
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Daily Attempt Status (Cubes) or Staff Sandbox Test Mode (Admin/Mentor) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      <Clock className="w-4 h-4 text-magenta" />
                      <span>{user?.role === 'CUBE' ? 'Daily Attempt Status' : 'Staff Testing Sandbox'}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900">
                      {user?.role !== 'CUBE'
                        ? 'Unlimited Staff Test Mode'
                        : quizLoading
                        ? 'Checking Daily Status...'
                        : quizStatus?.activeAttempt
                        ? 'Ongoing Quiz in Progress'
                        : quizStatus?.completedToday
                        ? 'Daily Limit Reached'
                        : '1 Attempt Ready Today'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {user?.role !== 'CUBE'
                        ? 'As an Admin/Mentor, you can take and test the certification exam repeatedly without daily limits. Your scores are not posted to the directory or leaderboard, and no Cube profile is created.'
                        : quizLoading
                        ? 'Connecting to quiz server...'
                        : quizStatus?.activeAttempt
                        ? 'You have an active session! You can resume and finish your attempt.'
                        : quizStatus?.completedToday
                        ? 'You completed your attempt for today. Come back tomorrow at 00:00 UTC for your next try!'
                        : 'Cubes can take the quiz once per calendar day. Scores and badges are recorded to your profile.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    {quizLoading ? (
                      <div className="py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-magenta border-t-transparent rounded-full animate-spin" />
                        <span>Checking status...</span>
                      </div>
                    ) : quizStatus?.activeAttempt ? (
                      <button
                        onClick={handleStartOrResumeQuiz}
                        disabled={quizLoading}
                        className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-magenta hover:bg-magenta/90 shadow-md shadow-magenta/30 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Resume Ongoing Quiz</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : user?.role === 'CUBE' && quizStatus?.completedToday ? (
                      <div className="py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs font-mono text-gray-500 flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked until tomorrow</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartOrResumeQuiz}
                        disabled={quizLoading}
                        className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-magenta to-pink-600 hover:from-pink-600 hover:to-magenta shadow-md shadow-magenta/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>
                          {user?.role === 'CUBE'
                            ? "Start Today's Quiz (30 Min)"
                            : 'Start Test Quiz (Staff Sandbox)'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Cube's Best Score & Earned Badge OR Staff Certification Guide */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      <Award className="w-4 h-4 text-cyan-600" />
                      <span>{user?.role === 'CUBE' ? 'Your Achievement' : 'Certification Badges'}</span>
                    </div>

                    {user?.role === 'CUBE' ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-gray-900">
                            {quizStatus?.bestScore ? `${quizStatus.bestScore} / 100` : '—'}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">Personal Best</span>
                        </div>

                        <div className="mt-4">
                          {quizStatus?.currentBadge ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                              <BadgeDisc icon={quizStatus.currentBadge.icon} rarity={quizStatus.currentBadge.rarity} size="sm" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-900 truncate">
                                  {quizStatus.currentBadge.name}
                                </div>
                                <RarityPill rarity={quizStatus.currentBadge.rarity} />
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Score 50+ to earn a Common badge, 75+ for Rare, and 90+ for Epic!
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 mt-2 text-xs text-gray-600">
                        <p className="text-[11px] text-gray-500">Cubes earn automated tiered badges on their profile:</p>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-bold text-gray-800">50 - 74 pts</span>
                          <RarityPill rarity="Common" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-bold text-gray-800">75 - 89 pts</span>
                          <RarityPill rarity="Rare" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-bold text-gray-800">90 - 100 pts</span>
                          <RarityPill rarity="Epic" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {user?.role === 'CUBE'
                        ? `Total Attempts: ${quizStatus?.totalAttempts || 0}`
                        : `Staff Access: ${user?.role}`}
                    </span>
                    <span className="text-emerald-600 font-bold">Active Monitoring</span>
                  </div>
                </div>

                {/* 3. Quiz Certification Rules */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Exam Rules & Scoring</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-2 mt-3">
                      <li className="flex items-start gap-1.5">
                        <span className="text-magenta font-bold">·</span>
                        <span><b>20 Multiple Choice</b> questions (4 pts each).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-magenta font-bold">·</span>
                        <span><b>5 Matching Pairs</b> in the final section (4 pts each).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-magenta font-bold">·</span>
                        <span><b>Hints:</b> Unlocking a hint deducts 1 pt on that question if correct.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-magenta font-bold">·</span>
                        <span><b>Upgrades:</b> Higher scores automatically upgrade your badge!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                    <span>Total: 100 Pts · Time: 30 Mins</span>
                  </div>
                </div>
              </div>

              {/* Past Attempts Table & Leaderboard Tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Past attempts (Shown only for Cubes) */}
                {user?.role === 'CUBE' && (
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-gray-900">Your Past Attempts</h3>
                      <span className="text-xs text-gray-400 font-mono">
                        {quizStatus?.recentAttempts.length || 0} recorded
                      </span>
                    </div>

                    {quizStatus?.recentAttempts && quizStatus.recentAttempts.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-mono">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Score</th>
                              <th className="pb-2">Correct</th>
                              <th className="pb-2">Penalty</th>
                              <th className="pb-2">Badge</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {quizStatus.recentAttempts.map((att) => (
                              <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 text-gray-600 font-mono">
                                  {new Date(att.completed_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 font-bold text-gray-900">
                                  {att.score} / 100
                                </td>
                                <td className="py-3 text-gray-600">
                                  {att.correct_count} / 25
                                </td>
                                <td className="py-3 text-gray-600 font-mono">
                                  {att.hint_penalty > 0 ? `-${att.hint_penalty} pt` : '0'}
                                </td>
                                <td className="py-3">
                                  {att.badge ? (
                                    <RarityPill rarity={att.badge.rarity} />
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-gray-400">
                        No attempts recorded yet. Take the quiz to get your first score!
                      </div>
                    )}
                  </div>
                )}

                {/* Leaderboard (Full width for staff, col-span-5 for cubes) */}
                <div className={`${user?.role === 'CUBE' ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white rounded-2xl border border-gray-200 p-6 shadow-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <h3 className="text-base font-bold text-gray-900">Top Cubes Leaderboard</h3>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {user?.role !== 'CUBE' ? 'Real-time candidate standings' : 'Top performers'}
                    </span>
                  </div>

                  {leaderboard.length > 0 ? (
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {leaderboard.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-all text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center ${
                                idx === 0
                                  ? 'bg-amber-400 text-amber-950 font-extrabold'
                                  : idx === 1
                                  ? 'bg-slate-300 text-slate-800'
                                  : idx === 2
                                  ? 'bg-amber-700/20 text-amber-800'
                                  : 'text-gray-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-gray-900">{item.userName}</div>
                              <div className="text-[10px] font-mono text-gray-400">Cube #{item.cubeNumber}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {item.badge && <RarityPill rarity={item.badge.rarity} />}
                            <span className="font-extrabold text-sm text-gray-900 font-mono">
                              {item.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-gray-400">
                      Leaderboard will populate as Cubes complete the quiz.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
          TAB 3: TECHNICAL TERMS GLOSSARY
          ====================================================================== */}
      {activeTab === 'glossary' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {lang === 'tr' ? 'Teknik Terimler Sözlüğü' : 'Technical Terms Glossary'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'tr'
                  ? 'Eğitim boyunca geçen tüm temel kavramlar, tanımları ve ilgili konuları.'
                  : 'Key concepts across all 11 topics with quick definitions and references.'}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'tr' ? 'Terim veya tanım ara...' : 'Search term or definition...'}
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-slate-50 text-xs focus:outline-none focus:border-magenta focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-gray-100 bg-slate-50/60 hover:bg-white hover:border-magenta/30 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-extrabold text-sm text-gray-900">{item.title}</h4>
                      <button
                        onClick={() => {
                          setSelectedTopicId(item.topic);
                          setActiveTab('topics');
                        }}
                        className="text-[10px] font-mono text-magenta hover:underline"
                      >
                        Topic #{item.topic}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.definition}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1">
                    {item.terms.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 4: FAQS
          ====================================================================== */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500 mb-8">
            Answers to common questions regarding the crash course and certification quiz.
          </p>

          <div className="space-y-4">
            {FUNDAMENTALS_FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-2xl bg-slate-50 border border-gray-200/80 transition-all open:bg-white open:shadow-sm"
              >
                <summary className="font-bold text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{faq[lang].q}</span>
                  <span className="text-magenta group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {faq[lang].a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Footer Attribution */}
      <footer className="pt-8 pb-4 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-magenta inline-block"></span>
          <span className="font-semibold text-gray-700">Iceberg X Academy · Web Fundamentals</span>
        </div>
        <p className="m-0 text-xs text-gray-500">
          This system was built by{' '}
          <a
            href="/x/032"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-gray-800 hover:text-magenta transition-colors underline decoration-gray-300 hover:decoration-magenta underline-offset-2"
            title="View Cube 032 Public Profile"
          >
            Cube 032
          </a>{' '}
          and{' '}
          <a
            href="/x/042"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-gray-800 hover:text-magenta transition-colors underline decoration-gray-300 hover:decoration-magenta underline-offset-2"
            title="View Cube 042 Public Profile"
          >
            Cube 042
          </a>.
        </p>
      </footer>

      {/* ======================================================================
          HINT CONFIRMATION MODAL
          ====================================================================== */}
      {hintConfirmIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto text-xl font-bold">
              ?
            </div>
            <h3 className="text-xl font-extrabold">Are you sure?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Revealing this hint will reduce the maximum points for Question #{hintConfirmIndex + 1} from{' '}
              <b>4 points to 3 points</b> if answered correctly.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setHintConfirmIndex(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestHint(hintConfirmIndex)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold transition-all"
              >
                Yes, Reveal Hint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          SUBMIT CONFIRMATION MODAL
          ====================================================================== */}
      {submitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-magenta/20 text-magenta border border-magenta/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold">Submit Quiz for Evaluation?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              You answered <b>{mcAnswers.filter((a) => a !== null).length} of 20</b> multiple choice questions and{' '}
              <b>{matchingAnswers.filter((a) => a !== null).length} of 5</b> matching items. Unanswered items receive 0 points.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={submittingQuiz}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-magenta hover:bg-magenta/90 text-white transition-all flex items-center gap-2"
              >
                {submittingQuiz ? 'Evaluating...' : 'Yes, Finalize & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundamentals;
