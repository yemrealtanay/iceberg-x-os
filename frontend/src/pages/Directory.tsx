import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ShieldAlert, ShieldCheck, Award, Sparkles, Trash, Rocket, AlertCircle, GraduationCap, Clock, Mail, XCircle } from 'lucide-react';
import { getLevelMeta, isInProgramme } from '../utils/cubeStatus';
import { UserAvatar } from '../components/UserAvatar';

export const Directory: React.FC = () => {
  const { user } = useAuth();
  const [cubes, setCubes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all', 'assigned', 'unassigned'
  const [ndaFilter, setNdaFilter] = useState<'all' | 'signed' | 'pending' | 'not_sent' | 'not_signed'>('all');
  const [showAlumni, setShowAlumni] = useState(false);

  // Alumni are excluded by default and fetched only when asked for, so the
  // directory stays a view of the people currently around rather than an
  // ever-growing archive.
  const fetchCubes = async (withAlumni: boolean) => {
    try {
      setLoading(true);
      const res = await api.get(withAlumni ? '/cubes?includeAlumni=true' : '/cubes');
      setCubes(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Cube directory');
    } finally {
      setLoading(false);
    }
  };

  const getActiveMission = (cube: any) => {
    if (!cube.team_memberships || cube.team_memberships.length === 0) return null;
    const activeMem = cube.team_memberships.find((m: any) => {
      const mission = m.team?.mission;
      if (!mission) return false;
      return !['completed', 'reviewed', 'promoted_to_product_backlog', 'archived', 'cancelled'].includes(mission.status);
    });
    return activeMem?.team?.mission || null;
  };

  useEffect(() => {
    fetchCubes(showAlumni);
  }, [showAlumni]);

  const handleDeleteClick = async (e: React.MouseEvent, cube: any) => {
    e.stopPropagation();
    e.preventDefault();
    const confirmName = prompt(
      `To permanently delete this Cube, please type their exact name: "${cube.user.name}"`
    );
    if (confirmName !== cube.user.name) {
      alert("Name mismatch. Deletion cancelled.");
      return;
    }

    try {
      await api.delete(`/admin/users/${cube.user_id}`);
      alert("Cube deleted successfully.");
      fetchCubes(showAlumni);
    } catch (err: any) {
      alert(err.message || "Failed to delete Cube");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  // Filter cubes
  const filteredCubes = cubes.filter((cube) => {
    const isOriginalCube = parseInt(cube.cube_number, 10) === 0;
    const normalizedSearch = searchQuery.toLowerCase();
    const matchesSearch =
      cube.user.name.toLowerCase().includes(normalizedSearch) ||
      cube.cube_number.toLowerCase().includes(normalizedSearch) ||
      (isOriginalCube && 'the original cube no further information available classified'.includes(normalizedSearch)) ||
      (cube.university || '').toLowerCase().includes(normalizedSearch) ||
      (cube.skills || []).some((s: string) => s.toLowerCase().includes(normalizedSearch));

    const matchesLevel = levelFilter ? cube.current_level === levelFilter : true;

    const activeMission = getActiveMission(cube);
    // Only people doing the programme can meaningfully be "unassigned";
    // Icebergers, Former Cubes and Alumni are not waiting for a mission.
    const isUnassigned = !activeMission && isInProgramme(cube.current_level);
    const matchesAssignment =
      assignmentFilter === 'all'
        ? true
        : assignmentFilter === 'unassigned'
          ? isUnassigned
          : !!activeMission;

    const effectiveNdaStatus = cube.nda_status || (cube.nda_signed ? 'signed' : 'not_sent');
    const matchesNda =
      ndaFilter === 'all'
        ? true
        : effectiveNdaStatus === ndaFilter;

    return matchesSearch && matchesLevel && matchesAssignment && matchesNda;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cube Directory</h1>
        <p className="text-gray-500 mt-1">Directory of all active and past fellowship builders.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-subtle flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, university, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-semibold text-xs transition-all"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                // Picking Alumni explicitly has to pull them in from the server
                if (e.target.value === 'Alumni') setShowAlumni(true);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
            >
              <option value="">All Statuses (Levels)</option>
              <option value="Cube">Cube</option>
              <option value="Senior_Cube">Senior Cube</option>
              <option value="Iceberger">Iceberger</option>
              <option value="Former_Cube">Former Cube</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          <label
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-colors select-none ${
              showAlumni
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100/50'
            }`}
            title="Alumni have graduated out of the programme and are hidden by default"
          >
            <input
              type="checkbox"
              checked={showAlumni}
              onChange={(e) => {
                setShowAlumni(e.target.checked);
                if (!e.target.checked && levelFilter === 'Alumni') setLevelFilter('');
              }}
              className="w-3.5 h-3.5 rounded text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
            />
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-bold whitespace-nowrap">Show Alumni</span>
          </label>
          {(user?.role === 'ADMIN' || user?.role === 'MENTOR') && (
            <div className="relative flex-1 md:w-48">
              <Filter className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer text-slate-800"
              >
                <option value="all">All Assignments</option>
                <option value="unassigned">Unassigned</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>
          )}

          <div className="relative flex-1 md:w-44">
            <ShieldCheck className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
            <select
              value={ndaFilter}
              onChange={(e) => setNdaFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer text-slate-800"
            >
              <option value="all">All NDA Statuses</option>
              <option value="signed">✓ NDA Signed</option>
              <option value="pending">⏳ NDA Pending</option>
              <option value="not_sent">✉ NDA Not Sent</option>
              <option value="not_signed">✕ NDA Not Signed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredCubes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCubes.map((cube) => {
            const isOriginalCube = parseInt(cube.cube_number, 10) === 0;
            const isFounding = cube.is_founding_cube;
            const isIceberger = cube.current_level === 'Iceberger';

            if (isOriginalCube) {
              return (
                <div
                  key={cube.id}
                  className="p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between gap-6 relative overflow-hidden bg-[#111113] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                >
                  <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full border border-white/10 opacity-60"></div>
                  <div className="absolute right-6 bottom-6 text-[8rem] font-black leading-none text-white/[0.03] select-none">X</div>
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-magenta">Classified Record</p>
                      <h3 className="mt-3 text-2xl font-black tracking-tight text-white">Cube #{cube.cube_number}</h3>
                    </div>
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-400">
                      Classified
                    </span>
                  </div>

                  <div className="relative z-10 space-y-3 text-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Classification</p>
                      <p className="mt-1 font-extrabold text-white">The Original Cube</p>
                    </div>
                    <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-white/55">
                      No further information available.
                    </p>
                  </div>
                </div>
              );
            }

            let cardClassName = "p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between gap-5 group relative ";
            const activeMission = getActiveMission(cube);
            const isUnassigned = !activeMission;
            const isAlumni = cube.current_level === 'Alumni';
            const isFormer = cube.current_level === 'Former_Cube';
            // Icebergers, Former Cubes and Alumni are not doing the programme,
            // so "no active mission" is expected, not something to flag.
            const hasLeftProgramme = isAlumni || isFormer || isIceberger;

            if (isAlumni) {
              // Deliberately unlike every other card: muted, sepia, no hover
              // lift. Graduates are a record, not part of the working roster.
              cardClassName += "bg-gradient-to-br from-amber-50/60 via-stone-50 to-stone-100 border border-dashed border-amber-300/70 opacity-90 hover:opacity-100";
            } else if (isIceberger) {
              cardClassName += "bg-gradient-to-br from-[#0c1b33] via-[#090f1d] to-[#04060c] border-2 border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:-translate-y-1 text-white";
            } else if (isFormer) {
              cardClassName += "bg-slate-50 border border-slate-200 border-dashed hover:border-slate-300 shadow-none";
            } else if (isFounding) {
              cardClassName += "bg-gradient-to-br from-amber-50/20 via-white to-white border-2 border-amber-400/80 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:-translate-y-1";
            } else {
              const alertUnassigned = (user?.role === 'ADMIN' || user?.role === 'MENTOR') && isUnassigned;
              if (alertUnassigned) {
                cardClassName += "bg-red-50/30 border-2 border-red-200 hover:border-red-300 hover:-translate-y-1 shadow-subtle hover:shadow-premium";
              } else {
                cardClassName += "bg-white border border-gray-100 hover:border-magenta/20 hover:-translate-y-1 shadow-subtle hover:shadow-premium";
              }
            }

            return (
              <div
                key={cube.id}
                className={cardClassName}
              >
                <div className="flex flex-col gap-4">
                  {/* Top Metadata Row: Number + Status Pills on Left, NDA + Admin Actions on Right */}
                  <div className="flex items-center justify-between gap-2 min-h-[1.75rem]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-lg border ${
                        isIceberger
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                          : isFounding
                            ? 'bg-amber-400/10 border-amber-400/25 text-amber-700'
                            : 'bg-magenta/5 border-magenta/15 text-magenta'
                      }`}>
                        #{cube.cube_number}
                      </span>
                      <span
                        title={getLevelMeta(cube.current_level).hint}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          isFounding && !hasLeftProgramme
                            ? 'text-amber-700 bg-amber-400/10 border-amber-400/20'
                            : getLevelMeta(cube.current_level).badge
                        }`}
                      >
                        {getLevelMeta(cube.current_level).label}
                      </span>
                      {isFounding && (
                        <span className="bg-amber-400/10 border border-amber-400/20 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs uppercase tracking-wider">
                          <Award className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>Founding</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {(() => {
                        const status = cube.nda_status || (cube.nda_signed ? 'signed' : 'not_sent');
                        if (status === 'signed') {
                          return (
                            <span
                              title={`NDA Signed${cube.nda_signed_at ? ' · ' + new Date(cube.nda_signed_at).toLocaleDateString('en-GB') : ''}`}
                              className="inline-flex items-center gap-1 font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>NDA</span>
                            </span>
                          );
                        }
                        if (status === 'pending') {
                          return (
                            <span
                              title="NDA Pending Signature"
                              className="inline-flex items-center gap-1 font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs"
                            >
                              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Pending</span>
                            </span>
                          );
                        }
                        if (status === 'not_signed') {
                          return (
                            <span
                              title="NDA Not Signed"
                              className="inline-flex items-center gap-1 font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 shadow-2xs"
                            >
                              <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                              <span>Not Signed</span>
                            </span>
                          );
                        }
                        return (
                          <span
                            title="NDA Not Sent"
                            className="inline-flex items-center gap-1 font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 shadow-2xs"
                          >
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>Not Sent</span>
                          </span>
                        );
                      })()}
                      {user?.role === 'ADMIN' && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(e, cube)}
                          className={`p-1.5 rounded-lg border text-red-600 transition z-20 ${
                            isIceberger
                              ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-300'
                              : 'bg-red-50 border-red-100 hover:bg-red-100'
                          }`}
                          title="Delete Cube"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Primary Identity Section: Avatar + Name (Spacious, Uncramped) */}
                  <Link
                    to={`/cubes/${cube.id}`}
                    className="flex items-start gap-3.5 group/link hover:opacity-90 transition-opacity pt-1"
                  >
                    <UserAvatar
                      name={cube.user.name}
                      avatarUrl={cube.avatar_url || cube.user.avatar_url}
                      size="md"
                      className={`shrink-0 shadow-sm transition-transform duration-200 group-hover/link:scale-105 ${
                        isIceberger ? 'ring-2 ring-cyan-400/40' : isFounding ? 'ring-2 ring-amber-400/40' : 'ring-2 ring-gray-100'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-black text-base tracking-tight leading-snug break-words flex items-center gap-1.5 ${
                        isIceberger
                          ? 'text-white group-hover/link:text-cyan-400'
                          : isFounding
                            ? 'text-gray-900 group-hover/link:text-amber-600'
                            : 'text-gray-900 group-hover/link:text-magenta'
                      }`}>
                        <span>{cube.user.name}</span>
                        {isFounding && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        {isIceberger && <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </h3>
                      <p className={`text-xs font-semibold mt-0.5 ${isIceberger ? 'text-cyan-300/70' : 'text-gray-400'}`}>
                        {cube.cohort || 'Fellowship'}
                      </p>
                    </div>
                  </Link>

                  {/* Program & Academic Details */}
                  <div className={`flex flex-col gap-1.5 text-xs pt-3 border-t ${
                    isIceberger ? 'border-cyan-500/15 text-slate-300' : 'border-gray-100/70 text-gray-500'
                  }`}>
                    <div className="flex items-start gap-1.5">
                      <span className={`font-bold shrink-0 ${isIceberger ? 'text-cyan-400/90' : 'text-gray-700'}`}>Uni:</span>
                      <span className="truncate" title={cube.university || 'N/A'}>
                        {cube.university || 'N/A'}
                      </span>
                    </div>
                    {cube.internship_status && (
                      <div className="flex items-start gap-1.5">
                        <span className={`font-bold shrink-0 ${isIceberger ? 'text-cyan-400/90' : 'text-gray-700'}`}>Current Role:</span>
                        <span className={`font-semibold line-clamp-1 ${isIceberger ? 'text-cyan-300' : 'text-magenta'}`} title={cube.internship_status}>
                          {cube.internship_status}
                        </span>
                      </div>
                    )}
                    {cube.assigned_mentor && (
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold shrink-0 ${isIceberger ? 'text-cyan-400/90' : 'text-gray-700'}`}>Mentor:</span>
                        <span className="font-semibold text-gray-700 dark:text-slate-200">
                          {cube.assigned_mentor.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Active Mission Section */}
                  {!hasLeftProgramme && (
                    <div className={`pt-2.5 border-t text-xs flex flex-col gap-1 ${
                      isIceberger ? 'border-cyan-500/15' : 'border-gray-100/70'
                    }`}>
                      <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">
                        Active Mission:
                      </span>
                      {activeMission ? (
                        <Link
                          to={`/missions/${activeMission.id}`}
                          className="text-magenta hover:text-magenta-hover font-bold hover:underline flex items-center gap-1.5 line-clamp-1"
                          title={activeMission.title}
                        >
                          <Rocket className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{activeMission.title}</span>
                        </Link>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center gap-1.5 text-xs">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Unassigned</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Skills Tags */}
                {cube.skills && cube.skills.length > 0 && (
                  <div className={`border-t pt-4 flex flex-wrap gap-1.5 ${isIceberger ? 'border-slate-800' : 'border-gray-50'}`}>
                    {cube.skills.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${
                          isIceberger
                            ? 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                            : 'bg-slate-50 border-gray-100 text-gray-500'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {cube.skills.length > 3 && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg border ${
                          isIceberger
                            ? 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                            : 'bg-slate-50 border-gray-100 text-gray-400'
                        }`}
                      >
                        +{cube.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-subtle">
          No Cubes match the selected filters.
        </p>
      )}
    </div>
  );
};
