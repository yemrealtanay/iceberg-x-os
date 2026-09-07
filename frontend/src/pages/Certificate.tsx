import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ShieldAlert, Printer, ArrowLeft } from 'lucide-react';

const RARITY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  COMMON: { color: '#B9B2A2', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.14)' },
  RARE: { color: '#8FC0EE', bg: 'rgba(143,192,238,0.12)', border: 'rgba(143,192,238,0.3)' },
  EPIC: { color: '#D98BE0', bg: 'rgba(217,139,224,0.12)', border: 'rgba(217,139,224,0.3)' },
};

const RARITY_COLORS_LIGHT: Record<string, { color: string; bg: string; border: string }> = {
  COMMON: { color: '#6B7480', bg: '#F1F3F6', border: '#E6DFD4' },
  RARE: { color: '#2563C9', bg: '#E8F0FD', border: '#BFDBFE' },
  EPIC: { color: '#7C3AED', bg: '#F3E9FE', border: '#DDD6FE' },
};

export const Certificate: React.FC = () => {
  const { cubeId } = useParams<{ cubeId: string }>();
  const [searchParams] = useSearchParams();
  const autoPrint = searchParams.get('print') === 'true' || searchParams.get('download') === 'true';

  const [data, setData] = useState<any | null>(null);
  const [stats, setStats] = useState<{
    completedMissions: number;
    badgesEarned: number;
    attendanceRate: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        let profileObj: any = null;
        let statsObj: any = null;

        try {
          // Public endpoint works for both authenticated & unauthenticated visitors
          const pubRes = await api.get(`/cubes/public/${cubeId}`);
          if (pubRes?.profile) {
            profileObj = pubRes.profile;
            statsObj = pubRes.stats;
          }
        } catch {
          // Fallback to internal endpoints if needed
          const [cubeRes, statsRes] = await Promise.all([
            api.get(`/cubes/${cubeId}`),
            api.get(`/offboarding/stats/${cubeId}`).catch(() => null),
          ]);
          profileObj = cubeRes?.profile || cubeRes;
          statsObj = statsRes;
        }

        if (!profileObj) {
          throw new Error('Certificate data not found');
        }

        setData({ profile: profileObj });
        if (statsObj) setStats(statsObj);
      } catch (err: any) {
        setError(err.message || 'Failed to load certificate data');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificateData();
  }, [cubeId]);

  useEffect(() => {
    if (!loading && data?.profile?.offboarding_record && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, data, autoPrint]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-900 text-amber-200">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data || !data.profile?.offboarding_record) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">
        <div className="bg-white max-w-md p-6 rounded-2xl shadow-subtle border border-red-100 flex flex-col gap-4 text-center">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-extrabold text-gray-900 text-sm">Certificate Not Found</h3>
          <p className="text-xs text-gray-500">
            {error || 'This Cube does not have an active offboarding certificate issued yet.'}
          </p>
          <Link to="/offboarding" className="mt-2 text-xs font-bold text-magenta hover:underline">
            Go back to Offboarding Directory
          </Link>
        </div>
      </div>
    );
  }

  const { profile } = data;
  const record = profile.offboarding_record;
  const isAchievement = record.type === 'success' || record.type === 'achievement';

  const formattedDate = new Date(record.issue_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const verificationUrl = `${window.location.origin}/verify/${record.certificate_no}`;
  const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  // Completed quests (unified with PublicProfile logic)
  const quests = (profile.cube_quests || [])
    .filter((cq: any) => cq.is_completed !== false && (cq.quest || cq.title))
    .map((cq: any) => {
      const q = cq.quest || cq;
      return {
        id: cq.id || q.id,
        title: q.title || 'Fellowship Quest',
        rarity: (q.difficulty || q.rarity || 'COMMON').toUpperCase(),
        criteria: q.criteria || q.description || 'Completed successfully',
        date: new Date(cq.completed_at || cq.created_at || Date.now()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        badge: q.rewards?.[0]?.name ? `Badge: ${q.rewards[0].name}` : 'Quest Accomplished',
      };
    });

  // Badges earned
  const badges = (profile.cube_badges || []).map((cb: any) => ({
    id: cb.id,
    name: cb.badge?.name || 'Fellowship Badge',
    rarity: (cb.badge?.rarity || 'COMMON').toUpperCase(),
    reason: cb.mission?.title
      ? `Mission contribution: ${cb.mission.title}`
      : cb.badge?.description || 'Awarded for exceptional fellowship contribution',
    date: new Date(cb.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }));

  const questsCount = stats?.questsCompleted ?? (profile.cube_quests?.length || quests.length);
  const badgesCount = stats?.badgesEarned ?? badges.length;
  const missionContributionsCount = stats?.completedMissions ?? (profile.team_memberships?.length || 0);
  const attendanceRateVal = stats?.attendanceRate !== null && stats?.attendanceRate !== undefined
    ? `${stats.attendanceRate}%`
    : '100%';

  const statsList = [
    { value: questsCount, label: 'QUESTS COMPLETED' },
    { value: badgesCount, label: 'BADGES EARNED' },
    { value: missionContributionsCount, label: 'MISSION CONTRIBUTIONS' },
    { value: attendanceRateVal, label: 'MEETING ATTENDANCE' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-screen-wrapper min-h-screen bg-stone-900 py-8 px-4 flex flex-col items-center">
      {/* Top Actions Bar (Hidden during print) */}
      <div className="w-full max-w-[1120px] flex justify-between items-center mb-6 no-print">
        <Link
          to={`/x/${profile.cube_number}`}
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="certificate-print-container w-full flex flex-col items-center gap-8">
        
        {/* =========================================================================
            PAGE 1: CERTIFICATE
           ========================================================================= */}
        <section
          className={`certificate-page certificate-page-1 w-full max-w-[1120px] aspect-[297/210] p-[38px] box-border relative overflow-hidden select-text ${
            isAchievement
              ? 'bg-[#0E0D0B] text-[#F6F1E7]'
              : 'bg-[#FBF8F3] text-[#14161A]'
          }`}
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          <div
            className="relative h-full w-full flex flex-col justify-between rounded p-[30px_44px_26px] overflow-hidden box-border"
            style={{
              border: isAchievement ? '1px solid rgba(201,150,43,0.42)' : '1px solid rgba(229,0,125,0.3)',
              background: isAchievement
                ? 'radial-gradient(120% 90% at 50% 0%, #1A1712 0%, #0E0D0B 62%)'
                : 'linear-gradient(180deg, #FFFFFF 0%, #FBF8F3 60%)',
            }}
          >
            {/* Watermark */}
            <img
              src={isAchievement ? '/images/iceberg-x-mark-light.png' : '/images/iceberg-x-mark.png'}
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: '430px',
                height: '430px',
                opacity: isAchievement ? 0.045 : 0.035,
              }}
            />

            {/* Top Row: Lockup & Programme Type */}
            <div className="relative flex items-center justify-between gap-6">
              <img
                src={isAchievement ? '/images/iceberg-x-lockup-light.png' : '/images/iceberg-x-lockup.png'}
                alt="Iceberg X"
                className="h-[30px] w-auto block"
              />
              <div
                className="text-right text-[9px] font-bold tracking-[0.2em]"
                style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
              >
                {isAchievement ? 'ELITE TECHNOLOGY FELLOWSHIP' : 'INTERNSHIP · TECHNOLOGY FELLOWSHIP'}
              </div>
            </div>

            {/* Middle Block: Titles & Recipient */}
            <div className="relative flex flex-col items-center justify-center text-center my-auto py-1">
              <div
                className="inline-flex items-center h-6 px-3.5 rounded-full text-[9.5px] font-extrabold tracking-[0.18em]"
                style={{
                  border: isAchievement ? '1px solid rgba(201,150,43,0.55)' : '1px solid rgba(229,0,125,0.4)',
                  color: isAchievement ? '#C9962B' : '#E5007D',
                  background: isAchievement ? 'transparent' : 'rgba(229,0,125,0.05)',
                }}
              >
                {isAchievement ? 'CERTIFICATE OF ACHIEVEMENT' : 'CERTIFICATE OF PARTICIPATION'}
              </div>

              <h1
                className="font-serif font-normal text-[56px] leading-none tracking-[-0.015em] mt-3.5 mb-0"
                style={{ color: isAchievement ? '#FFFCF6' : '#14161A' }}
              >
                {isAchievement ? 'Certificate of Achievement' : 'Certificate of Participation'}
              </h1>

              <div
                className="text-[9px] font-bold tracking-[0.22em] mt-3"
                style={{ color: isAchievement ? '#8C8578' : '#8A93A0' }}
              >
                {isAchievement ? 'PROUDLY PRESENTED TO' : 'PRESENTED TO'}
              </div>

              <div
                className="text-[38px] font-extrabold tracking-tight leading-tight mt-2 pb-2 px-3 border-b"
                style={{
                  color: isAchievement ? '#FFFFFF' : '#0E1116',
                  borderColor: isAchievement ? 'rgba(201,150,43,0.6)' : 'rgba(229,0,125,0.45)',
                }}
              >
                {profile.user?.name || 'Fellowship Candidate'}
              </div>

              <div
                className="text-[10px] font-bold tracking-[0.14em] mt-2 font-sans"
                style={{ color: isAchievement ? '#8C8578' : '#8A93A0' }}
              >
                CUBE #{profile.cube_number} &nbsp;·&nbsp; PROGRAMME MENTOR:{' '}
                <span style={{ color: isAchievement ? '#E0B14E' : '#E5007D' }}>
                  {(record.mentor_name || 'Iceberg Mentor').toUpperCase()}
                </span>
              </div>

              <p
                className="text-[12.5px] leading-relaxed max-w-[650px] mt-3 mb-0 font-sans"
                style={{ color: isAchievement ? '#CFC7B8' : '#5B6472' }}
              >
                {isAchievement ? (
                  <>
                    In recognition of outstanding completion of the Iceberg Digital technology fellowship programme — earning every quest and badge recorded overleaf, and a permanent place as{' '}
                    <strong className="text-white font-bold">Cube #{profile.cube_number}</strong>.
                  </>
                ) : (
                  <>
                    For taking part in the Iceberg Digital technology internship programme, contributing to R&amp;D missions and completing the quests and badges recorded overleaf.
                  </>
                )}
              </p>
            </div>

            {/* 4 Stats Grid */}
            <div
              className="relative grid grid-cols-4 rounded-md overflow-hidden"
              style={{
                border: isAchievement ? '1px solid rgba(255,255,255,0.09)' : '1px solid #EAE4DA',
                background: isAchievement ? 'rgba(255,255,255,0.025)' : '#FFFFFF',
              }}
            >
              {statsList.map((s, idx) => (
                <div
                  key={idx}
                  className="py-2 px-3 text-center"
                  style={{
                    borderRight:
                      idx < 3
                        ? isAchievement
                          ? '1px solid rgba(255,255,255,0.07)'
                          : '1px solid #EFEAE1'
                        : 'none',
                  }}
                >
                  <div
                    className="font-mono text-[19px] font-semibold leading-tight"
                    style={{ color: isAchievement ? '#E0B14E' : '#E5007D' }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[8px] font-bold tracking-[0.16em] mt-1"
                    style={{ color: isAchievement ? '#98917F' : '#8A93A0' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Badges Pill Row */}
            <div className="relative flex items-center gap-2.5 pt-3">
              <span
                className="text-[8px] font-bold tracking-[0.16em] whitespace-nowrap"
                style={{ color: isAchievement ? '#8C8578' : '#8A93A0' }}
              >
                BADGES EARNED
              </span>
              <div className="flex-1 flex flex-wrap gap-1.5 overflow-hidden max-h-[26px]">
                {badges.slice(0, 8).map((b) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center h-5 px-2 rounded-full text-[9px] font-bold"
                    style={{
                      border: isAchievement ? '1px solid rgba(201,150,43,0.32)' : '1px solid #E6DFD4',
                      color: isAchievement ? '#EBE2D2' : '#3D4652',
                      background: isAchievement ? 'rgba(201,150,43,0.08)' : '#FFFFFF',
                    }}
                  >
                    {b.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Signatures & Verification Details */}
            <div
              className="relative flex items-end justify-between gap-6 pt-3 mt-3 border-t"
              style={{
                borderColor: isAchievement ? 'rgba(255,255,255,0.08)' : '#EAE4DA',
              }}
            >
              <div className="flex gap-7">
                {[
                  { name: 'Mark Burgess', role: 'CEO' },
                  { name: 'Yusuf Tokgöz', role: 'CTO' },
                  { name: 'Ahmet Onur Solmaz', role: 'HEAD OF ENGINEERING' },
                ].map((sig, idx) => (
                  <div key={idx} className="min-w-[105px]">
                    <div
                      className="h-[1px] mb-1.5"
                      style={{ background: isAchievement ? 'rgba(255,255,255,0.22)' : '#D6CFC2' }}
                    />
                    <div
                      className="text-[10px] font-bold leading-tight"
                      style={{ color: isAchievement ? '#F6F1E7' : '#14161A' }}
                    >
                      {sig.name}
                    </div>
                    <div
                      className="text-[7.5px] font-bold tracking-[0.13em] mt-0.5"
                      style={{ color: isAchievement ? '#8C8578' : '#8A93A0' }}
                    >
                      {sig.role}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-3.5">
                <div
                  className="text-right font-mono text-[8.5px] leading-relaxed"
                  style={{ color: isAchievement ? '#98917F' : '#8A93A0' }}
                >
                  <div>
                    Certificate No:{' '}
                    <span style={{ color: isAchievement ? '#EBE2D2' : '#3D4652' }}>
                      {record.certificate_no}
                    </span>
                  </div>
                  <div>
                    Date of Issue:{' '}
                    <span style={{ color: isAchievement ? '#EBE2D2' : '#3D4652' }}>
                      {formattedDate}
                    </span>
                  </div>
                  <div>
                    Mentor:{' '}
                    <span style={{ color: isAchievement ? '#EBE2D2' : '#3D4652' }}>
                      {record.mentor_name}
                    </span>
                  </div>
                </div>

                <div
                  className="w-[52px] h-[52px] rounded p-1 flex flex-col items-center justify-center gap-0.5"
                  style={{
                    border: isAchievement ? '1px solid rgba(201,150,43,0.4)' : '1px solid rgba(229,0,125,0.35)',
                    background: isAchievement ? 'rgba(255,255,255,0.03)' : 'rgba(229,0,125,0.04)',
                  }}
                >
                  <img src={qrCodeImgSrc} alt="QR Code" className="w-[34px] h-[34px] object-contain" />
                  <span
                    className="text-[6px] font-extrabold tracking-widest leading-none"
                    style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                  >
                    VERIFY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PAGE 2: APPENDIX (QUEST & BADGE RECORD)
           ========================================================================= */}
        <section
          className={`certificate-page certificate-page-2 w-full max-w-[1120px] aspect-[297/210] p-[38px] box-border relative overflow-hidden select-text ${
            isAchievement
              ? 'bg-[#0E0D0B] text-[#F6F1E7]'
              : 'bg-[#FBF8F3] text-[#14161A]'
          }`}
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          <div
            className="relative h-full w-full flex flex-col justify-between rounded p-[26px_40px_22px] overflow-hidden box-border"
            style={{
              border: isAchievement ? '1px solid rgba(201,150,43,0.42)' : '1px solid rgba(229,0,125,0.3)',
              background: isAchievement ? '#100F0C' : '#FFFFFF',
            }}
          >
            {/* Header */}
            <div
              className="flex items-end justify-between gap-6 pb-3.5 border-b"
              style={{
                borderColor: isAchievement ? 'rgba(201,150,43,0.28)' : '#EDE7DD',
              }}
            >
              <div className="flex items-end gap-3.5">
                <img
                  src={isAchievement ? '/images/iceberg-x-mark-light.png' : '/images/iceberg-x-mark.png'}
                  alt="Iceberg X"
                  className="h-9 w-9 block opacity-90"
                />
                <div>
                  <div
                    className="text-[8.5px] font-bold tracking-[0.2em]"
                    style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                  >
                    APPENDIX — VERIFIED RECORD
                  </div>
                  <h2
                    className="font-serif font-normal text-[28px] leading-tight mt-1 mb-0"
                    style={{ color: isAchievement ? '#FFFCF6' : '#14161A' }}
                  >
                    Quest &amp; Badge Record
                  </h2>
                </div>
              </div>
              <div className="text-right leading-tight">
                <div className="text-[12.5px] font-extrabold font-sans">
                  {profile.user?.name} · Cube #{profile.cube_number}
                </div>
                <div
                  className="font-mono text-[9px] mt-1"
                  style={{ color: isAchievement ? '#98917F' : '#8A93A0' }}
                >
                  {record.certificate_no} · {profile.cohort || 'Fellowship Cohort'}
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Completed Quests & Badges Earned */}
            <div className="flex-1 grid grid-cols-2 gap-8 pt-3.5 min-h-0 overflow-hidden">
              {/* Left Column: Completed Quests */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-[8.5px] font-extrabold tracking-[0.18em]"
                    style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                  >
                    COMPLETED QUESTS
                  </span>
                  <span
                    className="font-mono text-[9.5px]"
                    style={{ color: isAchievement ? '#98917F' : '#8A93A0' }}
                  >
                    ({questsCount})
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-white/5 overflow-hidden">
                  {quests.slice(0, 5).map((q: any) => {
                    const rStyle = isAchievement
                      ? RARITY_COLORS[q.rarity] || RARITY_COLORS.COMMON
                      : RARITY_COLORS_LIGHT[q.rarity] || RARITY_COLORS_LIGHT.COMMON;
                    return (
                      <div
                        key={q.id}
                        className="py-2"
                        style={{
                          borderTop: isAchievement
                            ? '1px solid rgba(255,255,255,0.07)'
                            : '1px solid #EFEAE1',
                        }}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <div
                            className="text-[12px] font-bold leading-tight truncate"
                            style={{ color: isAchievement ? '#FFFFFF' : '#14161A' }}
                          >
                            {q.title}
                          </div>
                          <span
                            className="inline-flex items-center h-4 px-1.5 rounded text-[7.5px] font-black tracking-wider whitespace-nowrap"
                            style={{
                              border: `1px solid ${rStyle.border}`,
                              color: rStyle.color,
                            }}
                          >
                            {q.rarity}
                          </span>
                        </div>
                        <p
                          className="text-[10px] leading-normal line-clamp-2 mt-1 mb-0"
                          style={{ color: isAchievement ? '#A9A292' : '#6B7480' }}
                        >
                          {q.criteria}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span
                            className="text-[9px] font-bold truncate"
                            style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                          >
                            ↳ {q.badge}
                          </span>
                          <span
                            className="font-mono text-[8.5px] flex-none"
                            style={{ color: isAchievement ? '#7E7869' : '#9AA2AE' }}
                          >
                            {q.date}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {quests.length === 0 && (
                    <div className="py-4 text-xs italic text-stone-500">
                      No verified quest records listed yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Badges Earned */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-[8.5px] font-extrabold tracking-[0.18em]"
                    style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                  >
                    BADGES EARNED
                  </span>
                  <span
                    className="font-mono text-[9.5px]"
                    style={{ color: isAchievement ? '#98917F' : '#8A93A0' }}
                  >
                    ({badgesCount})
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-white/5 overflow-hidden">
                  {badges.slice(0, 6).map((b: any) => {
                    const rStyle = isAchievement
                      ? RARITY_COLORS[b.rarity] || RARITY_COLORS.COMMON
                      : RARITY_COLORS_LIGHT[b.rarity] || RARITY_COLORS_LIGHT.COMMON;
                    return (
                      <div
                        key={b.id}
                        className="flex gap-2.5 py-2"
                        style={{
                          borderTop: isAchievement
                            ? '1px solid rgba(255,255,255,0.07)'
                            : '1px solid #EFEAE1',
                        }}
                      >
                        <div
                          className="w-6 h-6 flex-none rounded flex items-center justify-center font-serif text-[13px] font-normal"
                          style={{
                            border: isAchievement ? '1px solid rgba(201,150,43,0.3)' : '1px solid #EFD9E8',
                            background: isAchievement ? 'rgba(201,150,43,0.09)' : 'rgba(229,0,125,0.05)',
                            color: isAchievement ? '#E0B14E' : '#E5007D',
                          }}
                        >
                          {b.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span
                              className="text-[11.5px] font-bold truncate"
                              style={{ color: isAchievement ? '#FFFFFF' : '#14161A' }}
                            >
                              {b.name}
                            </span>
                            <span
                              className="text-[7.5px] font-black tracking-wider"
                              style={{ color: rStyle.color }}
                            >
                              {b.rarity}
                            </span>
                          </div>
                          <div
                            className="text-[9.5px] leading-snug line-clamp-2 mt-0.5"
                            style={{ color: isAchievement ? '#A9A292' : '#6B7480' }}
                          >
                            {b.reason}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {badges.length === 0 && (
                    <div className="py-4 text-xs italic text-stone-500">
                      No badges awarded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Appendix Footer */}
            <div
              className="flex items-center justify-between gap-4 pt-2.5 mt-2 border-t text-[8px]"
              style={{
                borderColor: isAchievement ? 'rgba(255,255,255,0.08)' : '#EDE7DD',
                color: isAchievement ? '#7E7869' : '#9AA2AE',
              }}
            >
              <span
                className="font-bold tracking-[0.14em]"
                style={{ color: isAchievement ? '#8C8578' : '#8A93A0' }}
              >
                ONCE A CUBE, ALWAYS A CUBE
              </span>
              <span className="font-mono">
                Automatically verified by the Iceberg X Fellowship portal · {window.location.host}/verify/{record.certificate_no}
              </span>
            </div>
          </div>
        </section>

      </div>

      {/* Dedicated Print Stylesheet for exactly 2-page A4 Landscape */}
      <style>{`
        @page {
          size: 297mm 210mm;
          margin: 0 !important;
        }
        @media print {
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            background: #ffffff !important;
            overflow: visible !important;
          }
          #root {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
          }
          .no-print, nav, header, footer, aside {
            display: none !important;
          }
          .certificate-screen-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 0 !important;
            height: auto !important;
            background: transparent !important;
            display: block !important;
            width: 297mm !important;
          }
          .certificate-print-container {
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
            display: block !important;
            width: 297mm !important;
          }
          .certificate-page {
            width: 297mm !important;
            height: 209.5mm !important;
            max-width: 297mm !important;
            max-height: 209.5mm !important;
            min-width: 297mm !important;
            min-height: 209.5mm !important;
            margin: 0 !important;
            padding: 38px !important;
            box-sizing: border-box !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            position: relative !important;
          }
          .certificate-page-1 {
            page-break-after: always !important;
            break-after: page !important;
            page-break-before: avoid !important;
            break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .certificate-page-2 {
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-before: always !important;
            break-before: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};
