import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ShieldCheck, ShieldAlert, Award, Calendar, Clock, ExternalLink, Check, Copy, Share2 } from 'lucide-react';

const RARITY_THEME: Record<string, { color: string; bg: string; icon: string }> = {
  COMMON: { color: '#4A5361', bg: '#F1F3F6', icon: 'linear-gradient(150deg, #5B6472, #3D4652)' },
  RARE: { color: '#1E5CB8', bg: '#E8F0FD', icon: 'linear-gradient(150deg, #3BA7F0, #1E5CB8)' },
  EPIC: { color: '#6D28D9', bg: '#F3E9FE', icon: 'linear-gradient(150deg, #E5007D, #6D28D9)' },
};

export const PublicProfile: React.FC = () => {
  const { cubeNumber, certNo } = useParams<{ cubeNumber?: string; certNo?: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (certNo) {
          // Accessed via /verify/:certNo
          const verifyRes = await api.get(`/offboarding/verify/${certNo}`);
          // Load public profile using cube_number or cube_id
          const pubRes = await api.get(`/cubes/public/${verifyRes.cube_number || verifyRes.cube_id}`);
          setData(pubRes);
        } else if (cubeNumber) {
          // Accessed via /x/:cubeNumber
          const pubRes = await api.get(`/cubes/public/${cubeNumber}`);
          setData(pubRes);
        } else {
          setError('No Cube identifier provided.');
        }
      } catch (err: any) {
        setError(err.message || 'Profile or Certificate not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [cubeNumber, certNo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5007D] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data || !data.profile) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-between py-12 px-4 font-sans">
        <div className="max-w-md w-full mx-auto flex flex-col gap-6">
          <div className="text-center">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <img src="/images/iceberg-x-lockup.png" alt="Iceberg X" className="h-7 mx-auto block" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 flex flex-col gap-5 text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">Profile Not Found</h3>
              <p className="text-xs text-red-500 font-bold uppercase tracking-wider mt-1">Verification Failed</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {error || 'The requested profile or certificate record could not be found.'}
            </p>
            <Link
              to="/"
              className="mt-2 w-full py-3 bg-[#11151C] hover:bg-black text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-black/10"
            >
              <span>Iceberg X Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats, missions = [] } = data;
  const offboarding = profile.offboarding_record;
  const isAlumni = !!offboarding;
  const isAchievement = offboarding?.type === 'success' || offboarding?.type === 'achievement';

  const profileUrl = window.location.href;
  const name = profile.user?.name || `Cube #${profile.cube_number}`;
  const mentorName = profile.assigned_mentor?.name || offboarding?.mentor_name || 'Iceberg Engineering Mentor';
  const questsCount = stats?.questsCompleted ?? (profile.cube_quests?.length || 0);
  const badgesCount = stats?.badgesEarned ?? (profile.cube_badges?.length || 0);
  const missionContributionsCount = stats?.missionContributions ?? missions.length;
  const attendanceRateVal = stats?.attendanceRate !== null && stats?.attendanceRate !== undefined
    ? `${stats.attendanceRate}%`
    : '100%';

  const rareBadgesCount = (profile.cube_badges || []).filter(
    (b: any) => (b.badge?.rarity || '').toUpperCase() === 'RARE' || (b.badge?.rarity || '').toUpperCase() === 'EPIC'
  ).length;

  // Social sharing
  const shareText = `${name} — Iceberg X Fellowship ${isAlumni ? 'Alumni' : 'Fellow'} · ${questsCount} quests, ${badgesCount} badges.`;

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=680,height=620');
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=680,height=620');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#11151C] font-sans pb-16">
      {/* Top Navigation */}
      <header className="flex items-center justify-between gap-5 px-6 py-3.5 bg-white border-b border-[#E7E9EE] sticky top-0 z-20">
        <Link to="/" className="flex items-center">
          <img src="/images/iceberg-x-lockup.png" alt="Iceberg X" className="h-6 w-auto block" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#E6F6F7] text-[#0E7C86] text-xs font-bold">
            <i className="w-1.5 h-1.5 rounded-full bg-[#12A150] block"></i>
            Verified Profile
          </span>
          <a
            href="https://x.iceberg-digital.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#6B7480] hover:text-[#11151C] transition-colors"
          >
            About Fellowship ↗
          </a>
        </div>
      </header>

      <main className="max-w-[1020px] mx-auto px-6">
        {/* Hero Section */}
        <section className="relative mt-6 rounded-[20px] overflow-hidden bg-[radial-gradient(110%_120%_at_8%_0%,_#1E2129_0%,_#0E1116_60%)] text-[#F2F4F7]">
          <img
            src="/images/iceberg-x-mark-light.png"
            alt=""
            className="absolute -right-14 -top-16 w-[340px] h-[340px] opacity-[0.06] pointer-events-none"
          />

          <div className="relative flex flex-wrap items-end gap-6 p-8 pb-6">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={name}
                className="w-24 h-24 flex-none rounded-[26px] object-cover shadow-xl border-2 border-white/10"
              />
            ) : (
              <div className="w-24 h-24 flex-none rounded-[26px] bg-gradient-to-br from-[#E5007D] to-[#7A0B58] flex items-center justify-center text-3xl font-extrabold tracking-tight shadow-xl shadow-[#E5007D]/25">
                {getInitials(name)}
              </div>
            )}

            {/* Candidate Info */}
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="inline-flex items-center h-6 px-2.5 rounded-full text-[10.5px] font-extrabold tracking-wider"
                  style={{
                    border: isAlumni ? '1px solid rgba(229,0,125,0.5)' : '1px solid rgba(14,124,134,0.5)',
                    background: isAlumni ? 'rgba(229,0,125,0.14)' : 'rgba(14,124,134,0.14)',
                    color: isAlumni ? '#FF7CC0' : '#4DD4E0',
                  }}
                >
                  {isAlumni ? 'ALUMNI' : (profile.current_level || 'CUBE').toUpperCase()}
                </span>
                <span className="font-mono text-xs text-[#9AA2AE]">
                  CUBE #{profile.cube_number} · {(profile.cohort || 'FELLOWSHIP COHORT').toUpperCase()}
                </span>
              </div>

              <h1 className="text-[38px] font-extrabold tracking-tight leading-tight mt-2.5 mb-0">
                {name}
              </h1>

              <p className="text-sm leading-relaxed text-[#B7BDC7] max-w-[580px] mt-2 mb-0">
                Iceberg X Technology Fellowship {isAlumni ? 'graduate' : 'fellow'}. Working on R&amp;D missions
                across software engineering and innovation, mentored by{' '}
                <strong className="text-white font-bold">{mentorName}</strong>.
              </p>
            </div>

            {/* Social Sharing Actions */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={handleShareLinkedIn}
                className="flex items-center gap-2 h-11 px-4 border-none rounded-xl bg-[#E5007D] hover:bg-[#C90070] text-white font-bold text-[13px] cursor-pointer transition-all shadow-md shadow-[#E5007D]/20"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={handleShareX}
                className="flex items-center gap-2 h-11 px-4 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 text-[#F2F4F7] font-bold text-[13px] cursor-pointer transition-all"
              >
                Post on X
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 h-11 px-4 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 text-[#F2F4F7] font-bold text-[13px] cursor-pointer transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied ✓' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 border-t border-white/10">
            {[
              { value: questsCount, label: 'QUESTS COMPLETED' },
              { value: badgesCount, label: 'BADGES EARNED' },
              { value: missionContributionsCount, label: 'MISSION CONTRIBUTIONS' },
              { value: attendanceRateVal, label: 'MEETING ATTENDANCE' },
            ].map((st, idx) => (
              <div
                key={idx}
                className="py-4 px-6 border-b sm:border-b-0 border-white/10 sm:border-r last:border-r-0"
              >
                <div className="font-mono text-2xl font-semibold text-white leading-tight">
                  {st.value}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-[#8A93A0] mt-1">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badges Earned Section */}
        <section className="mt-7">
          <div className="flex items-baseline justify-between gap-4 mb-3.5">
            <h2 className="text-xl font-extrabold tracking-tight m-0">Badges Earned</h2>
            <span className="text-xs font-semibold text-[#8A93A0]">
              {badgesCount} badges {rareBadgesCount > 0 && `· ${rareBadgesCount} rare`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {(profile.cube_badges || []).map((cb: any) => {
              const rarity = (cb.badge?.rarity || 'COMMON').toUpperCase();
              const rTheme = RARITY_THEME[rarity] || RARITY_THEME.COMMON;
              const dateStr = new Date(cb.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              return (
                <article
                  key={cb.id}
                  className="flex flex-col p-4 bg-white border border-[#E7E9EE] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 flex-none rounded-xl flex items-center justify-center font-serif text-lg text-white"
                      style={{ background: rTheme.icon }}
                    >
                      {(cb.badge?.name || 'B')[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold tracking-tight truncate">
                        {cb.badge?.name}
                      </div>
                      <span
                        className="inline-flex items-center h-5 px-2 mt-1 rounded text-[9.5px] font-black tracking-wider"
                        style={{ color: rTheme.color, background: rTheme.bg }}
                      >
                        {rarity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-[#6B7480] line-clamp-2 mt-3 mb-0">
                    {cb.mission?.title
                      ? `Mission contribution: ${cb.mission.title}`
                      : cb.badge?.description || 'Fellowship achievement'}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-[#F1F3F6] font-mono text-[10.5px] text-[#9AA2AE]">
                    {dateStr}
                  </div>
                </article>
              );
            })}
            {badgesCount === 0 && (
              <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs font-semibold">
                No badges earned yet.
              </div>
            )}
          </div>
        </section>

        {/* Dual Grid: Completed Quests & Certificate Showcase */}
        <section className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Completed Quests Column */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-3.5">Completed Quests</h2>
            <div className="bg-white border border-[#E7E9EE] rounded-2xl overflow-hidden divide-y divide-[#F1F3F6]">
              {(profile.cube_quests || []).map((cq: any) => {
                const q = cq.quest;
                const dateStr = new Date(cq.completed_at || cq.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                return (
                  <div key={cq.id} className="flex gap-3 p-4">
                    <div className="w-5 h-5 flex-none rounded-full bg-[#E9F7EE] text-[#12A150] flex items-center justify-center text-xs font-extrabold mt-0.5">
                      ✓
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold tracking-tight text-[#11151C] truncate">
                          {q?.title || 'Fellowship Quest'}
                        </span>
                        <span className="font-mono text-[10px] text-[#9AA2AE] flex-none">
                          {dateStr}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#6B7480] line-clamp-2 mt-1 mb-0">
                        {q?.criteria || q?.description || 'Successfully completed fellowship milestone.'}
                      </p>
                      {q?.rewards?.[0]?.name && (
                        <div className="text-[11px] font-bold text-[#E5007D] mt-1.5">
                          ↳ unlocked Badge: {q.rewards[0].name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {questsCount === 0 && (
                <div className="p-8 text-center text-gray-400 text-xs font-semibold">
                  No completed quests recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Certificate Column */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-3.5">Certificate</h2>
            <div className="bg-white border border-[#E7E9EE] rounded-2xl overflow-hidden">
              {isAlumni ? (
                <>
                  {/* Mini Certificate Preview */}
                  <div className="p-4 pb-0">
                    <div
                      className={`rounded-xl p-4 flex flex-col aspect-[11/8.5] relative overflow-hidden ${
                        isAchievement
                          ? 'bg-[radial-gradient(120%_90%_at_50%_0%,_#1A1712_0%,_#0E0D0B_62%)] border border-amber-500/40 text-[#F6F1E7]'
                          : 'bg-gradient-to-b from-white to-[#FBF8F3] border border-[#E5007D]/30 text-[#14161A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <img
                          src={isAchievement ? '/images/iceberg-x-lockup-light.png' : '/images/iceberg-x-lockup.png'}
                          alt=""
                          className="h-3.5 w-auto"
                        />
                        <span
                          className="text-[6px] font-bold tracking-[0.16em]"
                          style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                        >
                          {isAchievement ? 'ELITE TECHNOLOGY FELLOWSHIP' : 'INTERNSHIP · TECHNOLOGY FELLOWSHIP'}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
                        <span
                          className="text-[6.5px] font-extrabold tracking-[0.14em]"
                          style={{ color: isAchievement ? '#C9962B' : '#E5007D' }}
                        >
                          {isAchievement ? 'CERTIFICATE OF ACHIEVEMENT' : 'CERTIFICATE OF PARTICIPATION'}
                        </span>
                        <span
                          className="font-serif text-2xl leading-tight mt-1"
                          style={{ color: isAchievement ? '#FFFCF6' : '#14161A' }}
                        >
                          {isAchievement ? 'Certificate of Achievement' : 'Certificate of Participation'}
                        </span>
                        <span
                          className="text-base font-extrabold mt-2 pb-1 border-b"
                          style={{
                            color: isAchievement ? '#FFFFFF' : '#0E1116',
                            borderColor: isAchievement ? 'rgba(201,150,43,0.6)' : 'rgba(229,0,125,0.45)',
                          }}
                        >
                          {name}
                        </span>
                        <span
                          className="text-[6.5px] font-bold tracking-wider mt-1.5 font-sans"
                          style={{ color: isAchievement ? '#8C8578' : '#8A93A0' }}
                        >
                          CUBE #{profile.cube_number} · MENTOR: {(mentorName || '').toUpperCase()}
                        </span>
                      </div>

                      <div
                        className="flex items-end justify-between pt-2 border-t text-[6.5px]"
                        style={{
                          borderColor: isAchievement ? 'rgba(255,255,255,0.09)' : '#EAE4DA',
                          color: isAchievement ? '#8C8578' : '#8A93A0',
                        }}
                      >
                        <span className="font-bold">M. Burgess · Y. Tokgöz · {mentorName}</span>
                        <span className="font-mono text-[#98917F]">{offboarding.certificate_no}</span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Meta & Actions */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#6B7480]">Certificate No</span>
                      <span className="font-mono font-bold text-[#11151C]">{offboarding.certificate_no}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs mt-1.5">
                      <span className="text-[#6B7480]">Issued</span>
                      <span className="font-bold">
                        {new Date(offboarding.issue_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2.5 mt-3.5">
                      <Link
                        to={`/offboarding/certificate/${profile.id}?download=true`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center h-10 rounded-xl bg-[#11151C] hover:bg-black text-white text-xs font-bold transition-colors"
                      >
                        Download PDF
                      </Link>
                      <Link
                        to={`/verify/${offboarding.certificate_no}`}
                        className="flex-1 flex items-center justify-center h-10 rounded-xl border border-[#E1E4EA] hover:border-gray-400 text-[#4A5361] text-xs font-bold transition-colors"
                      >
                        Verify ↗
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                /* Ongoing Fellowship Journey (Active Cube) */
                <div className="p-6 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#11151C]">Fellowship Journey in Progress</h3>
                    <p className="text-xs text-[#6B7480] max-w-xs mx-auto mt-1 leading-relaxed">
                      Currently active in the Iceberg X Fellowship programme. Offboarding certificate and verified achievement appendix will be awarded upon graduation.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-[#4A5361] text-[11px] font-bold">
                    <span>Level: {profile.current_level}</span>
                    <span>·</span>
                    <span>Mentor: {mentorName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mission Contributions list */}
            {missions.length > 0 && (
              <div className="mt-4 p-4 bg-white border border-[#E7E9EE] rounded-2xl">
                <div className="text-[11px] font-extrabold tracking-wider text-[#8A93A0] mb-2">
                  MISSION CONTRIBUTIONS
                </div>
                <div className="divide-y divide-[#F1F3F6]">
                  {missions.map((m: any, idx: number) => (
                    <div key={idx} className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <span className="text-xs font-bold text-[#11151C] truncate">{m.title}</span>
                      <span className="text-[10.5px] font-bold text-[#8A93A0] flex-none uppercase">
                        {m.role || 'Contributor'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3.5 mt-8 pt-5 border-t border-[#E1E4EA]">
          <span className="text-xs font-bold tracking-wider text-[#8A93A0]">
            ONCE A CUBE, ALWAYS A CUBE
          </span>
          <span className="font-mono text-xs text-[#9AA2AE]">
            iceberg.digital/x/{profile.cube_number} · verified by the Iceberg X Fellowship portal
          </span>
        </footer>
      </main>
    </div>
  );
};
