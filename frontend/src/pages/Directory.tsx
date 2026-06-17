import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ShieldAlert, Award, Sparkles } from 'lucide-react';

export const Directory: React.FC = () => {
  const { user } = useAuth();
  const [cubes, setCubes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    const fetchCubes = async () => {
      try {
        const res = await api.get('/cubes');
        setCubes(res);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Cube directory');
      } finally {
        setLoading(false);
      }
    };

    fetchCubes();
  }, []);

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

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cube Directory</h1>
        <p className="text-gray-500 mt-1">Directory of all R&D internship participants and fellowship builders.</p>
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

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Filter className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
            >
              <option value="">All Statuses (Levels)</option>
              <option value="Cube">Cube</option>
              <option value="Senior_Cube">Senior Cube</option>
              <option value="Former_Cube">Former Cube</option>
              <option value="Iceberger">Iceberger</option>
              <option value="Alumni">Alumni</option>
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
            if (isIceberger) {
              cardClassName += "bg-gradient-to-br from-[#0c1b33] via-[#090f1d] to-[#04060c] border-2 border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:-translate-y-1 text-white";
            } else if (isFounding) {
              cardClassName += "bg-gradient-to-br from-amber-50/20 via-white to-white border-2 border-amber-400/80 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:-translate-y-1";
            } else {
              cardClassName += "bg-white border border-gray-100 hover:border-magenta/20 hover:-translate-y-1 shadow-subtle hover:shadow-premium";
            }

            return (
              <Link
                key={cube.id}
                to={`/cubes/${cube.id}`}
                className={cardClassName}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-extrabold transition-colors flex items-center gap-1.5 ${
                        isIceberger
                          ? 'text-white group-hover:text-cyan-400'
                          : isFounding
                            ? 'text-gray-900 group-hover:text-amber-600'
                            : 'text-gray-900 group-hover:text-magenta'
                      }`}>
                        <span>{cube.user.name}</span>
                        {isFounding && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse flex-shrink-0" />}
                        {isIceberger && <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse flex-shrink-0" />}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isIceberger ? 'text-cyan-300/60' : 'text-gray-400'}`}>{cube.cohort}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isFounding && (
                        <span className="bg-amber-400/10 border border-amber-400/30 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                          <Award className="w-3 h-3 text-amber-500" />
                          Founding Cube
                        </span>
                      )}
                      <span className={`font-extrabold text-xs px-2.5 py-0.5 rounded ${
                        isIceberger
                          ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                          : isFounding
                            ? 'bg-amber-400/10 border border-amber-400/20 text-amber-700'
                            : 'bg-magenta/5 border border-magenta/10 text-magenta'
                      }`}>
                        #{cube.cube_number}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                      isIceberger
                        ? 'text-cyan-300 bg-cyan-500/15 border-cyan-500/20'
                        : isFounding
                          ? 'text-amber-700 bg-amber-400/10 border-amber-400/20'
                          : 'text-magenta bg-magenta/5 border-magenta/10'
                    }`}>
                      {cube.current_level.replace('_', ' ')}
                    </span>
                  </div>

                  <div className={`mt-4 flex flex-col gap-1 text-xs ${isIceberger ? 'text-slate-300' : 'text-gray-500'}`}>
                    <p>
                      <span className={`font-bold ${isIceberger ? 'text-cyan-400/90' : 'text-gray-600'}`}>Uni:</span> {cube.university || 'N/A'}
                    </p>
                    {cube.internship_status && (
                      <p>
                        <span className={`font-bold ${isIceberger ? 'text-cyan-400/90' : 'text-gray-600'}`}>Current Role:</span>{' '}
                        <span className={isIceberger ? 'text-cyan-300 font-semibold' : 'text-magenta font-semibold'}>
                          {cube.internship_status}
                        </span>
                      </p>
                    )}
                    {cube.assigned_mentor && (
                      <p>
                        <span className={`font-bold ${isIceberger ? 'text-cyan-400/90' : 'text-gray-600'}`}>Mentor:</span> {cube.assigned_mentor.name}
                      </p>
                    )}
                  </div>
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
              </Link>
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
